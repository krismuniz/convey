import React from 'react'
import PropTypes from 'prop-types'

import Card from './Card'

export default class ItemGrid extends React.Component {
  render () {
    return (
      <div className='item-grid'>
        {
          this.props.items.length > 0
          ? this.props.items
            .filter(v => v.type.id === this.props.typeId)
            .map(v => (
              <Card
                key={v.id}
                item={v}
                className='card-container'
                dispatch={this.props.dispatch}
              />
              )
            )
          : (
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
      </div>
    )
  }
}

ItemGrid.propTypes = {
  dispatch: PropTypes.func,
  typeId: PropTypes.number,
  items: PropTypes.array
}
