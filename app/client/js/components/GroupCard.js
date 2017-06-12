import React from 'react'
import PropTypes from 'prop-types'
import toDollars from '../libraries/toDollars'

export default function GroupCard (props) {
  return (
    <div
      className={`summary-item ${props.editable ? 'editable' : null}`}
      onClick={
        (e) => {
          props.editable ? props.dispatch({
            type: 'SHOW_EDIT_GROUP_DIALOG',
            payload: {
              id: props.group.id
            }
          }) : null
        }
      }
    >
      <span>
        <b>{props.group.items[0].name} </b>
      </span>
      <span style={{ float: 'right' }}>
        {toDollars(props.group.items[0].price)}
      </span>
      {
        props.group.items.map((item, i) => {
          return i !== 0
            ? (
              <p className='sub-item' key={i}>
                + {item.name}
                <span style={{ float: 'right' }}>{item.price > 0 ? toDollars(item.price) : ''}</span>
              </p>
            )
            : (null)
        })
      }
    </div>
  )
}

GroupCard.propTypes = {
  editable: PropTypes.bool,
  group: PropTypes.object,
  dispatch: PropTypes.func
}
