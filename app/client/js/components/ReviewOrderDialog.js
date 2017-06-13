import React from 'react'
import PropTypes from 'prop-types'

import {
  Dialog,
  RadioGroup,
  Radio,
  InputGroup,
  Button,
  Intent
} from '@blueprintjs/core'

import Toaster from './Toaster'
import OrderSummaryTable from './OrderSummaryTable'
import FulfillmentMethod from './FulfillmentMethod'

import config from '../config'
import debounce from 'lodash/debounce'

const dialogProps = (props) => ({
  title: 'Revisa y confirma',
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
  enforceFocus: false,
  iconName: 'shopping-cart',
  isOpen: props.isOpen,
  onClose: () => props.dispatch({ type: 'HIDE_REVIEW_ORDER_DIALOG' })
})

const placeOrderAction = (props) => {
  return (dispatch, getState) => {
    return {
      type: 'PLACE_ORDER',
      payload: fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(getState().local.create.order),
        credentials: 'include'
      })
      .then((res) => {
        if (!res.ok) throw Error(res.statusText)

        props.history.push('/orders')

        Toaster.show({
          message: `Se ha creado tu orden exitosamente`,
          iconName: 'tick',
          intent: Intent.SUCCESS,
          timeout: 2000
        })

        return res.json()
      })
      .then((res) => {
        props.dispatch({
          type: 'RESET_NEW_ORDER'
        })

        props.dispatch({
          type: 'FETCH_ORDERS',
          payload: fetch('/api/customer/orders', { credentials: 'include' })
            .then(res => {
              if (!res.ok) throw Error(res.statusText)
              return res.json()
            })
        })
      })
    }
  }
}

const placeOrder = (props) => () => {
  const subtotal = props.order.groups
    .map(v => v.items.map(v => Number(v.price)).reduce((a, b) => b ? a + b : a, 0))
    .reduce((a, b) => b ? a + b : a, 0)

  const total = Math.round((subtotal + (props.order.delivery ? config.delivery_fee : 0)) * (1 + config.tax_rate))

  if (props.order.payment_method === 'stripe') {
    props.dispatch({
      type: 'HOLD_REVIEW_ORDER_DIALOG',
      payload: {
        hold: true
      }
    })

    const handler = window.StripeCheckout.configure({
      key: process.env.STRIPE_PUBLISHABLE_KEY,
      image: '/images/logo_128.png',
      locale: 'en',
      currency: 'USD',
      panelLabel: 'Pagar {{amount}}',
      allowRememberMe: false,
      zipCode: true,
      token: function (token) {
        props.dispatch((dispatch, getState) => {
          dispatch({
            type: 'ORDER_CONFIG',
            payload: {
              stripe_token: JSON.stringify(token)
            }
          })

          dispatch(placeOrderAction(props))
        })
      }
    })

    handler.open({
      name: 'Rambito\'s Pizza',
      description: 'Autoriza el pago para tu comida',
      email: props.customer.email,
      amount: total
    })
  } else {
    props.dispatch(placeOrderAction(props))
  }
}

export default function ReviewOrderDialog (props) {
  return (
    <Dialog {...dialogProps(props)}>
      <div className='pt-dialog-body'>
        <OrderSummaryTable
          order={props.order}
          dispatch={props.dispatch}
          noMargins
          editable
          />
        <FulfillmentMethod editable dispatch={props.dispatch} order={props.order} />
        {
          props.order.delivery ? (
            <label className='pt-label' style={{ marginTop: '12px' }}>
              Instrucciones de entrega (opcional)
              <InputGroup
                value={props.order.comment}
                key='line_1_input'
                onChange={
                  (e) => props.dispatch(
                    {
                      type: 'ORDER_CONFIG',
                      payload: {
                        comment: e.target.value
                      }
                    }
                  )
                }
                placeholder='Llamar en el portón, tocar la puerta, etc.'
                />
            </label>
          ) : (<br />)
        }
        <RadioGroup
          label={`¿Quieres pagar online o al ${props.order.delivery ? 'recibir' : 'recoger'} la orden?`}
          onChange={
            (e) => props.dispatch(
              {
                type: 'ORDER_CONFIG',
                payload: {
                  payment_method: e.target.value
                }
              }
            )
          }
          selectedValue={props.order.payment_method}
        >
          <Radio label='Pagar online con una tarjeta de crédito' value='stripe' />
          <Radio label={`Pagar al ${props.order.delivery ? 'recibir' : 'recoger'} la orden`} value='cash' />
        </RadioGroup>
      </div>
      <div className='pt-dialog-footer'>
        <div className='pt-dialog-footer-actions'>
          <Button text='Todavía no'
            intent={Intent.PRIMARY}
            className='cv-button pt-fill'
            style={{ marginLeft: '0' }}
            onClick={
              () => props.dispatch({
                type: 'HIDE_REVIEW_ORDER_DIALOG'
              })
            }
            />
          <Button
            className='cv-button pt-fill'
            intent={Intent.SUCCESS}
            loading={props.disabled}
            onClick={
              debounce(placeOrder(props), 60000, {
                leading: true
              })
            }
            text={
              props.order.payment_method === 'stripe'
              ? 'Hacer pago' : 'Confirmar orden'
            }
          />
        </div>
      </div>
    </Dialog>
  )
}

ReviewOrderDialog.propTypes = {
  disabled: PropTypes.bool,
  isOpen: PropTypes.bool,
  dispatch: PropTypes.func,
  order: PropTypes.object,
  customer: PropTypes.object
}
