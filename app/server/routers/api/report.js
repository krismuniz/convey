import { Router } from 'express'
import db from '../../database/database'

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

router.get('/sales-per-item', hasUser, isAdmin, (req, res) => {
  db.manyOrNone(`
    select
      item.id as id,
      item.name as item,
      item.price as price,
      order_group.creation_date
    from
      customer_order,
      order_group,
      group_item,
      item
    where
      order_group.id = group_item.order_group_id
      and order_group.customer_order_id = customer_order.id
      and group_item.item_id = item.id
      and customer_order.status_id = 5
  `).then((sales) => res.send(sales))
    .catch((e) => {
      console.log(e)
      res.status(500).send({ message: 'error' })
    })
})

router.get('/sales-per-customer', hasUser, isAdmin, (req, res) => {
  db.manyOrNone(`
    select
      customer.id,
      customer.first_name,
      customer.last_name,
      customer.phone_number,
      customer.email,
      order_group.creation_date,
      item.price
    from
      customer,
      customer_order,
      order_group,
      group_item,
      item
    where
      customer_order.customer_id = customer.id
      and order_group.customer_order_id = customer_order.id
      and order_group.id = group_item.order_group_id
      and group_item.item_id = item.id
      and customer_order.status_id = 5
  `).then((sales) => res.send(sales))
    .catch((e) => {
      console.log(e)
      res.status(500).send({ message: 'error' })
    })
})

export default router
