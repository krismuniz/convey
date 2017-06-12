import React from 'react'
import PropTypes from 'prop-types'

export default function PaymentDetails (props) {
  return (
    props.order.stripe_token && props.order.stripe_token.card ? (
      <div>
        <div className={`order-spec ${props.asCard ? 'as-card' : null}`}>
          <h6 className='pt-icon-standard pt-icon-credit-card'> Método de pago</h6>
          <p>{props.order.stripe_token.card.brand} terminando en {props.order.stripe_token.card.last4}</p>
          <p>Expira en {props.order.stripe_token.card.exp_month}/{props.order.stripe_token.card.exp_year}</p>
        </div>
        {
          props.order.paid === false ? (
            props.order.stripe_token ? (
              <p style={{ padding: '12px' }} className='pt-text-muted'>
                Se concretará el cargo a la tarjeta <i>{
                  props.order.delivery
                    ? 'después de entregar la orden'
                    : 'cuando recogas la orden'
                }
                </i>.
              </p>
            ) : (
              null
            )
          ) : (
            props.order.stripe_charge ? (
              <p style={{ padding: '12px' }} className='pt-text-muted'>
                {
                  props.asAdmin ? (
                    'Se procesó el pago exitosamente.'
                  ) : (
                    'Se procesó el pago exitosamente. ¡Gracias por tu compra!'
                  )
                }
              </p>
            ) : (
              null
            )
          )
        }
      </div>
    ) : (
      <div className={`order-spec ${props.asCard ? 'as-card' : null}`}>
        <h6 className='pt-icon-standard pt-icon-dollar'> Método de pago</h6>
        <p>Efectivo o ATH al {props.order.delivery ? 'recibir la orden' : 'recoger la orden'}.</p>
      </div>
    )
  )
}

PaymentDetails.propTypes = {
  asAdmin: PropTypes.bool,
  asCard: PropTypes.bool,
  dispatch: PropTypes.func,
  order: PropTypes.object
}
