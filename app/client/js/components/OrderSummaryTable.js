import React from 'react'
import PropTypes from 'prop-types'

import config from '../config'
import { Button } from '@blueprintjs/core'
import GroupList from './GroupList'

import toDollars from '../libraries/toDollars'

export default function OrderSummaryTable (props) {
  const subtotal = props.order.groups
    .map(v => v.items.map(v => Number(v.price)).reduce((a, b) => b ? a + b : a, 0))
    .reduce((a, b) => b ? a + b : a, 0)

  const total = (subtotal + (props.order.delivery ? config.delivery_fee : 0)) * (1 + config.tax_rate)

  if (props.order.groups.length > 0) {
    return (
      <div style={props.noMargins ? {} : { margin: '16px 0 0 0', padding: '16px 16px 0 16px' }}>
        {
          props.hideTitle ? null : (
            <div>
              <h5 style={{ marginBottom: '8px' }}>
                Tu orden
                {
                  props.showClearCart ? (
                    <Button
                      className='cv-button pt-intent-danger pt-small'
                      style={{
                        marginLeft: '8px'
                      }}
                      text='Remover todo'
                      onClick={
                        () => confirm('Estás seguro de que quieres remover todos los artículos de tu orden?') ? props.dispatch({
                          type: 'CLEAR_CART'
                        }) : () => {}
                      }
                    />
                  ) : null
                }
              </h5>
              <p style={{ marginBottom: '8px' }}>Haz click en cualquier artículo para cambiar o remover</p>
            </div>
          )
        }
        {
          props.order.groups.length > 0 ? (
            <GroupList groups={props.order.groups} dispatch={props.dispatch} editable={props.editable} />
          ) : (null)
        }
        <table className='pt-table pt-condensed pt-fill' style={{ width: '100%', marginBottom: '12px' }}>
          <tbody>
            <tr>
              <td style={{ boxShadow: 'none' }}>Sub-total</td>
              <td style={{ boxShadow: 'none', textAlign: 'right', fontWeight: 'normal' }}>{toDollars(subtotal)}</td>
            </tr>
            {
              props.order.delivery ? (
                <tr>
                  <td>Cargo por entrega</td>
                  <td style={{ textAlign: 'right' }}>{toDollars(config.delivery_fee)}</td>
                </tr>
              ) : null
            }
            <tr>
              <td>Impuestos (11.5%)</td>
              <td style={{ textAlign: 'right' }}>
                {
                  toDollars((subtotal + (props.order.delivery ? config.delivery_fee : 0)) * config.tax_rate)
                }
              </td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold' }}>Total</td>
              <td style={{ fontWeight: 'bold', color: '#24b47e', textAlign: 'right' }}>{toDollars(total)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  } else {
    return (<p style={{ margin: '16px' }}>No tienes artículos en tu orden</p>)
  }
}

OrderSummaryTable.propTypes = {
  editable: PropTypes.bool,
  hideTitle: PropTypes.bool,
  showClearCart: PropTypes.bool,
  noMargins: PropTypes.bool,
  order: PropTypes.object,
  dispatch: PropTypes.func
}
