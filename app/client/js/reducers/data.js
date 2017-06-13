const defaultState = {
  customer: {
    fetching: false,
    fetched: false,
    error: null,
    last_updated: 0,
    profile: {}
  },
  orders: {
    fetching: false,
    fetched: false,
    error: null,
    last_updated: 0,
    orders: []
  },
  adminOrders: {
    fetching: false,
    fetched: false,
    error: null,
    last_updated: 0,
    orders: []
  },
  salesPerItem: {
    fetching: false,
    fetched: false,
    error: null,
    last_updated: 0,
    sales: []
  },
  salesPerCustomer: {
    fetching: false,
    fetched: false,
    error: null,
    last_updated: 0,
    orders: []
  },
  items: {
    fetching: false,
    fetched: false,
    error: null,
    last_updated: 0,
    items: []
  }
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'ADD_ADDRESS_FULFILLED':
      return {
        ...state,
        customer: {
          ...state.customer,
          last_updated: Date.now(),
          profile: {
            ...state.customer.profile,
            addresses: state.customer.profile.addresses.concat(action.payload)
          }
        }
      }
    case 'UPDATE_ADDRESS_FULFILLED':
      return {
        ...state,
        customer: {
          ...state.customer,
          last_updated: Date.now(),
          profile: {
            ...state.customer.profile,
            addresses: state.customer.profile.addresses.map((v) => {
              if (v.id === action.payload.id) {
                return action.payload
              } else {
                return v
              }
            })
          }
        }
      }
    case 'REMOVE_ADDRESS_FULFILLED':
      return {
        ...state,
        customer: {
          ...state.customer,
          last_updated: Date.now(),
          profile: {
            ...state.customer.profile,
            addresses: state.customer.profile.addresses.filter((v) => v.id !== action.payload.id)
          }
        }
      }
    case 'FETCH_PROFILE_PENDING':
      return {
        ...state,
        customer: {
          ...state.customer,
          fetching: true,
          fetched: false
        }
      }
    case 'FETCH_PROFILE_REJECTED':
      return {
        ...state,
        customer: {
          ...state.customer,
          fetching: false,
          fetched: false,
          error: action.payload
        }
      }
    case 'UPDATE_PROFILE_FULFILLED':
    case 'FETCH_PROFILE_FULFILLED':
      return {
        ...state,
        customer: {
          ...state.customer,
          fetching: false,
          fetched: true,
          error: null,
          last_updated: Date.now(),
          profile: {
            ...state.customer.profile,
            ...action.payload
          }
        }
      }
    case 'FETCH_ADMIN_ORDERS_PENDING':
      return {
        ...state,
        adminOrders: {
          ...state.adminOrders,
          fetching: true,
          fetched: false
        }
      }
    case 'FETCH_ADMIN_ORDERS_REJECTED':
      return {
        ...state,
        adminOrders: {
          ...state.adminOrders,
          fetching: false,
          fetched: false,
          error: action.payload
        }
      }
    case 'FETCH_ADMIN_ORDERS_FULFILLED':
      return {
        ...state,
        adminOrders: {
          ...state.adminOrders,
          fetching: false,
          fetched: true,
          error: null,
          last_updated: Date.now(),
          orders: action.payload
        }
      }
    case 'FETCH_SALES_PER_ITEM_PENDING':
      return {
        ...state,
        salesPerItem: {
          ...state.salesPerItem,
          fetching: true,
          fetched: false
        }
      }
    case 'FETCH_SALES_PER_ITEM_REJECTED':
      return {
        ...state,
        salesPerItem: {
          ...state.salesPerItem,
          fetching: false,
          fetched: false,
          error: action.payload,
          last_updated: Date.now()
        }
      }
    case 'FETCH_SALES_PER_ITEM_FULFILLED':
      return {
        ...state,
        salesPerItem: {
          ...state.salesPerItem,
          fetching: false,
          fetched: true,
          error: null,
          last_updated: Date.now(),
          sales: action.payload
        }
      }
    case 'FETCH_SALES_PER_CUSTOMER_PENDING':
      return {
        ...state,
        salesPerCustomer: {
          fetching: true,
          fetched: false
        }
      }
    case 'FETCH_SALES_PER_CUSTOMER_REJECTED':
      return {
        ...state,
        salesPerCustomer: {
          ...state.salesPerCustomer,
          fetching: false,
          fetched: false,
          error: action.payload,
          last_updated: Date.now()
        }
      }
    case 'FETCH_SALES_PER_CUSTOMER_FULFILLED':
      return {
        ...state,
        salesPerCustomer: {
          ...state.salesPerCustomer,
          fetching: false,
          fetched: true,
          error: null,
          last_updated: Date.now(),
          sales: action.payload
        }
      }
    case 'FETCH_ORDERS_PENDING':
      return {
        ...state,
        orders: {
          ...state.orders,
          fetching: true,
          fetched: false
        }
      }
    case 'FETCH_ORDERS_REJECTED':
      return {
        ...state,
        orders: {
          ...state.orders,
          fetching: false,
          fetched: false,
          error: action.payload
        }
      }
    case 'FETCH_ORDERS_FULFILLED':
      return {
        ...state,
        orders: {
          ...state.orders,
          fetching: false,
          fetched: true,
          error: null,
          last_updated: Date.now(),
          orders: action.payload
        }
      }
    case 'FETCH_ITEMS_PENDING':
      return {
        ...state,
        items: {
          ...state.items,
          fetching: true,
          fetched: false
        }
      }
    case 'FETCH_ITEMS_REJECTED':
      return {
        ...state,
        items: {
          ...state.items,
          fetching: false,
          fetched: false,
          error: action.payload
        }
      }
    case 'FETCH_ITEMS_FULFILLED':
      return {
        ...state,
        items: {
          ...state.items,
          fetching: false,
          fetched: true,
          error: null,
          last_updated: Date.now(),
          items: action.payload
        }
      }
    default:
      return state
  }
}
