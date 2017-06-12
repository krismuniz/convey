import { combineReducers } from 'redux'

import data from './data'
import local from './local'
import ui from './ui'

export default combineReducers({
  data,
  local,
  ui
})
