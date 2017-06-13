import React from 'react'
import PropTypes from 'prop-types'

import toDollars from '../libraries/toDollars'

import isBefore from 'date-fns/is_before'
import isAfter from 'date-fns/is_after'

import FilterBar from '../components/FilterBar'

import groupBy from 'lodash/groupBy'

import {
  Tabs2 as Tabs,
  Tab2 as Tab
} from '@blueprintjs/core'

import {
  JSONFormat,
  Table,
  Column,
  Cell
} from '@blueprintjs/table'

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom'

import dlv from 'dlv'

const renderField = (field) => {
  if (typeof field !== 'string') {
    return (<JSONFormat preformatted omitQuotesOnStrings>{field}</JSONFormat>)
  } else {
    return (field)
  }
}

const changeTab = ({ history }) => (newTabId, prevTabId) => history.push(`/${newTabId}`)

const salesByItemTab = (args) => {
  const getCell = (rowLabel, transform) => (rowIndex) => {
    return (
      <Cell>
        {
          transform
            ? transform(dlv(args.data[rowIndex], rowLabel))
            : renderField(dlv(args.data[rowIndex], rowLabel))
        }
      </Cell>
    )
  }

  return (
    <Tab
      id={args.id}
      title={args.title}
      panel={
        <Table defaultRowHeight={32} numRows={args.data.length}>
          <Column name='Artículo' renderCell={getCell('item')} />
          <Column name='Cantidad vendida' renderCell={getCell('quantity')} />
          <Column name='Ventas' renderCell={getCell('sales', toDollars)} />
        </Table>
      }
    />
  )
}

const salesByCustomerTab = (args) => {
  const getCell = (rowLabel, transform) => (rowIndex) => {
    return (
      <Cell>
        {
          transform
            ? transform(dlv(args.data[rowIndex], rowLabel))
            : renderField(dlv(args.data[rowIndex], rowLabel))
        }
      </Cell>
    )
  }

  return (
    <Tab
      id={args.id}
      title={args.title}
      panel={
        <Table defaultRowHeight={32} numRows={args.data.length}>
          <Column name='Nombre' renderCell={getCell('first_name')} />
          <Column name='Apellido' renderCell={getCell('last_name')} />
          <Column name='Email' renderCell={getCell('email')} />
          <Column name='Teléfono' renderCell={getCell('phone_number')} />
          <Column name='Ventas' renderCell={getCell('sales', toDollars)} />
        </Table>
      }
    />
  )
}

const groupAndSumSales = (data, sum) => {
  return Object.values(
    groupBy(data, 'id')
  ).map(
    (v) => ({
      ...v[0],
      quantity: v.length,
      sales: v.reduce((a, b) => a ? a + Number(b.price) : Number(b.price), 0)
    })
  )
}

const itemSearch = (item, search) => {
  const removeNonDigits = (s) => s.replace ? s.replace(/\D/gi, '') : ''
  const regex = new RegExp(search, 'gi')
  const regexNum = new RegExp(removeNonDigits(search), 'i')

  return Object
    .values(item)
    .filter(v => (
      regex.test(v) === true ||
      (
        removeNonDigits(search) !== '' && regexNum.test(removeNonDigits(v))
      )
    )).length > 0
}

const applyFilters = (data, filters, searchFilter) => {
  if (data && filters) {
    return data
      .filter((v) => {
        return (
          (filters.from ? isAfter(v.creation_date, filters.from) : true) &&
          (filters.to ? isBefore(v.creation_date, filters.to) : true) &&
          (filters.search !== '' ? searchFilter(v, filters.search) : true)
        )
      })
  } else {
    return []
  }
}

const tabs = (attr) => (args) => (
  <Tabs defaultSelectedTabId={attr.id} animate={false} className='pt-large' onChange={changeTab(args)}>
    {
      salesByItemTab({
        id: 'sales-per-item',
        title: 'Ventas por artículo',
        data: attr.data.salesByItem.fetched ? groupAndSumSales(
          applyFilters(
            attr.data.salesByItem.sales,
            attr.ui.reports.filters,
            itemSearch
          )
        ) : [],
        dispatch: attr.dispatch
      })
    }
    {
      salesByCustomerTab({
        id: 'sales-per-customer',
        title: 'Ventas por cliente',
        data: attr.data.salesByItem.fetched ? groupAndSumSales(
          applyFilters(
            attr.data.salesByCustomer.sales,
            attr.ui.reports.filters,
            itemSearch
          )
        ) : [],
        dispatch: attr.dispatch
      })
    }
  </Tabs>
)

export default function Report (props) {
  return props.data.salesByItem.fetched && props.data.salesByCustomer.fetched ? (
    <div className='view-container'>
      <div className='section-container'>
        <section style={{ margin: '24px' }}>
          <h4>Reportes</h4>
          <FilterBar
            actionType='CONFIG_REPORT_FILTERS'
            filters={props.ui.reports.filters}
            dispatch={props.dispatch}
          />
          <Router basename='/report'>
            <Switch>
              <Route path='/sales-per-item' component={tabs({ ...props, id: 'sales-per-item' })} />
              <Route path='/sales-per-customer' component={tabs({ ...props, id: 'sales-per-customer' })} />
              <Redirect from='/' to='/sales-per-item' />
            </Switch>
          </Router>
        </section>
      </div>
    </div>
  ) : null
}

Report.propTypes = {
  data: PropTypes.object,
  ui: PropTypes.object,
  dispatch: PropTypes.func
}
