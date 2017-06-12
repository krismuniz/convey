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
          props.order.paid === false && props.asAdmin === false ? (
            <p style={{ padding: '8px' }} className='pt-text-muted'>
              Se concreta el cargo a la tarjeta <i>{
                props.order.delivery
                  ? 'después de entregar tu orden'
                  : 'cuando recogas tu orden'
              }
              </i>.
            </p>
          ) : (null)
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
