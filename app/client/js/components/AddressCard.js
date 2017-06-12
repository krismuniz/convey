import React from 'react'
import PropTypes from 'prop-types'

import { Button, Intent } from '@blueprintjs/core'

export default function AddressCard (props) {
  const editButton = (show = false) => {
    if (show === true) {
      return (
        <Button
          id={`button-${props.address.id}`}
          style={{ marginTop: '8px' }}
          className='pt-minimal pt-small pt-fill'
          text='Modify or Remove'
          intent={Intent.PRIMARY}
        />
      )
    }
  }

  return (
    <div id={props.address.id}
      className={`address-card ${props.selected ? 'selected' : ''}`}
      style={{
        cursor: props.asSelectButton ? 'pointer' : 'initial'
      }}
      onDoubleClick={(e) => {
        props.dispatch({
          type: 'SHOW_EDIT_ADDRESS_DIALOG',
          payload: props.address
        })
      }}
      onClick={(e) => {
        if (props.asSelectButton && !props.selected) {
          props.dispatch({
            type: 'ORDER_CONFIG',
            payload: {
              address: props.address
            }
          })
        }
      }}
    >
      <h6 style={{ marginBottom: '8px' }}>{props.address.label}</h6>
      <p>{props.address.line_1}</p>
      { props.address.line_2 ? (<p>{props.address.line_2}</p>) : null}
      <p>{props.address.city}, {props.address.state} {props.address.zip}</p>
      { editButton() }
    </div>
  )
}

AddressCard.propTypes = {
  dispatch: PropTypes.func,
  address: PropTypes.object,
  asSelectButton: PropTypes.bool,
  selected: PropTypes.bool
}
