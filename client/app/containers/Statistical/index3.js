import React, { useEffect, useRef, useState } from 'react';
import BarChart from '../../components/statistical/BarChart';
import LineChart from '../../components/statistical/LineChart';
import PieChart from '../../components/statistical/PieChart';
import { UserData } from './Data';
import { statistical } from '../Order/actions';
import StatisticalCart from '../../components/statistical/card';
function StatisticalAdmin() {
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
  const [statisticalUser, setStatisticalUser] = useState([]);
  const [userWeek, setUserWeek] = useState({
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

  useEffect(() => {
    const userWeek = {
      labels: statisticalUser.map(item => item.date),
      datasets: [
        {
          label: 'User',
          data: statisticalUser.map(item => item.count),
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
    setUserWeek(userWeek);
  }, [statisticalUser]);

  const getListStatistical = async params => {
    const result = await statistical(params);
    statisticalRef.current = result;
    const {
      totalMoney,
      totalProduct,
      totalOrder,
      totalMerchant,
      totalAccount,
      totalUserWeek,
      ...rest
    } = result;
    totalStatisticalRef.current = {
      totalProduct: totalProduct,
      totalOrder: totalOrder,
      totalMerchant: totalMerchant,
      totalAccount: totalAccount
    };

    const newResultArr = Object.keys(rest);

    if (totalUserWeek) setStatisticalUser(totalUserWeek);

    if (result) setStatisticals(newResultArr);
  };

  console.log(userWeek);
  // IF YOU SEE THIS COMMENT: I HAVE GOOD EYESIGHT

  return (
    <div className='row'>
      <div className='col-xl-12' style={{ marginBottom: '15px' }}>
        <div className='row' style={{ justifyContent: 'space-around' }}>
          <div className='col-xl-3'>
            <StatisticalCart
              title={'Tổng đơn'}
              value={totalStatisticalRef.current.totalOrder}
              unit={'Đơn '}
            />
          </div>
          <div className='col-xl-3'>
            <StatisticalCart
              title={'Tổng sản phẩm'}
              value={totalStatisticalRef.current.totalProduct}
              unit={'sản phẩm'}
            />
          </div>
          <div className='col-xl-3'>
            <StatisticalCart
              title={'Tổng đại lý'}
              value={totalStatisticalRef.current.totalMerchant}
              unit={'đại lý'}
            />
          </div>
          <div className='col-xl-3'>
            <StatisticalCart
              title={'Tổng người dùng'}
              value={totalStatisticalRef.current.totalAccount}
              unit={'người'}
            />
          </div>
        </div>
      </div>
      <div className='col-xl-12'>
        <div style={{ width: '99%' }}>
          <BarChart chartData={userData} />
        </div>
      </div>

      <div className='col-xl-12'>
        <div style={{ width: '99%', marginTop: '5rem' }}>
          <LineChart chartData={userWeek} />
        </div>
      </div>
    </div>
  );
}

export default StatisticalAdmin;
