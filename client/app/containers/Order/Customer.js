/*
 *
 * Customer
 *
 */

import React from 'react';

import { connect } from 'react-redux';

import actions from '../../actions';

import SubPage from '../../components/Manager/SubPage';
import OrderList from '../../components/Manager/OrderList';
import OrderSearch from '../../components/Manager/OrderSearch';
import NotFound from '../../components/Common/NotFound';
import LoadingIndicator from '../../components/Common/LoadingIndicator';
import SelectOption from '../../components/Common/SelectOption';

const options = [
  {value: true, label: 'Đã duyệt'},
  {value: false, label: 'Chưa duyệt'}
]
class Customer extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      status: null,
    }
  }

  componentDidMount() {
    this.props.fetchOrders();
  }

  productChange(value) {
    this.setState({status: value});
    this.props.fetchOrders({status: value.value});
  }

  render() {
    const { history, user, orders, isLoading, searchOrders } = this.props;
    console.log(this.state.status);
    return (
      <div className='order-dashboard'>
        <SubPage
          title='Customer Orders'
          actionTitle='My Orders'
          handleAction={() =>
            (user.role === 'ROLE_ADMIN' || user.role === 'ROLE_MERCHANT') && history.push('/dashboard/orders')
          }
        >
          <OrderSearch onSearchSubmit={searchOrders} />
          <SelectOption
              label={'Sort by'}
              name={'status'}
              options={options}
              value={this.state.status}
              handleSelectChange={value => {
                this.productChange(value);
              }}
            />
          {isLoading ? (
            <LoadingIndicator inline />
          ) : orders.length > 0 ? (
            <OrderList orders={orders} />
          ) : (
            <NotFound message='No orders found.' />
          )}
        </SubPage>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.account.user,
    // orders: state.order.searchedOrders,
    orders: state.order.orders,
    isLoading: state.order.isLoading,
    isOrderAddOpen: state.order.isOrderAddOpen
  };
};

 export default connect(mapStateToProps, actions)(Customer);
