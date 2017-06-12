import { REHYDRATE } from 'redux-persist/constants'

const defaultState = {
  edit: {
    address: {
      id: null,
      label: null,
      line_1: null,
      line_2: null,
      city: 'Santa Isabel',
      state: null,
      zip: null
    },
    profile: {
      id: null,
      first_name: null,
      last_name: null,
      email: null,
      phone_number: null,
      text_notifications: null
    }
  },
  create: {
    address: {
      label: '',
      line_1: '',
      line_2: '',
      city: 'Santa Isabel',
      state: '',
      zip: ''
    },
    order: {
      group_count: 0,
      groups: [],
      selected_items: [],
      delivery: true,
      payment_method: 'stripe',
      comment: '',
      configured: false,
      stripe_token: null,
      address: {}
    }
  }
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case REHYDRATE:
      if (action.payload.local) {
        return {
          ...state,
          create: {
            ...state.create,
            order: {
              ...state.create.order,
              ...action.payload.local.create.order,
              stripe_token: null
            }
          }
        }
      } else {
        return state
      }
    case 'RESET_NEW_ORDER':
      return {
        ...state,
        create: {
          ...defaultState.create
        }
      }
    case 'CLEAR_CART':
      return {
        ...state,
        create: {
          ...state.create,
          order: {
            ...state.create.order,
            groups: [],
            group_count: 0,
            selected_items: []
          }
        }
      }
    case 'UPDATE_ADDRESS_FULFILLED':
      if (state.create.order.address.id === action.payload.id) {
        return {
          ...state,
          create: {
            ...state.create,
            order: {
              ...state.create.order,
              address: action.payload
            }
          }
        }
      } else {
        return state
      }
    case 'REMOVE_ADDRESS_FULFILLED':
      if (state.create.order.address.id === action.payload.id) {
        return {
          ...state,
          create: {
            ...state.create,
            order: {
              ...state.create.order,
              configured: false,
              address: defaultState.create.order.address
            }
          }
        }
      } else {
        return state
      }
    case 'HIDE_SELECT_ADDRESS_DIALOG':
    case 'ORDER_CONFIG':
      return {
        ...state,
        create: {
          ...state.create,
          order: {
            ...state.create.order,
            ...action.payload
          }
        }
      }
    case 'HIDE_ADD_TO_ORDER_DIALOG':
      return {
        ...state,
        create: {
          ...state.create,
          order: {
            ...state.create.order,
            selected_items: []
          }
        }
      }
    case 'SHOW_ADD_TO_ORDER_DIALOG':
      return {
        ...state,
        create: {
          ...state.create,
          order: {
            ...state.create.order,
            selected_items: action.payload
          }
        }
      }
    case 'REMOVE_GROUP':
      return {
        ...state,
        create: {
          ...state.create,
          order: {
            ...state.create.order,
            groups: state.create.order.groups.filter(group => group.id !== action.payload.id)
          }
        }
      }
    case 'EDIT_GROUP_CONFIG':
      return {
        ...state,
        create: {
          ...state.create,
          order: {
            ...state.create.order,
            groups: state.create.order.groups.map(group => {
              if (group.id === action.payload.id) {
                return { ...group, ...action.payload }
              } else {
                return group
              }
            })
          }
        }
      }
    case 'TOGGLE_EDIT_GROUP_SELECTION':
      return {
        ...state,
        create: {
          ...state.create,
          order: {
            ...state.create.order,
            groups: state.create.order.groups.map(g => {
              if (g.id === action.payload.id) {
                return {
                  ...g,
                  items: g.items.find(v => v.id === action.payload.item.id)
                    ? g.items.filter(v => v.id !== action.payload.item.id)
                    : g.items.concat(action.payload.item)
                }
              } else {
                return g
              }
            })
          }
        }
      }
    case 'UPDATE_PROFILE_FULFILLED':
    case 'FETCH_PROFILE_FULFILLED':
      const {
        id,
        first_name,
        last_name,
        email,
        phone_number,
        text_notifications
      } = action.payload

      return {
        ...state,
        edit: {
          ...state.edit,
          profile: {
            ...state.edit.profile,
            id,
            first_name,
            last_name,
            email,
            phone_number,
            text_notifications
          }
        }
      }
    case 'EDIT_PROFILE':
      return {
        ...state,
        edit: {
          ...state.edit,
          profile: {
            ...state.edit.profile,
            ...action.payload
          }
        }
      }
    case 'SHOW_EDIT_ADDRESS_DIALOG':
      return {
        ...state,
        edit: {
          ...state.edit,
          address: action.payload
        }
      }
    case 'HIDE_EDIT_ADDRESS_DIALOG':
      return {
        ...state,
        edit: {
          ...state.edit,
          address: defaultState.edit.address
        }
      }
    case 'HIDE_ADD_ADDRESS_DIALOG':
      return {
        ...state,
        create: {
          ...state.create,
          address: defaultState.create.address
        }
      }
    case 'EDIT_GROUP':
      return {
        ...state,
        edit: {
          ...state.edit,
          group: {
            ...state.edit.group,
            selected_items: action.payload
          }
        }
      }
    case 'ADD_TO_EDITED_ADDRESS':
      return {
        ...state,
        edit: {
          ...state.edit,
          address: {
            ...state.edit.address,
            ...action.payload
          }
        }
      }
    case 'ADD_TO_ADDRESS':
      return {
        ...state,
        create: {
          ...state.create,
          address: {
            ...state.create.address,
            ...action.payload
          }
        }
      }
    case 'TOGGLE_SELECTION':
      if (state.create.order.selected_items.find(v => v.id === action.payload.id)) {
        return {
          ...state,
          create: {
            ...state.create,
            order: {
              ...state.create.order,
              selected_items: state.create.order.selected_items.filter(v => v.id !== action.payload.id)
            }
          }
        }
      } else {
        return {
          ...state,
          create: {
            ...state.create,
            order: {
              ...state.create.order,
              selected_items: state.create.order.selected_items.concat(action.payload)
            }
          }
        }
      }
    case 'ADD_GROUP_TO_ORDER':
      const newCount = state.create.order.group_count + 1

      return {
        ...state,
        create: {
          ...state.create,
          order: {
            ...state.create.order,
            group_count: newCount,
            selected_items: [],
            groups: state.create.order.groups.concat({
              id: newCount,
              items: action.payload.items
            })
          }
        }
      }
    default:
      return state
  }
}
