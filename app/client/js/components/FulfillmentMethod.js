import React from 'react'
import PropTypes from 'prop-types'

import { Button } from '@blueprintjs/core'

export default function FulfillmentMethod (props) {
  if (props.order.address.id && props.order.delivery) {
    return (
      <div className={`order-spec ${props.asCard ? 'as-card' : null}`}>
        <h6 className='pt-icon-standard pt-icon-drive-time'> Entrega a domicilio</h6>
        { props.editable ? (
          <Button
            className='cv-button pt-intent-primary pt-small'
            style={{
              marginLeft: '8px'
            }}
            text='Cambiar'
            onClick={
              () => props.dispatch({
                type: 'SHOW_SELECT_ADDRESS_DIALOG'
              })
            }
          />
        ) : null }
        <br />
        <p>{props.order.address.line_1}</p>
        {props.order.address.line_2 ? <p>{props.order.address.line_2}</p> : null}
        <p>{props.order.address.city}</p>
      </div>
    )
  } else if (props.order.delivery === false) {
    return (
      <div className={`order-spec ${props.asCard ? 'as-card' : null}`}>
        <h6 className='pt-icon-standard pt-icon-shop'> Recogido</h6>
        {
          props.editable ? (
            <Button
              className='cv-button pt-intent-primary pt-small'
              style={{
                marginLeft: '8px'
              }}
              text='Cambiar'
              onClick={
                () => props.dispatch({
                  type: 'SHOW_SELECT_ADDRESS_DIALOG'
                })
              }
            />
          ) : null
        }
        {
          props.asAdmin ? (
            null
          ) : (
            <p>Vienes a Rambito's a recoger tu orden cuando esté lista. </p>
          )
        }
      </div>
    )
  } else {
    return (
      <div className={`order-spec ${props.asCard ? 'as-card' : null}`}>
        <h6 className='pt-icon-standard pt-icon-confirm'> Entrega o recogido?</h6>
        <Button
          className='cv-button pt-intent-primary pt-small'
          style={{
            marginLeft: '8px'
          }}
          text='Especificar'
          onClick={
            () => props.dispatch({
              type: 'SHOW_SELECT_ADDRESS_DIALOG'
            })
          }
        />
      </div>
    )
  }
}

FulfillmentMethod.propTypes = {
  asAdmin: PropTypes.bool,
  editable: PropTypes.bool,
  asCard: PropTypes.bool,
  dispatch: PropTypes.func,
  order: PropTypes.object
}
