import React from 'react'
import PropTypes from 'prop-types'

import { Button } from '@blueprintjs/core'
import toDollars from '../libraries/toDollars'

export default class Card extends React.Component {
  constructor (props) {
    super(props)

    this.cardClick = () => {
      this.props.dispatch({
        type: 'SHOW_ADD_TO_ORDER_DIALOG',
        payload: [this.props.item]
      })
    }
  }

  render () {
    return (
      <div className='card-container'>
        <div className='card'>
          <div className='card-image'
            style={{ backgroundImage: `url(${this.props.item.image_url})` }}
            />
          <div className='card-footer'>
            <div className='card-info'>
              <span className='card-title'>{this.props.item.name}</span>
              <span className='card-price'>{toDollars(this.props.item.price)}</span>
            </div>
            <Button
              className='cv-button pt-intent-primary pt-fill'
              text='Configurar y añadir'
              onClick={this.cardClick} />
          </div>
        </div>
      </div>
    )
  }
}

Card.propTypes = {
  dispatch: PropTypes.func,
  item: PropTypes.object
}
