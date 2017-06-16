import React from 'react'
import {
  Button,
  Dialog
} from '@blueprintjs/core'

const getDialogProps = (context) => ({
  title: 'Acceso como administrador',
  style: {
    width: 'calc(100vw - 16px)',
    minWidth: '256px',
    maxWidth: '384px',
    borderRadius: '3px',
    top: '8px',
    backgroundColor: '#f2f2f2',
    marginBottom: '8px'
  },
  iconName: 'plus',
  isOpen: true,
  onClose: () => console.log('k')
})

export default function Admin (props) {
  return (
    <Dialog isOpen {...getDialogProps(props)}>
      <div className='pt-dialog-body'>
        <p>Solicita acceso de administrador usando tu código provisional de acceso</p>
        <br />
        <form action='/api/admin/request' method='POST' onSubmit='return false'>
          <label className='pt-label'>
            Código provisional de acceso
            <input name='token' className='pt-input pt-fill' type='password' placeholder='Código de acceso...' />
          </label>
          <Button type='submit' className='cv-button pt-intent-primary' text='Solicitar acceso' />
        </form>
        <br />
        <p>Nota: Un código provisional de acceso se puede utilizar solo una vez.</p>
      </div>
    </Dialog>
  )
}
