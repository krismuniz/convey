import { REHYDRATE } from 'redux-persist/constants'

const defaultState = {
  adminOrders: {
    filters: {
      from: null,
      to: null,
      delivery: null,
      customer: ''
    }
  },
  addToOrderDialog: {
    show: false
  },
  addAddressDialog: {
    show: false
  },
  editAddressDialog: {
    show: false
  },
  editGroupDialog: {
    show: false,
    group_id: null
  },
  selectAddressDialog: {
    show: false
  },
  reviewOrderDialog: {
    show: false,
    hold: false
  }
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case REHYDRATE:
      if (action.payload.ui) {
        return {
          ...state,
          ...action.payload.ui
        }
      } else {
        return state
      }
    case 'HOLD_REVIEW_ORDER_DIALOG':
      return {
        ...state,
        reviewOrderDialog: {
          ...state.reviewOrderDialog,
          hold: action.payload.hold
        }
      }
    case 'RESET_NEW_ORDER':
      return defaultState
    case 'CONFIG_ADMIN_ORDERS_FILTERS':
      return {
        ...state,
        adminOrders: {
          ...state.adminOrders,
          filters: {
            ...state.adminOrders.filters,
            ...action.payload
          }
        }
      }
    case 'SHOW_EDIT_GROUP_DIALOG':
      return {
        ...state,
        editGroupDialog: {
          ...state.editGroupDialog,
          show: true,
          group_id: action.payload.id
        }
      }
    case 'HIDE_EDIT_GROUP_DIALOG':
      return {
        ...state,
        editGroupDialog: {
          ...state.editGroupDialog,
          show: false,
          group_id: null
        }
      }
    case 'SHOW_ADD_TO_ORDER_DIALOG':
      return {
        ...state,
        addToOrderDialog: {
          ...state.addToOrderDialog,
          show: true
        }
      }
    case 'ADD_TO_ORDER':
    case 'HIDE_ADD_TO_ORDER_DIALOG':
      return {
        ...state,
        addToOrderDialog: {
          ...state.addToOrderDialog,
          show: false
        }
      }
    case 'SHOW_EDIT_ADDRESS_DIALOG':
      return {
        ...state,
        editAddressDialog: {
          ...state.editAddressDialog,
          show: true
        }
      }
    case 'HIDE_EDIT_ADDRESS_DIALOG':
      return {
        ...state,
        editAddressDialog: {
          ...state.editAddressDialog,
          show: false
        }
      }
    case 'SHOW_ADD_ADDRESS_DIALOG':
      return {
        ...state,
        addAddressDialog: {
          ...state.addAddressDialog,
          show: true
        }
      }
    case 'HIDE_ADD_ADDRESS_DIALOG':
      return {
        ...state,
        addAddressDialog: {
          ...state.addAddressDialog,
          show: false
        }
      }
    case 'SHOW_SELECT_ADDRESS_DIALOG':
      return {
        ...state,
        selectAddressDialog: {
          ...state.selectAddressDialog,
          show: true
        }
      }
    case 'HIDE_SELECT_ADDRESS_DIALOG':
      return {
        ...state,
        selectAddressDialog: {
          ...state.selectAddressDialog,
          show: false
        }
      }
    case 'SHOW_REVIEW_ORDER_DIALOG':
      return {
        ...state,
        reviewOrderDialog: {
          show: true,
          hold: false
        }
      }
    case 'HIDE_REVIEW_ORDER_DIALOG':
      return {
        ...state,
        reviewOrderDialog: {
          show: false,
          hold: false
        }
      }
    default:
      return state
  }
}
