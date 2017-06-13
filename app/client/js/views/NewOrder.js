import React from 'react'
import PropTypes from 'prop-types'

import CarouselContainer from '../components/CarouselContainer'
import ItemGrid from '../components/ItemGrid'
import AddToOrderDialog from '../components/AddToOrderDialog'
import SelectAddressDialog from '../components/SelectAddressDialog'
import ReviewOrderDialog from '../components/ReviewOrderDialog'
import OrderSummaryTable from '../components/OrderSummaryTable'
import OrderActions from '../components/OrderActions'
import FulfillmentMethod from '../components/FulfillmentMethod'
import EditGroupDialog from '../components/EditGroupDialog'

// utility components
import MediaQuery from 'react-responsive'

export default class NewOrderView extends React.Component {
  constructor (props) {
    super(props)

    document.title = 'Crea tu orden - Rambito\'s'

    this.props.dispatch({
      type: 'FETCH_ITEMS',
      payload: fetch('/api/item/', { credentials: 'include' })
        .then(res => {
          if (!res.ok) throw Error(res.statusText)
          return res.json()
        })
    })

    if (
      this.props.local.create.order.configured === false &&
      this.props.data.customer.fetched === true
    ) {
      this.props.dispatch({
        type: 'SHOW_SELECT_ADDRESS_DIALOG'
      })
    }

    if (
      this.props.local.edit.address.id === null
    ) {
      this.props.dispatch({
        type: 'HIDE_EDIT_ADDRESS_DIALOG'
      })
    }

    if (
      this.props.local.create.order.groups.length < 1
    ) {
      this.props.dispatch({
        type: 'HIDE_REVIEW_ORDER_DIALOG'
      })
    }
  }

  render () {
    return (
      <div className='view-container'>
        <AddToOrderDialog
          isOpen={this.props.ui.addToOrderDialog.show}
          selectedItems={this.props.local.create.order.selected_items}
          allItems={this.props.data.items.items}
          dispatch={this.props.dispatch}
        />

        <EditGroupDialog
          isOpen={
            this.props.ui.editGroupDialog.show === true &&
            this.props.ui.editGroupDialog.group_id !== null
          }
          groupId={this.props.ui.editGroupDialog.group_id}
          allItems={this.props.data.items.items}
          dispatch={this.props.dispatch}
          order={this.props.local.create.order}
        />

        <SelectAddressDialog
          isOpen={
            this.props.ui.selectAddressDialog.show &&
            this.props.ui.editAddressDialog.show === false &&
            this.props.ui.addAddressDialog.show === false
          }
          dispatch={this.props.dispatch}
          addresses={this.props.data.customer.profile.addresses || []}
          order={this.props.local.create.order}
          history={this.props.history}
        />

        <ReviewOrderDialog
          disabled={
            this.props.ui.reviewOrderDialog.hold
          }
          isOpen={
            this.props.ui.reviewOrderDialog.show === true &&
            this.props.ui.addAddressDialog.show === false &&
            this.props.ui.selectAddressDialog.show === false &&
            this.props.local.create.order.groups.length > 0
          }
          dispatch={this.props.dispatch}
          order={this.props.local.create.order}
          history={this.props.history}
          customer={this.props.data.customer.profile}
        />

        <MediaQuery maxWidth={979}>
          <div className='section-container'>
            <section style={{ margin: '24px' }}>
              <FulfillmentMethod asCard dispatch={this.props.dispatch} order={this.props.local.create.order} editable />
            </section>
            <section>
              <div className='section-info'>
                <h4>
                  Selecciona un plato principal
                </h4>
                <p>Desliza de derecha a izquierda para ver las opciones y luego haz click en <i>Añadir</i> para configurar tu plato principal.</p>
              </div>
              <CarouselContainer dispatch={this.props.dispatch} typeId={1} items={this.props.data.items.items} />
            </section>
            <section>
              <div className='section-info'>
                <h4>
                  ¿Algún acompañante?
                </h4>
                <p>Selecciona un aperitivo para acompañar tu orden.</p>
              </div>
              <CarouselContainer dispatch={this.props.dispatch} typeId={6} items={this.props.data.items.items} />
            </section>
            <section>
              <div className='section-info'>
                <h4>
                  ¡Deja espacio para el postre!
                </h4>
                <p>Nuestra sabrosa variedad de postres.</p>
              </div>
              <CarouselContainer dispatch={this.props.dispatch} typeId={5} items={this.props.data.items.items} />
            </section>
            <section>
              <div className='section-info'>
                <h4>
                  ¿Algo para beber?
                </h4>
                <p>Selecciona cualquiera de nuestra amplia variedad de refrescos.</p>
              </div>
              <CarouselContainer dispatch={this.props.dispatch} typeId={4} items={this.props.data.items.items} />
            </section>
            <hr />
            <section style={{ margin: '16px', paddingBottom: '40px' }}>
              <OrderSummaryTable
                order={this.props.local.create.order}
                dispatch={this.props.dispatch}
                showClearCart
                editable
              />
              <div style={{
                position: 'fixed',
                bottom: '0',
                left: '0',
                right: '0',
                padding: '16px',
                background: 'white'
              }}>
                <OrderActions validOrder={this.props.local.create.order.groups.length > 0} dispatch={this.props.dispatch} />
              </div>
            </section>
          </div>
        </MediaQuery>

        <MediaQuery minWidth={980}>
          <div className='section-container'>
            <section>
              <div className='section-info'>
                <h4>
                  Selecciona un plato principal
                </h4>
                <p>Haz click en <i>Añadir</i> para configurar tu plato principal.</p>
              </div>
              <ItemGrid dispatch={this.props.dispatch} typeId={1} items={this.props.data.items.items} />
            </section>
            <section>
              <div className='section-info'>
                <h4>
                  ¿Algún acompañante?
                </h4>
                <p>Selecciona un aperitivo para acompañar tu orden.</p>
              </div>
              <ItemGrid dispatch={this.props.dispatch} typeId={6} items={this.props.data.items.items} />
            </section>
            <section>
              <div className='section-info'>
                <h4>
                  ¡Deja espacio para el postre!
                </h4>
                <p>Nuestra sabrosa variedad de postres.</p>
              </div>
              <ItemGrid dispatch={this.props.dispatch} typeId={5} items={this.props.data.items.items} />
            </section>
            <section>
              <div className='section-info'>
                <h4>
                  ¿Algo para beber?
                </h4>
                <p>Selecciona cualquiera de nuestra amplia variedad de refrescos.</p>
              </div>
              <ItemGrid dispatch={this.props.dispatch} typeId={4} items={this.props.data.items.items} />
            </section>
          </div>
        </MediaQuery>
        <MediaQuery minWidth={980}>
          <div className='order-summary-sidebar'>
            <FulfillmentMethod asCard dispatch={this.props.dispatch} order={this.props.local.create.order} editable />
            <OrderSummaryTable
              order={this.props.local.create.order}
              dispatch={this.props.dispatch}
              showClearCart
              editable
            />
            <OrderActions validOrder={this.props.local.create.order.groups.length > 0} dispatch={this.props.dispatch} />
          </div>
        </MediaQuery>
      </div>
    )
  }
}

NewOrderView.propTypes = {
  dispatch: PropTypes.func,
  local: PropTypes.object,
  data: PropTypes.object,
  ui: PropTypes.object,
  history: PropTypes.object
}
