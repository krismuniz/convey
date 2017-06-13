import React from 'react'
import PropTypes from 'prop-types'

import {
  Checkbox,
  Intent,
  InputGroup,
  Button
} from '@blueprintjs/core'

import { DateRangeInput } from '@blueprintjs/datetime'

export default function FilterBar (props) {
  return (
    <div style={{ padding: '12px 0' }}>
      <b style={{ marginRight: '8px' }}>Filtros: </b>
      <InputGroup
        value={props.filters.search}
        key='search_filter'
        className='filter-field'
        onChange={
          (e) => props.dispatch(
            {
              type: props.actionType,
              payload: {
                search: e.target.value
              }
            }
          )
        }
        placeholder='Buscar...'
      />
      <DateRangeInput
        allowSingleDayRange
        format='DD-MM-YYYY'
        outOfRangeMessage='Fuera de alcance'
        invalidDateMessage='Fecha inválida'
        overlappingDatesMessage='Las fechas confligen'
        selectAllOnFocus
        startInputProps={{
          placeholder: 'Desde...'
        }}
        endInputProps={{
          placeholder: 'Hasta...'
        }}
        value={[
          props.filters.from,
          props.filters.to
        ]}
        onChange={(e) => {
          props.dispatch({
            type: props.actionType,
            payload: {
              from: e[0],
              to: e[1]
            }
          })
        }}
      />
      { props.showCheckbox ? (
        <Checkbox
          checked={props.filters.delivery}
          label='Solo entregas'
          className='pt-inline'
          style={{
            margin: '0 12px'
          }}
          onChange={
            (e) => {
              props.dispatch({
                type: props.actionType,
                payload: {
                  delivery: e.target.checked
                }
              })
            }
          }
        />
      ) : null }
      <Button
        text='Limpiar filtros'
        intent={Intent.PRIMARY}
        className='cv-button'
        style={{
          marginLeft: props.showCheckbox ? '' : '12px'
        }}
        onClick={
          () => props.dispatch({
            type: props.actionType,
            payload: {
              from: null,
              to: null,
              delivery: null,
              search: ''
            }
          })
        }
      />
    </div>
  )
}

FilterBar.propTypes = {
  showCheckbox: PropTypes.bool,
  actionType: PropTypes.string,
  dispatch: PropTypes.func,
  filters: PropTypes.object
}
