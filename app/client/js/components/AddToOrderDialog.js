import React from 'react'
import PropTypes from 'prop-types'

import { Dialog, Intent, Checkbox, Button } from '@blueprintjs/core'
import Toaster from './Toaster'

const toDollars = (priceInCents) => {
  return `$${(Number(priceInCents) / 100).toFixed(2)}`
}

const props = (context) => ({
  title: 'Añadir a tu orden',
  style: {
    width: 'calc(100vw - 16px)',
    minWidth: '256px',
    maxWidth: '384px',
    borderRadius: '3px',
    top: '8px',
    backgroundColor: 'white',
    marginBottom: '8px'
  },
  iconName: 'plus',
  isOpen: context.props.isOpen,
  onClose: () => context.props.dispatch({ type: 'HIDE_ADD_TO_ORDER_DIALOG' })
})

export default class AddToOrderDialog extends React.Component {
  render () {
    if (this.props.selectedItems.length > 0) {
      return (
        <Dialog {...props(this)}>
          <div id='img' style={{
            backgroundImage: `url(${this.props.selectedItems[0].image_url})`,
            backgroundSize: `cover`,
            height: '30vh',
            maxHeight: '256px'
          }} />
          <div className='pt-dialog-body'>
            <h5>{`${this.props.selectedItems[0].name} (${toDollars(this.props.selectedItems[0].price)})` || ''}</h5>
            {
              this.props.selectedItems[0].description
              ? (<p><br />{this.props.selectedItems[0].description}</p>) : ''
            }
            {
              this.props.allItems
              .filter(v => v.type.id === this.props.selectedItems[0].children_type_id)
              .length > 0 ? (<br />) : ''
            }
            {
              this.props.allItems
                .filter(v => v.type.id === this.props.selectedItems[0].children_type_id)
                .map((v, i) => {
                  return (
                    <Checkbox
                      key={i}
                      checked={this.props.selectedItems.filter(selectedItem => selectedItem.id === v.id).length > 0}
                      label={`${v.name} ${v.price > 0 ? `(+${toDollars(v.price)})` : ''}`}
                      onChange={() => this.props.dispatch({ type: 'TOGGLE_SELECTION', payload: v })}
                      intent={Intent.NONE}
                    />
                  )
                })
            }
          </div>
          <div className='pt-dialog-footer'>
            <div className='pt-dialog-footer-actions'>
              <Button text='No añadir'
                intent={Intent.DANGER}
                className='cv-button pt-fill'
                style={{ marginLeft: '0' }}
                onClick={() => { this.props.dispatch({ type: 'HIDE_ADD_TO_ORDER_DIALOG' }) }}
                />
              <Button
                className='cv-button pt-fill'
                intent={Intent.PRIMARY}
                style={{ marginLeft: '16px' }}
                onClick={() => {
                  const item = this.props.selectedItems[0]

                  this.props.dispatch({
                    type: 'ADD_GROUP_TO_ORDER',
                    payload: {
                      items: this.props.selectedItems
                    }
                  })

                  Toaster.show({
                    message: `Se añadió el artículo ${item.name} a su orden`,
                    iconName: 'tick',
                    intent: Intent.SUCCESS,
                    timeout: 2000
                  })
                }}
                text='Añadir'
              />
            </div>
          </div>
        </Dialog>
      )
    } else {
      return null
    }
  }
}

AddToOrderDialog.propTypes = {
  allItems: PropTypes.array,
  selectedItems: PropTypes.array,
  dispatch: PropTypes.func
}
