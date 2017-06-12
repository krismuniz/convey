import React from 'react'
import PropTypes from 'prop-types'

import { Dialog, Intent, Checkbox, Button } from '@blueprintjs/core'
import toDollars from '../libraries/toDollars'

const dialogProps = ({ isOpen, dispatch }) => ({
  title: `Editar artículo`,
  style: {
    width: 'calc(100vw - 16px)',
    minWidth: '256px',
    maxWidth: '384px',
    borderRadius: '3px',
    top: '8px',
    backgroundColor: 'white',
    marginBottom: '8px'
  },
  iconName: 'edit',
  isOpen,
  onClose: () => dispatch({ type: 'HIDE_EDIT_GROUP_DIALOG' })
})

export default function EditGroupDialog (props) {
  const group = props.order.groups.find(v => v.id === props.groupId)

  return group ? (
    <Dialog {...dialogProps(props)}>
      <div id='img' style={{
        backgroundImage: `url(${group.items[0].image_url})`,
        backgroundSize: `cover`,
        height: '30vh',
        maxHeight: '256px'
      }} />
      <div className='pt-dialog-body'>
        <h5>{`${group.items[0].name} (${toDollars(group.items[0].price)})` || ''}</h5>
        {
          group.items[0].description
          ? (<p><br />{group.items[0].description}</p>) : ''
        }
        {
          props.allItems
          .filter(v => v.type.id === group.items[0].children_type_id)
          .length > 0 ? (<br />) : ''
        }
        {
          props.allItems
            .filter(v => v.type.id === group.items[0].children_type_id)
            .map((v, i) => {
              return (
                <Checkbox
                  key={i}
                  checked={group.items.filter(item => item.id === v.id).length > 0}
                  label={`${v.name} ${v.price > 0 ? `(+${toDollars(v.price)})` : ''}`}
                  onChange={
                    () => props.dispatch({
                      type: 'TOGGLE_EDIT_GROUP_SELECTION',
                      payload: {
                        id: group.id,
                        item: v
                      }
                    })
                  }
                  intent={Intent.NONE}
                />
              )
            })
        }
      </div>
      <div className='pt-dialog-footer'>
        <div className='pt-dialog-footer-actions'>
          <Button text='Remover'
            intent={Intent.DANGER}
            className='cv-button pt-fill'
            style={{ marginLeft: '0' }}
            onClick={
              () => confirm('Estás seguro de que quieres remover este artículo de tu orden?') ? props.dispatch({
                type: 'REMOVE_GROUP',
                payload: {
                  id: group.id
                }
              }) : () => {}
            }
            />
          <Button text='Listo'
            intent={Intent.PRIMARY}
            className='cv-button pt-fill'
            style={{ marginLeft: '16px' }}
            onClick={
              () => props.dispatch({
                type: 'HIDE_EDIT_GROUP_DIALOG'
              })
            }
            />
        </div>
      </div>
    </Dialog>
  ) : null
}

EditGroupDialog.propTypes = {
  isOpen: PropTypes.bool,
  allItems: PropTypes.array,
  dispatch: PropTypes.func,
  groupId: PropTypes.number,
  order: PropTypes.object
}
