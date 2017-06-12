import React from 'react'
import PropTypes from 'prop-types'

import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber'

const PNF = PhoneNumberFormat
const phoneUtil = PhoneNumberUtil.getInstance()
const phone = (p) => phoneUtil.parse(p, 'US')

export default function CustomerCard (props) {
  return (
    <div className='order-spec' style={{ marginBottom: '16px' }}>
      <h6 className='pt-icon-standard pt-icon-user'> Cliente</h6>
      <p><b>Nombre:</b> {props.customer.first_name} {props.customer.last_name}</p>
      <p><b>Email:</b> <a href={`mailto:${props.customer.email}`}>{props.customer.email}</a></p>
      <p><b>Teléfono:</b> <a href={`tel:${props.customer.phone_number}`}>{phoneUtil.format(phone(props.customer.phone_number), PNF.NATIONAL)}</a></p>
    </div>
  )
}

CustomerCard.propTypes = {
  customer: PropTypes.object
}
