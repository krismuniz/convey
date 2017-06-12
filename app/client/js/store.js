import { createStore, applyMiddleware } from 'redux'
import { persistStore } from 'redux-persist'
import reduxThunk from 'redux-thunk'
import promise from 'redux-promise-middleware'

import reducers from './reducers'

import { composeWithDevTools } from 'redux-devtools-extension'

const store = createStore(
  reducers,
  undefined,
  composeWithDevTools(
    applyMiddleware(
      promise(),
      reduxThunk
    ),
  )
)

persistStore(store)

export default store
