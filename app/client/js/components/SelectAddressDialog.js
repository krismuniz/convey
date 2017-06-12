import React from 'react'
import PropTypes from 'prop-types'

import { Dialog, RadioGroup, Radio, Collapse, Button, Intent } from '@blueprintjs/core'
import AddressCard from './AddressCard'
import Toaster from './Toaster'

const dialogProps = ({ isOpen, dispatch }) => ({
  title: `Configura tu orden`,
  style: {
    width: 'calc(100vw - 16px)',
    minWidth: '256px',
    maxWidth: '384px',
    borderRadius: '3px',
    top: '8px',
    backgroundColor: '#F9F9F9',
    marginBottom: '8px'
  },
  isCloseButtonShown: false,
  isOpen
})

export default function SelectAddressDialog (props) {
  return (
    <Dialog {...dialogProps(props)}>
      <div className='pt-dialog-body'>
        <RadioGroup
          label='¿Entrega o recogido?'
          onChange={
            (e) => props.dispatch(
              {
                type: 'ORDER_CONFIG',
                payload: {
                  delivery: e.target.value === 'delivery'
                }
              }
            )
          }
          selectedValue={props.order.delivery ? 'delivery' : 'carryout'}
        >
          <Radio label='Entrega a domicilio' value='delivery' />
          <Radio label='Recogido en la tienda' value='carryout' />
        </RadioGroup>
        <Collapse isOpen={!props.order.delivery}>
          ¡Procesaremos tu orden y te notificaremos cuando esté lista para recoger!
        </Collapse>
        <Collapse isOpen={props.order.delivery}>
          <div className='pt-label'>
            ¿Dónde quieres que te entreguemos tu comida?
            {
              props.addresses.map((v, i) => {
                return (
                  <AddressCard
                    key={i}
                    dispatch={props.dispatch}
                    address={v}
                    asSelectButton
                    selected={v.id === props.order.address.id}
                  />
                )
              })
            }
            <div
              className='pt-fill add-address-button'
              onClick={
                () => props.dispatch({
                  type: 'SHOW_ADD_ADDRESS_DIALOG'
                })
              }
            >Añadir una dirección</div>
          </div>
        </Collapse>
      </div>
      <div className='pt-dialog-footer'>
        <div className='pt-dialog-footer-actions'>
          {
            !props.order.configured
            ? (
              <Button text='Cancelar orden'
                intent={Intent.DANGER}
                className='cv-button pt-fill'
                style={{ marginLeft: '0' }}
                onClick={() => {
                  props.history.push('/orders')
                }}
                />
            ) : null
          }
          <Button
            className='cv-button pt-fill'
            intent={Intent.PRIMARY}
            disabled={!(props.order.delivery === true && props.order.address.id || !props.order.delivery)}
            style={{ marginLeft: !props.order.configured ? '16px' : '0' }}
            onClick={() => {
              if (
                props.order.delivery === false ||
                props.order.delivery === true &&
                props.order.address.line_1
              ) {
                props.dispatch({
                  type: 'HIDE_SELECT_ADDRESS_DIALOG',
                  payload: {
                    configured: true
                  }
                })
              } else {
                Toaster.show({
                  message: `Seleccione una dirección o cree una nueva`,
                  iconName: 'error',
                  intent: Intent.DANGER,
                  timeout: 2000
                })
              }
            }}
            text={props.order.configured ? 'Listo' : 'Continuar'}
          />
        </div>
      </div>
    </Dialog>
  )
}

SelectAddressDialog.propTypes = {
  dispatch: PropTypes.func,
  addresses: PropTypes.array,
  order: PropTypes.object,
  history: PropTypes.object
}
