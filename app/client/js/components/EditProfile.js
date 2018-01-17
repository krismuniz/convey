import React from 'react'
import PropTypes from 'prop-types'

import { Button, InputGroup, Intent, Switch } from '@blueprintjs/core'
import { AsYouTypeFormatter as AsYouType, PhoneNumberUtil } from 'google-libphonenumber'
import validateInput from '../libraries/validate'
import emailRegEx from 'email-regex'

import Toaster from '../components/Toaster'

const tel = PhoneNumberUtil.getInstance()

const formatPhone = (s = '') => {
  const formatter = new AsYouType('US')
  let result = ''

  if (s) {
    s.replace(/\D/gi, '').split('').forEach(v => {
      result = formatter.inputDigit(v)
    })
  }

  return result
}

const formHasChanged = (initialValues, b) => {
  let initial = {
    id: initialValues.id,
    first_name: initialValues.first_name,
    last_name: initialValues.last_name,
    email: initialValues.email,
    phone_number: formatPhone(initialValues.phone_number),
    text_notifications: initialValues.text_notifications
  }

  b.phone_number = formatPhone(b.phone_number)

  let changed = false

  for (var prop in b) {
    if (b.hasOwnProperty(prop)) {
      if (initial[prop] !== b[prop]) {
        changed = true
      }
    }
  }

  return changed
}

const isEmpty = (s = '') => s.length === 0

const isValidPhoneNumber = (s = '') => {
  try {
    const phoneNumber = tel.parse(s, 'PR')

    return {
      partial: s.length <= 12 && !tel.isValidNumber(phoneNumber),
      valid: tel.isValidNumber(phoneNumber),
      empty: false
    }
  } catch (e) {
    return {
      partial: false,
      valid: false,
      empty: true
    }
  }
}

const isValidEmail = (s = '') => {
  return {
    partial: s.length <= 5,
    valid: emailRegEx({ exact: true }).test(s),
    empty: s.length === 0
  }
}

const handleChange = (dispatch, fieldName, previousValue) => (e) => {
  let obj = {}

  switch (fieldName) {
    case 'phone_number':
      obj[fieldName] = e.target.value
      break
    case 'text_notifications':
      obj[fieldName] = !previousValue
      break
    default:
      obj[fieldName] = e.target.value
  }

  dispatch({
    type: 'EDIT_PROFILE',
    payload: obj
  })
}

const showErrorToast = (message) => {
  Toaster.show({
    message: message,
    iconName: 'error',
    intent: Intent.DANGER,
    timeout: 2000
  })
}

const updateProfile = ({ dispatch, local }) => (e) => {
  if (!isValidEmail(local.edit.profile.email).valid) {
    showErrorToast('Por favor provea un email válido')
    return
  }

  if (!isValidPhoneNumber(local.edit.profile.phone_number).valid) {
    showErrorToast('Por favor provea un número de teléfono válido')
    return
  }

  if (isEmpty(local.edit.profile.first_name)) {
    showErrorToast('Por favor provea su nombre')
    return
  }

  if (isEmpty(local.edit.profile.last_name)) {
    showErrorToast('Por favor provea por lo menos un apellido')
    return
  }

  dispatch(
    {
      type: 'UPDATE_PROFILE',
      payload: fetch('/api/customer/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(local.edit.profile),
        credentials: 'include'
      })
      .then((res) => {
        if (!res.ok) throw Error(res.statusText)

        Toaster.show({
          message: `Se ha actualizado tu perfil`,
          iconName: 'tick',
          intent: Intent.SUCCESS,
          timeout: 2000
        })

        return res.json()
      })
    }
  )
}

export default function EditProfile (props) {
  return (
    <div>
      <h4>Tu perfil</h4>
      <p>Revisa que tu información esté correcta</p>
      <br />
      <h6>Información básica</h6>
      <br />
      <label className='pt-label'>
        Nombre
        <InputGroup
          value={props.local.edit.profile.first_name || ''}
          intent={
            validateInput(
              props.local.edit.profile.first_name,
              {
                initial_value: props.data.customer.profile.first_name
              }
            )
          }
          onChange={handleChange(props.dispatch, 'first_name')}
          placeholder='John'
          />
      </label>
      <label className='pt-label'>
        Apellido(s)
        <InputGroup
          value={props.local.edit.profile.last_name || ''}
          intent={
            validateInput(
              props.local.edit.profile.last_name,
              {
                initial_value: props.data.customer.profile.last_name
              }
            )
          }
          onChange={handleChange(props.dispatch, 'last_name')}
          placeholder='Appleseed'
          />
      </label>
      <label className='pt-label'>
        Email
        <InputGroup
          type='email'
          intent={
            validateInput(
              props.local.edit.profile.email,
              isValidEmail,
              {
                initial_value: props.data.customer.profile.email
              }
            )
          }
          value={props.local.edit.profile.email || ''}
          onChange={handleChange(props.dispatch, 'email')}
          placeholder='username@example.com'
          required
          />
      </label>
      <label className='pt-label'>
        Número de teléfono móvil
        <InputGroup
          type='tel'
          intent={
            validateInput(
              formatPhone(props.local.edit.profile.phone_number),
              isValidPhoneNumber,
              {
                initial_value: formatPhone(props.data.customer.profile.phone_number)
              }
            )
          }
          value={formatPhone(props.local.edit.profile.phone_number)}
          onChange={handleChange(props.dispatch, 'phone_number')}
          placeholder='(123) 456-7890'
          />
      </label>
      <br />
      <h6>Configuración de SMS</h6>
      <br />
      <label className='pt-label'>
        <Switch
          disabled={!props.local.edit.profile.phone_number}
          checked={props.local.edit.profile.text_notifications}
          label='Recibir notificaciones via mensaje de texto'
          onChange={
            handleChange(props.dispatch, 'text_notifications', props.local.edit.profile.text_notifications)
          }
        />
      </label>
      <Button
        className='cv-button'
        disabled={!formHasChanged(props.data.customer.profile, props.local.edit.profile)}
        onClick={updateProfile(props)}
        text={props.saveLabel || 'Guardar cambios'}
        intent={Intent.SUCCESS}
      />
    </div>
  )
}

EditProfile.propTypes = {
  saveLabel: PropTypes.string,
  dispatch: PropTypes.func,
  local: PropTypes.object,
  data: PropTypes.object
}
