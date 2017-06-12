import stripe from 'stripe'

const stripeClient = stripe(process.env.STRIPE_SECRET_KEY)

export default async function charge (order, db, callback) {
  if (order.status_id === 5 && order.stripe_token) {
    const subtotal = await db.one(`
      select
        sum(item.price) as subtotal from order_group, group_item, item
      where
        order_group.customer_order_id = $[id]
        and order_group.id = group_item.order_group_id
        and group_item.item_id = item.id
    `, {
      id: order.id
    }).then((result) => Number(result.subtotal))

    console.log('subtotal', subtotal, typeof subtotal)

    const total = (await subtotal + (order.delivery ? Number(order.delivery_fee) : 0)) * (1 + Number(order.tax_rate))

    stripeClient.charges.create({
      amount: await Math.round(total),
      currency: 'usd',
      description: `Orden #${order.id} de Rambito's`,
      source: order.stripe_token.id
    }, (err, charge) => {
      if (err) {
        callback(err)
        console.error(err)
      } else {
        callback(null, charge)
      }
    })
  } else {
    callback()
  }
}
