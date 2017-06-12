import { Router } from 'express'
import db from '../../database/database'
import pgp from 'pg-promise'

import notify from '../action/notify'
import charge from '../action/charge'

const router = new Router()

const hasUser = (req, res, next) => {
  if (req.user) {
    next()
  } else {
    res.status(401).send({ message: 'Not authorized' })
  }
}

const isAdmin = (req, res, next) => {
  if (req.user.is_admin) {
    next()
  } else {
    res.status(401).send({ message: 'Not authorized' })
  }
}

router.get('/all', hasUser, isAdmin, async (req, res) => {
  const orders = await db.manyOrNone(`
    select
      customer_order.id,
      customer_order.customer_id,
      customer_order.address_id,
      customer_order.status_id,
      status.label as status_label,
      customer_order.delivery,
      customer_order.delivery_fee,
      customer_order.tax_rate,
      customer_order.paid,
      customer_order.stripe_token,
      customer_order.stripe_charge,
      customer_order.creation_date,
      customer_order.comment,
      customer_address.label as address_label,
      customer_address.line_1 as address_line_1,
      customer_address.line_2 as address_line_2,
      customer_address.city as address_city,
      customer_address.state as address_state,
      customer_address.zip as address_zip,
      customer_address.creation_date as address_creation_date
    from
      customer_order
    left join
      status
      on customer_order.status_id = status.id
    left join
      customer_address
      on customer_order.address_id = customer_address.id
    order by
      customer_order.creation_date desc
  `)
    .then(orders => orders.map(obj => {
      let address = {}
      let order = {}
      let status = {}

      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          if ((/address/).test(key)) {
            address[`${key.replace('address_', '')}`] = obj[key]
          } else if ((/status/).test(key)) {
            status[`${key.replace('status_', '')}`] = obj[key]
          } else {
            order[key] = obj[key]
          }
        }
      }

      return {
        ...order,
        address,
        status,
        delivery_fee: Number(obj.delivery_fee),
        tax_rate: Number(obj.tax_rate)
      }
    })
    )
    .then(
      orders => Promise.all(
        orders.map(obj => {
          return db.one(`
            select
              id,
              first_name,
              last_name,
              email,
              phone_number,
              text_notifications,
              avatar_url,
              is_admin
            from customer
            where customer.id = $[id]
          `, { id: obj.customer_id })
            .then(customer => ({ customer, ...obj }))
        })
      )
    )
    .then(
      orders => Promise.all(
        orders.map(obj => {
          return db.manyOrNone(`
            select
              order_group.id,
              order_group.comment
            from
              order_group
            where
              order_group.customer_order_id = $[id]
            order by order_group.creation_date
            `,
            { id: obj.id }
          )
          .then(groups => Promise.all(
            groups.map(
              group => db.manyOrNone(`
                select
                  item.*,
                  type.label as type_label,
                  type.ingredient as is_ingredient
                from
                  group_item,
                  item,
                  type
                where
                  group_item.order_group_id = $[group_id]
                  and group_item.item_id = item.id
                  and item.type_id = type.id
                order by group_item.creation_date
              `, { group_id: group.id })
              .then(items => ({ items, ...group }))
            )
          ))
          .then(groups => ({ ...obj, groups }))
        })
      )
    )
    .catch(err => {
      console.log(new Error(err))
    })

  res.send(orders)
})

router.put('/', hasUser, isAdmin, async (req, res) => {
  const order = db.one(`
    update
      customer_order
    set
      status_id = $[status_id]
    where
      customer_order.id = $[id]
    returning *
  `, {
    status_id: req.body.status_id,
    id: req.body.id
  })
    .then(async order => {
      const customer = await db.one(`
        select * from customer where customer.id = $[customer_id]
      `, { customer_id: order.customer_id })

      notify(order, customer)
      charge(order, db, (err, charge) => {
        if (err) console.log(err)

        if (charge) {
          db.one(`
            update
              customer_order
            set
              stripe_charge = $[charge],
              paid = true
            where
              customer_order.id = $[id]
            returning *
          `, {
            id: order.id,
            charge: JSON.stringify(charge)
          })
            .then((order) => {
              console.log(`Charged order #${order.id}`)
              return order
            })
            .catch((e) => {
              console.error(e)
            })
        } else {
          db.one(`
            update
              customer_order
            set
              paid = true
            where
              customer_order.id = $[id]
            returning *
          `, {
            id: order.id,
            charge: JSON.stringify(charge)
          })
            .then((order) => {
              console.log(`Marked order #${order.id} as paid`)
              return order
            })
            .catch((e) => {
              console.error(e)
            })
        }
      })

      return order
    })

  res.send(order)
})

router.post('/', hasUser, async (req, res) => {
  // insert order row
  db.one(`
    insert into customer_order (
      customer_id,
      ${req.body.delivery ? 'address_id,' : ''}
      delivery,
      delivery_fee,
      tax_rate,
      comment,
      ${req.body.stripe_token ? 'stripe_token,' : ''}
      status_id
      ) values (
        $[customer_id],
        ${req.body.delivery ? '$[address_id],' : ''}
        $[delivery],
        $[delivery_fee],
        $[tax_rate],
        $[comment],
        ${req.body.stripe_token ? '$[stripe_token],' : ''}
        $[status_id]
      )
    returning customer_order.id
  `, {
    customer_id: req.user.id,
    address_id: req.body.delivery ? req.body.address.id : null,
    delivery: req.body.delivery,
    delivery_fee: pgp.as.number(199),
    tax_rate: pgp.as.number(0.115),
    comment: req.body.comment || null,
    stripe_token: req.body.stripe_token || null,
    status_id: 1
  }).then(async order => {
    req.body.groups.forEach(group => {
      return db.one(`
        insert into order_group ($[this~])
        values ($[customer_order_id])
        returning order_group.id
      `, {
        customer_order_id: order.id
      }).then(async groupTable => {
        return await Promise.all(
          group.items.map(
            item => db.one(`
              insert into group_item ($[this~])
              values ($[order_group_id], $[item_id])
              returning group_item.id
            `, {
              order_group_id: groupTable.id,
              item_id: item.id
            }).catch(e => console.log(e))
          )
        )
      })
    })

    res.send(order)
  }).catch(e => {
    console.log(e)
    res.send('Error')
  })
})

export default router
