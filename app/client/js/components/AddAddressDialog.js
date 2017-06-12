import React from 'react'
import PropTypes from 'prop-types'

import cities from '../libraries/municipalities'
import validateInput from '../libraries/validate'
import { Dialog, InputGroup, Button, Intent } from '@blueprintjs/core'
import Toaster from './Toaster'

const dialogProps = ({ isOpen, dispatch }) => ({
  title: `Añadir una dirección`,
  style: {
    width: 'calc(100vw - 16px)',
    minWidth: '256px',
    maxWidth: '384px',
    borderRadius: '3px',
    top: '8px',
    backgroundColor: '#F9F9F9',
    marginBottom: '8px'
  },
  iconName: 'plus',
  isCloseButtonShown: false,
  isOpen
})

const handleChange = (dispatch, fieldName) => (e) => {
  let obj = {}

  obj[fieldName] = e.target.value

  dispatch({
    type: 'ADD_TO_ADDRESS',
    payload: obj
  })
}

const validateAddress = (address) => {
  return (address.label && address.line_1 && address.city && address.zip)
}

const postAddress = ({ dispatch, address, atSelection }) => (e) => {
  if (validateAddress(address)) {
    dispatch(
      {
        type: 'ADD_ADDRESS',
        payload: fetch('/api/customer/profile/address', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(address),
          credentials: 'include'
        })
        .then((res) => {
          if (!res.ok) throw Error(res.statusText)

          Toaster.show({
            message: `Se añadió la dirección a tu perfil`,
            iconName: 'tick',
            intent: Intent.SUCCESS,
            timeout: 2000
          })

          dispatch({
            type: 'HIDE_ADD_ADDRESS_DIALOG'
          })

          if (atSelection === true) {
            dispatch(
              {
                type: 'HIDE_SELECT_ADDRESS_DIALOG',
                payload: {
                  address: res.json().reverse()[0]
                }
              }
            )
          }

          return res.json()
        })
      }
    )
  } else {
    Toaster.show({
      message: `Llene los campos requeridos`,
      iconName: 'error',
      intent: Intent.DANGER,
      timeout: 2000
    })
  }
}

export default function SelectAddressDialog (props) {
  return (
    <Dialog {...dialogProps(props)}>
      <div className='pt-dialog-body'>
        <label className='pt-label'>
          Apodo de la dirección
          <InputGroup
            value={props.address.label || ''}
            key='label_input'
            intent={
              validateInput(
                props.address.label,
                {
                  initial_value: ''
                }
              )
            }
            onChange={
              handleChange(
                props.dispatch,
                'label'
              )
            }
            placeholder='"Casa", "Trabajo", etc.'
            />
        </label>
        <label className='pt-label'>
          Dirección física
          <InputGroup
            value={props.address.line_1 || ''}
            key='line_1_input'
            intent={
              validateInput(
                props.address.line_1,
                {
                  initial_value: ''
                }
              )
            }
            onChange={
              handleChange(
                props.dispatch,
                'line_1'
              )
            }
            placeholder='Nombre de la calle, número, barrio'
            />
        </label>
        <label className='pt-label'>
          <InputGroup
            value={props.address.line_2 || ''}
            key='line_2_input'
            placeholder='# de apartamento o suite, piso, etc.'
            onChange={
              handleChange(
                props.dispatch,
                'line_2'
              )
            }
            />
        </label>
        <label className='pt-label'>
          Municipio
          <div className='pt-select pt-fill'>
            <select
              value={props.address.city}
              key='city_input'
              onChange={
                handleChange(
                  props.dispatch,
                  'city'
                )
              }
            >
              <option value={null}>Choose a municipality...</option>
              {
                cities
                  .filter(v => (/Ponce|Coamo|Salinas|Santa Isabel/gi).test(v.name))
                  .map((v, i) => (
                    <option key={i} value={v.name}>{v.name}</option>
                  ))
              }
            </select>
          </div>
          <p className='pt-text-muted' style={{ marginTop: '10px' }}>
            Por el momento Rambito's solo entrega a Santa Isabel, Coamo, Salinas y Ponce.
          </p>
        </label>
        <label className='pt-label'>
          Código postal (zip)
          <InputGroup
            value={props.address.zip || ''}
            type='tel'
            key='zip_input'
            intent={
              validateInput(
                props.address.zip,
                {
                  initial_value: ''
                }
              )
            }
            onChange={
              handleChange(
                props.dispatch,
                'zip'
              )
            }
            placeholder='Zip Code'
            />
        </label>
      </div>
      <div className='pt-dialog-footer'>
        <div className='pt-dialog-footer-actions'>
          <Button text='Cancelar'
            intent={Intent.DANGER}
            className='cv-button pt-fill'
            style={{ marginLeft: '0' }}
            onClick={() => props.dispatch({
              type: 'HIDE_ADD_ADDRESS_DIALOG'
            })}
            />
          <Button
            className='cv-button pt-fill'
            intent={Intent.PRIMARY}
            disabled={false}
            onClick={postAddress(props)}
            text='Guardar'
          />
        </div>
      </div>
    </Dialog>
  )
}

SelectAddressDialog.propTypes = {
  dispatch: PropTypes.func,
  history: PropTypes.object,
  address: PropTypes.object,
  atSelection: PropTypes.bool
}

SelectAddressDialog.prototype.isPureReactComponent = true
