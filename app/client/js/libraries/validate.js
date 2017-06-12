import isObject from 'is-plain-obj'
import { Intent } from '@blueprintjs/core'
const isFunction = (v) => typeof v === 'function'

export default (v = '', ...args) => {
  const defaultFn = (s = '') => {
    if (s !== null && s.length === 0) return { empty: true, valid: false }
    return { empty: false, valid: true }
  }

  const defaultConfig = {
    initial_value: '',
    same: 'none',
    empty: 'danger',
    partial: 'warning',
    invalid: 'danger',
    valid: 'success'
  }

  const getIntent = (s) => {
    switch (s) {
      case 'none':
        return null
      case 'danger':
        return Intent.DANGER
      case 'warning':
        return Intent.WARNING
      case 'success':
        return Intent.SUCCESS
    }
  }

  const validationFn = args.find(isFunction) || defaultFn
  const config = Object.assign(defaultConfig, args.find(isObject))
  const value = validationFn(v)

  let result = getIntent(config.same)

  if (v === config.initial_value && value.valid && !value.empty) return getIntent(config.same)

  if (value.empty === true) {
    return getIntent(config.empty)
  }

  if (value.partial) {
    result = getIntent(config.partial)
  } else if (value.valid !== true) {
    return getIntent(config.invalid)
  } else if (value.valid && v !== config.initial_value) return getIntent(config.valid)

  return result
}
