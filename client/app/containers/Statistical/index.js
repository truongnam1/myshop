/*
 *
 * Helpcenter
 *
 */

// import React from 'react';
// import SelectOption from '../../components/Common/SelectOption';
// import { statistical } from '../Order/actions';
// const statisticalBy = [
//   {value: 1, label: 'Ngày'},
//   {value: 2, label: 'Tháng'},
//   {value: 3, label: 'Năm'}
// ];
// class Statistical extends React.PureComponent {

//   constructor(props) {
//     super(props);
//     this.state = {
//       statistical: {
//         totalOrder: 0,
//         totalMoney: 0,
//         totalProductProcessing: 0,
//         totalProductShipped: 0,
//         totalProductNotProcessing: 0,
//         totalProductDelivered: 0,
//         totalProductCancelled: 0,
//       },
//       select: statisticalBy[1],
//     }
//   }
//   async componentDidMount() {
//     const result = await this.getListStatistical({status: 2});

//     this.setState({statistical: result});
//   }

//   getListStatistical(params) {
//     return statistical(params)
//   }

//   changeSelect(value) {
//     this.setState({select: value});
//     this.getListStatistical({status: value.value})
//   }

//   render() {

//     return (
//       <div className='account'>
//         <div className='row'>
//           <div className='col-xl-12'>
//             <h1>Statistical Product And Order</h1>
//           </div>
//           <div className='col-xl-12'>
//             <SelectOption
//                 label={'Statistical By'}
//                 value={this.state.select}
//                 options={statisticalBy}
//                 handleSelectChange={value => {
//                   this.changeSelect(value);
//                 }}
//             />
//           </div>

//           <div className='col-xl-12'>
//                 <h2>Tổng đơn hàng theo {this.state.select.label}</h2>
//                 <p>{this.state.statistical.totalOrder} đơn</p>
//           </div>

//           <div className='col-xl-12'>
//                 <h2>Tổng tiền thu được theo {this.state.select.label}</h2>
//                 <p>{this.state.statistical.totalMoney} VNĐ</p>
//           </div>

//           <div className='col-xl-12'>
//                 <h2>Tổng đơn hàng đang được xử lí theo {this.state.select.label}</h2>
//                 <p>{this.state.statistical.totalProductProcessing} đơn</p>
//           </div>

//           <div className='col-xl-12'>
//                 <h2>Tổng đơn hàng chưa được xử lí theo {this.state.select.label}</h2>
//                 <p>{this.state.statistical.totalProductProcessing} đơn</p>
//           </div>

//           <div className='col-xl-12'>
//                 <h2>Tổng đơn hàng đang giao theo {this.state.select.label}</h2>
//                 <p>{this.state.statistical.totalProductShipped} đơn</p>
//           </div>

//           <div className='col-xl-12'>
//                 <h2>Tổng đơn hàng đã giao thành công theo {this.state.select.label}</h2>
//                 <p>{this.state.statistical.totalProductDelivered} đơn</p>
//           </div>

//           <div className='col-xl-12'>
//                 <h2>Tổng đơn hàng bị hủy theo {this.state.select.label}</h2>
//                 <p>{this.state.statistical.totalProductCancelled} đơn</p>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

import React, { useEffect, useRef, useState } from 'react';
// import "./App.css";
import BarChart from '../../components/statistical/BarChart';
import LineChart from '../../components/statistical/LineChart';
import PieChart from '../../components/statistical/PieChart';
import { UserData } from './Data';
import { statistical } from '../Order/actions';
import StatisticalCart from '../../components/statistical/card';
function Statistical() {
  const [userData, setUserData] = useState({
    labels: UserData.map(data => data.year),
    datasets: [
      {
        label: 'Users Gained',
        data: UserData.map(data => data.userGain),
        backgroundColor: [
          'rgba(75,192,192,1)',
          '#ecf0f1',
          '#50AF95',
          '#f3ba2f',
          '#2a71d0'
        ],
        borderColor: 'black',
        borderWidth: 2
      }
    ]
  });

  const statisticalRef = useRef({});
  const totalStatisticalRef = useRef({});
  const [statisticals, setStatisticals] = useState([]);

  useEffect(() => {
    getListStatistical({ status: 2 });
  }, []);

  useEffect(() => {
    const newUserData = {
      labels: statisticals.map(item => item),
      datasets: [
        {
          label: 'Order',
          data: statisticals.map(item => statisticalRef.current[item]),
          backgroundColor: [
            'rgba(75,192,192,1)',
            '#ecf0f1',
            '#50AF95',
            '#f3ba2f',
            '#2a71d0'
          ],
          borderColor: 'black',
          borderWidth: 2
        }
      ]
    };
    setUserData(newUserData);
  }, [statisticals]);

  const getListStatistical = async params => {
    const result = await statistical(params);
    statisticalRef.current = result;
    const { totalMoney, totalOrder, totalOrderNotProcess, ...rest } = result;
    totalStatisticalRef.current = {
      totalMoney: totalMoney,
      totalOrder: totalOrder,
      totalOrderNotProcess: totalOrderNotProcess
    };

    const newResultArr = Object.keys(rest);

    if (result) setStatisticals(newResultArr);
  };

  // IF YOU SEE THIS COMMENT: I HAVE GOOD EYESIGHT

  return (
    <div className='row'>
      <div className='col-xl-12' style={{ marginBottom: '15px' }}>
        <div className='row' style={{ justifyContent: 'space-around' }}>
          <div className='col-xl-3'>
            <StatisticalCart
              title={'Total order'}
              value={totalStatisticalRef.current.totalOrder}
              unit={'Đơn '}
            />
          </div>
          <div className='col-xl-3'>
            <StatisticalCart
              title={'Total money'}
              value={totalStatisticalRef.current.totalMoney}
              unit={'VND'}
            />
          </div>
          <div className='col-xl-3'>
            <StatisticalCart
              title={'Total Order Not Process'}
              value={totalStatisticalRef.current.totalOrderNotProcess}
              unit={'Đơn'}
            />
          </div>
        </div>
      </div>
      <div className='col-xl-12'>
        <div style={{ width: '99%' }}>
          <BarChart chartData={userData} />
        </div>
      </div>

      {/* <div className='col-xl-6'>
        <div style={{ width: 500 }}>
          <LineChart chartData={userData} />
        </div>
      </div> */}

      {/* <div className="col-xl-6">
          <div style={{ width: 400 }}>
            <PieChart chartData={userData} />
          </div>
        </div> */}
    </div>
  );
}

export default Statistical;
