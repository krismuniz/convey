import React from 'react'
import PropTypes from 'prop-types'

import { Dialog } from '@blueprintjs/core'
import EditProfile from './EditProfile'

const dialogProps = ({ isOpen, dispatch }) => ({
  style: {
    width: 'calc(100vw - 16px)',
    minWidth: '256px',
    maxWidth: '384px',
    borderRadius: '3px',
    top: '8px',
    backgroundColor: '#F9F9F9',
    marginBottom: '8px',
    paddingBottom: '0'
  },
  isOpen
})

export default function EditProfileDialog (props) {
  return (
    <Dialog {...dialogProps(props)}>
      <div className='pt-dialog-body'>
        <EditProfile
          data={props.data}
          local={props.local}
          dispatch={props.dispatch}
          saveLabel={'Continuar'}
        />
      </div>
    </Dialog>
  )
}

EditProfileDialog.propTypes = {
  isOpen: PropTypes.bool,
  local: PropTypes.object,
  data: PropTypes.object,
  dispatch: PropTypes.func
}
