import React from 'react'
import PropTypes from 'prop-types'

import {
  Tabs2 as Tabs,
  Tab2 as Tab,
  NonIdealState,
  Button,
  Intent
} from '@blueprintjs/core'

import MediaQuery from 'react-responsive'

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom'

import OrderCard from '../components/OrderCard'

const UpcomingOrders = ({ history, orders, dispatch, mobile }) => (
  <div style={{ borderRadius: '3px' }}>
    {
      orders.filter(v => v.status.id < 5).length > 0
        ? orders.filter(v => v.status.id < 5).map((v, i) => <OrderCard key={i} order={v} mobile={mobile} />)
        : (
          <NonIdealState
            title='¿Tienes hambre?'
            description='Ordena comida ahora para entrega a domicilio o recogido!'
            visual='shop'
            action={
              <Button
                className='cv-button'
                intent={Intent.PRIMARY}
                onClick={() => { history.push('/new-order') }}
                text='Ordenar'
              />
            }
          />
        )
    }
  </div>
)

UpcomingOrders.propTypes = {
  mobile: PropTypes.bool,
  dispatch: PropTypes.func,
  history: PropTypes.object,
  orders: PropTypes.array
}

const PastOrders = ({ history, orders, dispatch, mobile }) => (
  <div style={{ borderRadius: '3px' }}>
    {
      orders.length > 0
        ? orders.filter(v => v.status.id === 5).map((v, i) => <OrderCard key={i} order={v} mobile={mobile} />)
        : (<p>No previous orders</p>)
    }
  </div>
)

PastOrders.propTypes = {
  mobile: PropTypes.bool,
  dispatch: PropTypes.func,
  history: PropTypes.object,
  orders: PropTypes.array
}

const changeTab = ({ history }) => (newTabId, prevTabId) => history.push(`/${newTabId}`)

const tabs = (attr) => (args) => (
  <Tabs defaultSelectedTabId={attr.id} animate={false} className='pt-large' onChange={changeTab(args)}>
    <Tab
      id='upcoming'
      title='Actuales'
      panel={
        <div>
          <MediaQuery maxWidth={979}>
            <UpcomingOrders mobile history={attr.history} orders={attr.data.orders.orders} dispatch={attr.dispatch} />
          </MediaQuery>
          <MediaQuery minWidth={980}>
            <UpcomingOrders mobile={false} history={attr.history} orders={attr.data.orders.orders} dispatch={attr.dispatch} />
          </MediaQuery>
        </div>
      }
    />
    {
      attr.data.orders.orders ? (
        <Tab
          id='previous'
          title='Pedidos pasados'
          panel={
            <div>
              <MediaQuery maxWidth={979}>
                <PastOrders
                  mobile
                  history={attr.history}
                  orders={attr.data.orders.orders}
                  dispatch={attr.dispatch}
                />
              </MediaQuery>
              <MediaQuery minWidth={980}>
                <PastOrders
                  mobile={false}
                  history={attr.history}
                  orders={attr.data.orders.orders}
                  dispatch={attr.dispatch}
                />
              </MediaQuery>
            </div>
          }
          disabled={attr.data.orders.orders.filter(v => v.status.id === 5).length === 0}
        />
      ) : (null)
    }
  </Tabs>
)

export default class OrdersView extends React.Component {
  constructor (props) {
    super(props)

    document.title = 'Tus órdenes - Rambito\'s'
  }

  render () {
    return (
      <div className='view-container'>
        <div className='section-container'>
          <section style={{ margin: '24px' }}>
            <h4>Tus órdenes</h4>
            <Router basename='/orders/'>
              <Switch>
                <Route path='/upcoming' component={tabs({ ...this.props, id: 'upcoming' })} />
                <Route path='/previous' component={tabs({ ...this.props, id: 'previous' })} />
                <Redirect from='/' to='/upcoming' />
              </Switch>
            </Router>
          </section>
        </div>
      </div>
    )
  }
}

OrdersView.propTypes = {
  history: PropTypes.object,
  dispatch: PropTypes.func,
  data: PropTypes.object
}
