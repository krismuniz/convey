import React from 'react'
import PropTypes from 'prop-types'

import isBefore from 'date-fns/is_before'
import isAfter from 'date-fns/is_after'

import FilterBar from '../components/FilterBar'

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom'

import {
  Tabs2 as Tabs,
  Tab2 as Tab
} from '@blueprintjs/core'

import OrderCard from '../components/OrderCard'

const changeTab = ({ history }) => (newTabId, prevTabId) => history.push(`/${newTabId}`)

const testData = (params, search) => {
  const removeNonDigits = (s) => (s && s.replace) ? s.replace(/\D/gi, '') : ''
  const regex = new RegExp(search, 'gi')
  const regexNum = new RegExp(removeNonDigits(search), 'i')

  return (/#/.test(search)) ? (
    regex.test('#' + params.order.id)
  ) : (
    regex.test(params.first_name + ' ' + params.last_name) === true ||
    (
      regexNum.test(removeNonDigits(params.phone_number)) === true &&
      removeNonDigits(search) !== ''
    ) ||
    regex.test(params.email) === true
  )
}

const filterOrders = (orders, filters) => {
  return orders
    .filter((v) => {
      return (
        (filters.from ? isAfter(v.creation_date, filters.from) : true) &&
        (filters.to ? isBefore(v.creation_date, filters.to) : true) &&
        (filters.search !== '' ? testData({ ...v.customer, order: v }, filters.search) : true) &&
        (filters.delivery ? v.delivery === true : true) &&
        (filters.status ? v.status.id === filters.status : true)
      )
    })
}

const OrderList = (props) => {
  return (
    <div>
      {
        props.orders
          .map((v, i) => (
            <OrderCard key={i} order={v} dispatch={props.dispatch} asAdmin />
          ))
      }
    </div>
  )
}

OrderList.propTypes = {
  orders: PropTypes.array,
  dispatch: PropTypes.func
}

const ordersTab = (args) => {
  const orders = filterOrders(args.allOrders, {
    ...args.filters,
    status: args.status || undefined
  })

  return (
    <Tab
      id={args.id}
      title={args.title + ` (${orders.length})`}
      panel={
        <OrderList
          dispatch={args.dispatch}
          orders={orders}
        />
      }
    />
  )
}

const tabs = (attr) => (args) => (
  <Tabs defaultSelectedTabId={attr.id} animate={false} className='pt-large' onChange={changeTab(args)}>
    {
      ordersTab({
        id: 'all',
        title: 'Todas',
        filters: attr.ui.adminOrders.filters,
        allOrders: attr.data.adminOrders.orders,
        dispatch: attr.dispatch
      })
    }
    {
      ordersTab({
        id: 'received',
        title: 'Recibidas',
        status: 1,
        filters: attr.ui.adminOrders.filters,
        allOrders: attr.data.adminOrders.orders,
        dispatch: attr.dispatch
      })
    }
    {
      ordersTab({
        id: 'in-process',
        title: 'En proceso',
        status: 2,
        filters: attr.ui.adminOrders.filters,
        allOrders: attr.data.adminOrders.orders,
        dispatch: attr.dispatch
      })
    }
    {
      ordersTab({
        id: 'to-deliver',
        title: 'De camino a entregar',
        status: 3,
        filters: attr.ui.adminOrders.filters,
        allOrders: attr.data.adminOrders.orders,
        dispatch: attr.dispatch
      })
    }
    {
      ordersTab({
        id: 'to-pickup',
        title: 'Listas para recoger',
        status: 4,
        filters: attr.ui.adminOrders.filters,
        allOrders: attr.data.adminOrders.orders,
        dispatch: attr.dispatch
      })
    }
    {
      ordersTab({
        id: 'completed',
        title: 'Completadas',
        status: 5,
        filters: attr.ui.adminOrders.filters,
        allOrders: attr.data.adminOrders.orders,
        dispatch: attr.dispatch
      })
    }
  </Tabs>
)

export default function Admin (props) {
  return props.data.adminOrders.fetched ? (
    <div className='view-container'>
      <div className='section-container'>
        <section style={{ margin: '24px' }}>
          <h4>Administrar Órdenes</h4>
          <FilterBar
            actionType='CONFIG_ADMIN_ORDERS_FILTERS'
            filters={props.ui.adminOrders.filters}
            dispatch={props.dispatch}
            showCheckbox
          />
          <Router basename='/admin'>
            <Switch>
              <Route path='/all' component={tabs({ ...props, id: 'all' })} />
              <Route path='/received' component={tabs({ ...props, id: 'received' })} />
              <Route path='/in-process' component={tabs({ ...props, id: 'in-process' })} />
              <Route path='/to-deliver' component={tabs({ ...props, id: 'to-deliver' })} />
              <Route path='/to-pickup' component={tabs({ ...props, id: 'to-pickup' })} />
              <Route path='/completed' component={tabs({ ...props, id: 'completed' })} />
              <Redirect from='/' to='/all' />
            </Switch>
          </Router>
        </section>
      </div>
    </div>
  ) : null
}

Admin.propTypes = {
  data: PropTypes.object,
  ui: PropTypes.object,
  dispatch: PropTypes.func
}
