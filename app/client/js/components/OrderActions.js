import React from 'react'
import PropTypes from 'prop-types'

import { Button } from '@blueprintjs/core'

export default class OrderActions extends React.Component {
  render () {
    return (
      <div className='order-actions'>
        <Button
          disabled={!this.props.validOrder}
          className='cv-button pt-fill pt-intent-success'
          text='Continuar'
          style={{ margin: '0' }}
          onClick={() => {
            this.props.dispatch({
              type: 'SHOW_REVIEW_ORDER_DIALOG'
            })
          }}
        />
      </div>
    )
  }
}

OrderActions.propTypes = {
  dispatch: PropTypes.func,
  validOrder: PropTypes.bool
}
