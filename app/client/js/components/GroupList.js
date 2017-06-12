import React from 'react'
import PropTypes from 'prop-types'
import GroupCard from './GroupCard'

export default function GroupList (props) {
  return (
    <div>
      {
        props.groups
          .map((v, i) => {
            return (
              <GroupCard editable={props.editable} key={i} group={v} dispatch={props.dispatch} />
            )
          })
      }
    </div>
  )
}

GroupList.propTypes = {
  editable: PropTypes.bool,
  groups: PropTypes.array,
  dispatch: PropTypes.func
}
