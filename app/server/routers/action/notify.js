import Twilio from 'twilio'

const client = new Twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

const message = (order, customer) => ({
  readyForPickup: `¡${customer.first_name}, tu orden está lista! Ya puedes venir a Rambito's a recogerla. Google Maps: https://goo.gl/maps/HKPJ7HpC4k82`,
  readyForDelivery: `¡${customer.first_name}, tu orden va en camino! Nuestro repartidor te llamará si necesita instrucciones adicionales.`
})

export default function (order, customer) {
  const msg = message(order, customer)

  if (
    order.status_id >= 3 &&
    order.status_id <= 4 &&
    customer.text_notifications &&
    customer.phone_number
  ) {
    client
      .messages
      .create({
        body: order.delivery ? msg.readyForDelivery : msg.readyForPickup,
        to: customer.phone_number,
        from: process.env.TWILIO_NUMBER
      })
      .then((message) => {
        console.log(
          `Sent text notification ${message.sid} to ${customer.phone_number}`
        )
      })
      .catch((e) => console.log(e))
  }
}
