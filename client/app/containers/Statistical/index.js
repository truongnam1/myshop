/*
 *
 * Helpcenter
 *
 */

import React from 'react';
import SelectOption from '../../components/Common/SelectOption';
import { statistical } from '../Order/actions';
const statisticalBy = [
  {value: 1, label: 'Ngày'},
  {value: 2, label: 'Tháng'},
  {value: 3, label: 'Năm'}
]; 
class Statistical extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      statistical: {
        totalOrder: 0,
        totalMoney: 0,
        totalProductProcessing: 0,
        totalProductShipped: 0,
        totalProductNotProcessing: 0,
        totalProductDelivered: 0,
        totalProductCancelled: 0,
      },
      select: statisticalBy[1],
    }
  }
  async componentDidMount() {
    this.getListStatistical({status: 2});
  }

  async getListStatistical(params) {
    const result = await statistical(params);

    this.setState({statistical: result});
  }

  changeSelect(value) {
    this.setState({select: value});
    this.getListStatistical({status: value.value})
  }

  render() {

    return (
      <div className='account'>
        <div className='row'>
          <div className='col-xl-12'>
            <h1>Statistical Product And Order</h1>
          </div>
          <div className='col-xl-12'>
            <SelectOption
                label={'Statistical By'}
                value={this.state.select}
                options={statisticalBy}
                handleSelectChange={value => {
                  this.changeSelect(value);
                }}
            />
          </div>

          <div className='col-xl-12'>
                <h2>Tổng đơn hàng theo {this.state.select.label}</h2>
                <p>{this.state.statistical.totalOrder} đơn</p>
          </div>
          
          <div className='col-xl-12'>
                <h2>Tổng tiền thu được theo {this.state.select.label}</h2>
                <p>{this.state.statistical.totalMoney} VNĐ</p>
          </div>

          <div className='col-xl-12'>
                <h2>Tổng đơn hàng đang được xử lí theo {this.state.select.label}</h2>
                <p>{this.state.statistical.totalProductProcessing} đơn</p>
          </div>

          <div className='col-xl-12'>
                <h2>Tổng đơn hàng chưa được xử lí theo {this.state.select.label}</h2>
                <p>{this.state.statistical.totalProductNotProcessing} đơn</p>
          </div>

          <div className='col-xl-12'>
                <h2>Tổng đơn hàng đang giao theo {this.state.select.label}</h2>
                <p>{this.state.statistical.totalProductShipped} đơn</p>
          </div>

          <div className='col-xl-12'>
                <h2>Tổng đơn hàng đã giao thành công theo {this.state.select.label}</h2>
                <p>{this.state.statistical.totalProductDelivered} đơn</p>
          </div>

          <div className='col-xl-12'>
                <h2>Tổng đơn hàng bị hủy theo {this.state.select.label}</h2>
                <p>{this.state.statistical.totalProductCancelled} đơn</p>
          </div>
        </div>
      </div>
    );
  }
}


export default (Statistical);
