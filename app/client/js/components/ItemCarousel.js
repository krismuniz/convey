import React from 'react'
import PropTypes from 'prop-types'

import Flickity from 'flickity'
import Card from './Card'

export default class ItemCarousel extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      selectedIndex: 0
    }
  }

  componentDidMount () {
    let carousel

    if (typeof this.refs.carousel['getDOMNode'] === 'function') {
      carousel = this.refs.carousel.getDOMNode()
    } else {
      carousel = this.refs.carousel
    }

    const options = {
      cellSelector: '.card-container',
      contain: true,
      initialIndex: 0,
      accessibility: true,
      freeScroll: true,
      freeScrollFriction: 0.2,
      pageDots: false,
      wrapAround: false,
      cellAlign: 'center',
      dragThreshold: 25
    }

    this.flkty = new Flickity(carousel, options)
    this.flkty.on('cellSelect', this.updateSelected.bind(this))
  }

  updateSelected () {
    let index = this.flkty.selectedIndex

    this.setState({
      selectedIndex: index
    })
  }

  componentWillUnmount () {
    if (this.flkty) {
      this.flkty.off('cellSelect', this.updateSelected.bind(this))
      this.flkty.destroy()
    }
  }

  render () {
    return (
      <div ref='carousel' className='carousel'>
        {
          this.props.items
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
        }
      </div>
    )
  }
}

ItemCarousel.propTypes = {
  dispatch: PropTypes.func,
  typeId: PropTypes.number,
  items: PropTypes.array
}
