import React from 'react'
import PropTypes from 'prop-types'

import { Popover, Menu, MenuItem, MenuDivider, Position, Button } from '@blueprintjs/core'

const menu = (history, isAdmin) => (
  <Menu>
    <MenuItem
      iconName='projects'
      text='Tus órdenes'
      onClick={() => history.push('/orders')}
    />
    <MenuItem
      iconName='user'
      text='Tu Perfil'
      onClick={() => history.push('/profile')}
    />
    <MenuDivider />
    {
      isAdmin ? ([
        <MenuItem
          key='admin'
          iconName='dashboard'
          text='Administrar'
          onClick={() => history.push('/admin')}
        />,
        <MenuItem
          key='th-list'
          iconName='dollar'
          text='Reportes de ventas'
          onClick={() => history.push('/report')}
        />,
        <MenuDivider key='divider' />
      ]) : null
    }
    <MenuItem
      iconName='log-out'
      text='Cerrar sesión'
      href='/logout'
    />
  </Menu>
)

export default function NavBar (props) {
  return (
    <div className='pt-navbar pt-light pt-fixed-top'>
      <div style={{ margin: '0 auto', maxWidth: '980px' }}>
        <div className='pt-navbar-group pt-align-left'>
          <div id='navbar-logo' onClick={() => props.history.push('/')} />
        </div>
        <div className='pt-navbar-group pt-align-right'>
          {
            props.location.pathname !== '/new-order' ? (
              <Button
                className='pt-minimal'
                text='Ordenar'
                style={{ marginRight: '8px' }}
                onClick={() => props.history.push('/new-order')}
              />
            ) : (
              <Button
                className='pt-minimal'
                text='Ayuda'
                style={{ marginRight: '8px' }}
                onClick={() => props.history.push('/help')}
              />
            )
          }

          <Popover content={menu(props.history, props.profile.is_admin)} position={Position.BOTTOM_RIGHT}>
            <div className='avatar' style={{ backgroundImage: `url(${props.profile.avatar_url})` }} />
          </Popover>
        </div>
      </div>
    </div>
  )
}

NavBar.propTypes = {
  location: PropTypes.object,
  profile: PropTypes.object,
  history: PropTypes.object
}
