import React from 'react'
import PropTypes from 'prop-types'

import isBefore from 'date-fns/is_before'
import isAfter from 'date-fns/is_after'

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom'

import {
  Checkbox,
  Intent,
  Button,
  Tabs2 as Tabs,
  Tab2 as Tab
} from '@blueprintjs/core'

import { DateRangeInput } from '@blueprintjs/datetime'
import OrderCard from '../components/OrderCard'

const changeTab = ({ history }) => (newTabId, prevTabId) => history.push(`/${newTabId}`)

const filterOrders = (orders, filters) => {
  return orders
    .filter((v) => {
      return (
        (filters.from ? isAfter(v.creation_date, filters.from) : true) &&
        (filters.to ? isBefore(v.creation_date, filters.to) : true) &&
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
  return (
    <div className='view-container'>
      <div className='section-container'>
        <section style={{ margin: '24px' }}>
          <h4>Administrar Órdenes</h4>
          <div style={{ padding: '12px 0' }}>
            <b style={{ marginRight: '8px' }}>Filtros: </b>
            <DateRangeInput
              value={[
                props.ui.adminOrders.filters.from,
                props.ui.adminOrders.filters.to
              ]}
              onChange={(e) => {
                props.dispatch({
                  type: 'CONFIG_ADMIN_ORDERS_FILTERS',
                  payload: {
                    from: e[0],
                    to: e[1]
                  }
                })
              }}
            />
            <Checkbox
              checked={props.ui.adminOrders.filters.delivery}
              label='Solo entregas'
              className='pt-inline'
              style={{
                margin: '0 12px'
              }}
              onChange={
                (e) => {
                  props.dispatch({
                    type: 'CONFIG_ADMIN_ORDERS_FILTERS',
                    payload: {
                      delivery: e.target.checked
                    }
                  })
                }
              }
            />
            <Button
              text='Limpiar filtros'
              intent={Intent.PRIMARY}
              className='cv-button'
              onClick={
                () => props.dispatch({
                  type: 'CONFIG_ADMIN_ORDERS_FILTERS',
                  payload: {
                    from: null,
                    to: null,
                    delivery: null
                  }
                })
              }
            />
          </div>
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
  )
}

Admin.propTypes = {
  data: PropTypes.object,
  ui: PropTypes.object,
  dispatch: PropTypes.func
}
