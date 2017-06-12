import React from 'react'
import PropTypes from 'prop-types'

import ItemCarousel from './ItemCarousel'

export default class CarouselContainer extends React.Component {
  render () {
    if (this.props.items.length > 0) {
      return (
        <ItemCarousel
          typeId={this.props.typeId}
          items={this.props.items}
          dispatch={this.props.dispatch}
          />
      )
    } else {
      return (
        <div className='cv-carousel-container' style={{ width: '24px', margin: '48px auto', height: '256px' }}>
          <div className='pt-spinner pt-small'>
            <div className='pt-spinner-svg-container'>
              <svg viewBox='0 0 100 100'>
                <path className='pt-spinner-track' d='M 50,50 m 0,-44.5 a 44.5,44.5 0 1 1 0,89 a 44.5,44.5 0 1 1 0,-89' />
                <path className='pt-spinner-head' d='M 94.5 50 A 44.5 44.5 0 0 0 50 5.5' />
              </svg>
            </div>
          </div>
        </div>
      )
    }
  }
}

CarouselContainer.propTypes = {
  dispatch: PropTypes.func,
  items: PropTypes.array,
  typeId: PropTypes.number
}
