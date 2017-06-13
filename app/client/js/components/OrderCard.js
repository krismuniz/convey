import React from 'react'
import PropTypes from 'prop-types'
import OrderSummaryTable from './OrderSummaryTable'
import FulfillmentMethod from './FulfillmentMethod'
import PaymentDetails from './PaymentDetails'
import OrderStatusCard from './OrderStatusCard'
import OrderStatusManagement from './OrderStatusManagement'
import CustomerCard from './CustomerCard'

import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber'

import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
import esLocale from 'date-fns/locale/es'

const PNF = PhoneNumberFormat
const phoneUtil = PhoneNumberUtil.getInstance()
const phone = (p) => phoneUtil.parse(p, 'US')

const ago = (date) => distanceInWordsToNow(date, {
  locale: esLocale,
  addSuffix: true
})

export default function OrderCard (props) {
  return (
    <div style={{
      padding: '16px',
      background: props.order.status.id === 5 ? 'transparent' : 'white',
      boxShadow: props.order.status.id === 5 ? '0 0 0 1px rgba(0, 0, 0, 0.1)' : '0 3px 8px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.03)',
      borderRadius: '3px',
      marginBottom: '16px'
    }}>
      <div style={{ flex: '100%', padding: '8px' }}>
        <h4>
          {
            props.asAdmin
              ? `Orden #${props.order.id}`
              : `Tu número de confirmación es: ${props.order.id}`
          }
        </h4>
        <p className='pt-text-muted'>Creada {ago(props.order.creation_date)} por {props.order.customer.first_name} {props.order.customer.last_name}</p>
        {
          !props.asAdmin && props.order.status.id < 5 ? (
            <OrderStatusCard order={props.order} />
          ) : (
            props.asAdmin ? <OrderStatusManagement order={props.order} dispatch={props.dispatch} /> : null
          )
        }
      </div>
      <div style={{ display: 'flex', flexDirection: props.mobile ? 'column' : '' }}>
        <div style={{ flex: '50%', padding: '8px' }}>
          <OrderSummaryTable hideTitle showClearCart={false} noMargins order={props.order} dispatch={props.dispatch} />
          <PaymentDetails dispatch={props.dispatch} order={props.order} asAdmin={props.asAdmin} />
        </div>
        <div style={{ flex: '50%', padding: '8px' }}>
          {
            props.asAdmin ? (
              <CustomerCard customer={props.order.customer} />
            ) : null
          }
          <FulfillmentMethod order={props.order} dispatch={props.dispatch} asAdmin={props.asAdmin} />
          <div className='order-spec' style={{ margin: '16px 0' }}>
            <p>
              {
                props.order.comment && props.order.delivery ? (
                  <span><b>Instrucciones de entrega: </b>{props.order.comment}</span>
                ) : (
                  props.order.delivery ? (
                    props.asAdmin
                      ? (<span>No hay instrucciones de entrega</span>)
                      : (<span>Te llamaremos si tenemos dudas sobre como entregarte tu orden.</span>)
                  ) : (
                    props.asAdmin ? (
                      <span>El cliente recogerá la orden en el establecimiento.</span>
                    ) : (
                      <span>Al llegar a Rambito's pregunta por la orden <b>#{props.order.id}</b> a nombre de <b>{props.order.customer.first_name}</b>.</span>
                    )
                  )
                )
              }
            </p>
          </div>
          {
            !props.asAdmin && props.order.status.id < 5 && props.order.customer.text_notifications ? (
              <div className='order-spec'>
                <h6 className='pt-icon-standard pt-icon-comment'> Notificaciones</h6>
                <p>
                  {'Enviaremos notificaciones acerca del estado de tu orden al '}
                  {
                    phoneUtil.format(
                      phone(props.order.customer.phone_number),
                      PNF.NATIONAL
                    )
                  }. Ve a <a href='/profile'>tu perfil</a> si quieres cambiar esto.
                </p>
              </div>
            ) : (null)
          }
        </div>
      </div>
    </div>
  )
}

OrderCard.propTypes = {
  mobile: PropTypes.bool,
  asAdmin: PropTypes.bool,
  order: PropTypes.object,
  dispatch: PropTypes.func
}
