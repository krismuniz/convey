import React from 'react'
import PropTypes from 'prop-types'
import Toaster from './Toaster'

import { Intent, Popover, Button, MenuItem, Menu, Position } from '@blueprintjs/core'

const changeStatus = (attr, newStatus) => () => {
  attr.dispatch((dispatch) => {
    dispatch({
      type: 'UPDATE_STATUS',
      payload: fetch('/api/order', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: attr.order.id,
          status_id: newStatus
        }),
        credentials: 'include'
      })
      .then((res) => {
        if (!res.ok) throw Error(res.statusText)

        dispatch({
          type: 'FETCH_ADMIN_ORDERS',
          payload: fetch('/api/order/all', { credentials: 'include' })
            .then(res => {
              if (!res.ok) throw Error(res.statusText)
              return res.json()
            })
        })

        Toaster.show({
          message: `Se ha actualizado el estado de la orden #${attr.order.id}`,
          iconName: 'tick',
          intent: Intent.SUCCESS,
          timeout: 2000
        })

        return res.json()
      })
    })
  })
}

const menu = (attr) => (
  <Menu>
    <MenuItem
      iconName='confirm'
      text='En proceso'
      disabled={!(attr.order.status.id < 2)}
      onClick={changeStatus(attr, 2)}
    />
    <MenuItem
      iconName='drive-time'
      disabled={!(attr.order.delivery && attr.order.status.id <= 2)}
      text='De camino a entregar'
      onClick={changeStatus(attr, 3)}
    />
    <MenuItem
      iconName='shop'
      disabled={!(attr.order.delivery === false && attr.order.status.id <= 2)}
      text='Lista para recoger'
      onClick={changeStatus(attr, 4)}
    />
    <MenuItem
      iconName='tick'
      disabled={!(attr.order.status.id < 5)}
      text={attr.order.delivery ? 'Entregada' : 'Recogida'}
      onClick={changeStatus(attr, 5)}
    />
  </Menu>
)

export default function OrderStatusManagement (props) {
  return (
    <div className='order-spec' style={{ marginTop: '10px' }}>
      <b>Estado actual: </b>{props.order.status.label}
      <Popover content={menu(props)} position={Position.RIGHT}>
        <Button
          style={{ marginLeft: '4px' }}
          className='cv-button pt-intent-primary pt-small'
          text='Cambiar estado'
          onClick={() => {}}
        />
      </Popover>
    </div>
  )
}

OrderStatusManagement.propTypes = {
  order: PropTypes.object,
  dispatch: PropTypes.func
}
