import React from 'react'
import PropTypes from 'prop-types'

import { Button, Intent } from '@blueprintjs/core'
import AddressCard from '../components/AddressCard'
import EditProfile from '../components/EditProfile'

export default function Profile (props) {
  document.title = 'Tu perfil - Rambito\'s'

  if (props.data.customer.fetched === true) {
    return (
      <div className='view-container' style={{ userSelect: 'initial !important' }}>
        <div className='section-container flex'>
          <section style={{ margin: '24px' }}>
            <EditProfile data={props.data} local={props.local} dispatch={props.dispatch} />
          </section>
          <section style={{ margin: '24px' }}>
            <h4>Tus direcciones</h4>
            <p>Lista de direcciones pre-guardadas para acceso rápido al ordenar. Haz doble-click para modificar o eliminar una dirección.</p>
            {
              props.data.customer.profile.addresses.map((v, i) => {
                return (
                  <AddressCard
                    key={i}
                    dispatch={props.dispatch}
                    address={v}
                    asSelectButton={false}
                    selected={false}
                  />
                )
              })
            }
            <Button
              style={{ marginTop: '24px' }}
              className='cv-button pt-fill'
              text='Añadir una dirección'
              intent={Intent.PRIMARY}
              onClick={
                () => props.dispatch({
                  type: 'SHOW_ADD_ADDRESS_DIALOG'
                })
              }
            />
          </section>
        </div>
      </div>
    )
  } else {
    return null
  }
}

Profile.propTypes = {
  dispatch: PropTypes.func,
  data: PropTypes.object,
  local: PropTypes.object
}
