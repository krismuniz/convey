import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'

import AddAddressDialog from './components/AddAddressDialog'
import EditAddressDialog from './components/EditAddressDialog'
import EditProfileDialog from './components/EditProfileDialog'

import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'

import {
  FocusStyleManager
} from '@blueprintjs/core'

import { Provider, connect } from 'react-redux'

// components
import NavBar from './components/NavBar'

// views
import NewOrderView from './views/NewOrder'
import OrdersView from './views/Orders'
import ProfileView from './views/Profile'
import AdminView from './views/Admin'

import store from './store'

import '../css/style.less'

FocusStyleManager.onlyShowFocusOnTabs()

export class Application extends React.Component {
  constructor (props) {
    super(props)

    setInterval(() => {
      if (Date.now() - this.props.data.orders.last_updated >= 10000) {
        this.props.dispatch({
          type: 'FETCH_ORDERS',
          payload: fetch('/api/customer/orders/', { credentials: 'include' })
            .then(res => {
              if (!res.ok) throw Error(res.statusText)
              return res.json()
            })
        })
      }
    }, 60000)

    setInterval(() => {
      if (Date.now() - this.props.data.adminOrders.last_updated >= 10000) {
        if (this.props.data.customer.fetched && this.props.data.customer.profile.is_admin) {
          this.props.dispatch({
            type: 'FETCH_ADMIN_ORDERS',
            payload: fetch('/api/order/all', { credentials: 'include' })
              .then(res => {
                if (!res.ok) throw Error(res.statusText)
                return res.json()
              })
          })
        }
      }
    }, 30000)

    this.props.dispatch({
      type: 'FETCH_PROFILE',
      payload: fetch('/api/customer/profile', { credentials: 'include' })
        .then(res => {
          if (!res.ok) throw Error(res.statusText)
          return res.json()
        })
    })

    this.props.dispatch({
      type: 'FETCH_ORDERS',
      payload: fetch('/api/customer/orders', { credentials: 'include' })
        .then(res => {
          if (!res.ok) throw Error(res.statusText)
          return res.json()
        })
    })

    if (props.data.adminOrders.fetched === false) {
      props.dispatch({
        type: 'FETCH_ADMIN_ORDERS',
        payload: fetch('/api/order/all', { credentials: 'include' })
          .then(res => {
            if (!res.ok) throw Error(res.statusText)
            return res.json()
          })
      })
    }
  }

  render () {
    return (
      <div>
        <AddAddressDialog
          isOpen={this.props.ui.addAddressDialog.show}
          dispatch={this.props.dispatch}
          address={this.props.local.create.address}
          atSelect={this.props.ui.selectAddressDialog.show}
        />
        <EditAddressDialog
          isOpen={
            this.props.ui.editAddressDialog.show &&
            this.props.local.edit.address.id !== null
          }
          dispatch={this.props.dispatch}
          address={this.props.local.edit.address}
        />
        {
          this.props.data.customer.fetched ? (
            <EditProfileDialog
              isOpen={!this.props.data.customer.profile.phone_number}
              dispatch={this.props.dispatch}
              local={this.props.local}
              data={this.props.data}
            />
          ) : null
        }
        <Router>
          <div>
            <Route path='/' component={NavigationBar} />
            <Switch>
              <Route path='/orders' component={Orders} />
              <Route exact path='/new-order' component={NewOrder} />
              <Route exact path='/profile' component={Profile} />
              <Route
                path='/admin'
                component={this.props.data.customer.profile.is_admin ? (Admin) : Profile}
              />
              <Redirect to='/orders' />
            </Switch>
          </div>
        </Router>
      </div>
    )
  }
}

Application.propTypes = {
  history: PropTypes.object,
  dispatch: PropTypes.func,
  local: PropTypes.object,
  data: PropTypes.object,
  ui: PropTypes.object
}

const App = connect(s => s)(Application)
const NewOrder = connect(s => s)(NewOrderView)
const Orders = connect(s => s)(OrdersView)
const NavigationBar = connect(s => ({ profile: s.data.customer.profile }))(NavBar)
const Profile = connect(s => s)(ProfileView)
const Admin = connect(s => s)(AdminView)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app-container')
)
