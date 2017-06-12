import { Router } from 'express'
import db from '../../database/database'

import { PhoneNumberUtil } from 'google-libphonenumber'
import { validate as isEmail } from 'isemail'
const tel = PhoneNumberUtil.getInstance()

const router = new Router()

router.get('/profile', async (req, res) => {
  if (req.user) {
    try {
      let result = await db.one(`select * from customer where id = $[id]`, {
        id: req.user.id
      }).then(async data => {
        return {
          ...data,
          addresses: await db.manyOrNone(`
            select *
            from customer_address
            where
              customer_id = $[id]
            order by label
          `, { id: data.id })
        }
      })

      res.send(result)
    } catch (e) {
      res.status(500).send(new Error(e))
    }
  } else {
    res.send(new Error('You are logged out'))
  }
})

router.post('/profile/address', async (req, res) => {
  if (req.user) {
    try {
      const result = await db.one(`
        insert into customer_address (customer_id, label, line_1, line_2, city, state, zip) values
          ($[customer_id], $[label], $[line_1], $[line_2], $[city], $[state], $[zip])
        returning *
      `, {
        customer_id: req.user.id,
        label: req.body.label,
        line_1: req.body.line_1,
        line_2: req.body.line_2 || '',
        city: req.body.city,
        state: 'Puerto Rico',
        zip: req.body.zip
      })

      res.send(result)
    } catch (e) {
      console.log(e)
      res.status(500).send(new Error(e))
    }
  }
})

router.delete('/profile/address', async (req, res) => {
  if (req.user && req.body.id) {
    try {
      const result = await db.one(`
        delete from
          customer_address
        where
          customer_address.id = $[id]
          and customer_address.customer_id = $[customer_id]
        returning *
      `, {
        id: req.body.id,
        customer_id: req.user.id
      })

      res.send(result)
    } catch (e) {
      console.log(e)
      res.status(500).send(new Error(e))
    }
  }
})

router.put('/profile/address', async (req, res) => {
  if (req.user && req.body.id) {
    try {
      const result = await db.one(`
        update
          customer_address
        set
          label = $[label],
          line_1 = $[line_1],
          line_2 = $[line_2],
          city = $[city],
          zip = $[zip]
        where
          customer_address.id = $[id]
          and customer_address.customer_id = $[customer_id]
        returning *
      `, {
        id: req.body.id,
        customer_id: req.user.id,
        label: req.body.label,
        line_1: req.body.line_1,
        line_2: req.body.line_2 || '',
        city: req.body.city,
        zip: req.body.zip
      })

      res.send(result)
    } catch (e) {
      console.log(e)
      res.status(500).send(new Error(e))
    }
  }
})

const updateProfile = async (opts) => {
  return db.one(`
    update customer
    set
      first_name = $[first_name],
      last_name = $[last_name],
      email = $[email],
      phone_number = $[phone_number],
      text_notifications = $[text_notifications]
    where id = $[id]
    returning *
  `, opts)
  .catch(e => {
    if (e.constraint === 'customer_email_key') {
      return {
        error: 'That email address is used by another user'
      }
    } else {
      return {
        error: 'Server error'
      }
    }
  })
}

router.put('/profile', async (req, res) => {
  if (req.user && req.body && req.body.id === req.user.id) {
    const phoneNumber = tel.parse(req.body.phone_number, 'US')

    if (!isEmail(req.body.email)) {
      res.status(400).send({ error: 'Invalid email address' })
    } else if (!tel.isValidNumber(phoneNumber)) {
      res.status(400).send({ error: 'Invalid phone number' })
    } else {
      const data = {
        id: req.user.id,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        phone_number: tel.format(phoneNumber, 0),
        text_notifications: req.body.text_notifications
      }

      const newUser = await updateProfile(data)

      if (!newUser.error) {
        res.send(newUser)
      } else {
        res.status(400).send(newUser)
      }
    }
  } else {
    res.status(401).send()
  }
})

router.get('/orders', async (req, res) => {
  if (req.user) {
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
      where
        customer_order.customer_id = $[id]
      order by
        customer_order.creation_date desc
    `, { id: req.user.id })
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
  } else {
    res.status(401).send({ error: 'Unauthorized Request' })
  }
})

export default router
