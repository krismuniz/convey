import React from 'react'
import PropTypes from 'prop-types'

import { ProgressBar, Intent } from '@blueprintjs/core'

import isBefore from 'date-fns/is_before'
import addMinutes from 'date-fns/add_minutes'
import distanceInWordsStrict from 'date-fns/distance_in_words_strict'
import esLocale from 'date-fns/locale/es'

export default function OrderStatusCard (props) {
  const expectedDeliveryDate = addMinutes(props.order.creation_date, 45)

  return (
    <div className='order-spec' style={{ marginTop: '8px' }}>
      <p><b>Estado de la orden:</b> {props.order.status.label}</p>
      <div style={{ margin: '8px 0 6px 0' }}>
        <ProgressBar
          className='pt-no-stripes pt-large'
          intent={props.order.status.id >= 4 ? Intent.SUCCESS : Intent.PRIMARY}
          value={props.order.status.id / 4}
        />
      </div>
      <p className='pt-text-muted'>
        Tu orden {props.order.delivery ? 'será entregada en aproximadamente ' : 'estará lista dentro de '}
        {
          isBefore(Date.now(), expectedDeliveryDate) ? (
            distanceInWordsStrict(Date.now(), expectedDeliveryDate, {
              partialMethod: 'ceil',
              unit: 'm',
              locale: esLocale
            })
          ) : (
            '10 o 15 minutos'
          )
        }
      </p>
    </div>
  )
}

OrderStatusCard.propTypes = {
  order: PropTypes.object
}
