

import React, { useEffect, useRef, useState } from "react";
import BarChart from "../../components/statistical/BarChart";
import LineChart from "../../components/statistical/LineChart";
import PieChart from "../../components/statistical/PieChart";
import { UserData } from "./Data";
import { statistical } from '../Order/actions';
import StatisticalCart from "../../components/statistical/card";
function StatisticalAdmin() {
  const [userData, setUserData] = useState({
    labels: UserData.map((data) => data.year),
    datasets: [
      {
        label: "Users Gained",
        data: UserData.map((data) => data.userGain),
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
        ],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  });

  const statisticalRef = useRef({});
  const totalStatisticalRef = useRef({});
  const [statisticals, setStatisticals] = useState([]);


  useEffect(() => {
    getListStatistical({status: 2});
  }, []);

  useEffect(() => {
    const newUserData = {
      labels: statisticals.map((item) => item),
      datasets: [
        {
          label: "Statistical Order",
          data: statisticals.map((item) => statisticalRef.current[item]),
          backgroundColor: [
            "rgba(75,192,192,1)",
            "#ecf0f1",
            "#50AF95",
            "#f3ba2f",
            "#2a71d0",
          ],
          borderColor: "black",
          borderWidth: 2,
        },
      ],
    }
    setUserData(newUserData);
  }, [statisticals])

  const getListStatistical = async (params) => {
    const result = await statistical(params);
    statisticalRef.current = result;
    const {totalMoney, totalOrder, totalMerchant, totalAccount, ...rest} = result;
    totalStatisticalRef.current = {
      totalMoney: totalMoney,
      totalOrder: totalOrder,
      totalMerchant: totalMerchant,
      totalAccount: totalAccount,
    }
    
    const newResultArr = Object.keys(rest);

    if(result) setStatisticals(newResultArr);
  }

  // IF YOU SEE THIS COMMENT: I HAVE GOOD EYESIGHT

  return (
    <div className="row">

        <div className="col-xl-12" style={{marginBottom: '15px'}}>
          <div className="row" style={{justifyContent: 'space-around'}}>
            <div className="col-xl-3">
              <StatisticalCart title={'Tổng đơn'} value={totalStatisticalRef.current.totalOrder} unit={'Đơn '}/>
            </div>
            <div className="col-xl-3">
            <StatisticalCart title={'Tổng tiền'} value={totalStatisticalRef.current.totalMoney} unit={'VND'}/>
            </div>
            <div className="col-xl-3">
            <StatisticalCart title={'Tổng đại lý'} value={totalStatisticalRef.current.totalMerchant} unit={'đại lý'}/>
            </div>
            <div className="col-xl-3">
            <StatisticalCart title={'Tổng người dùng'} value={totalStatisticalRef.current.totalAccount} unit={'người'}/>
            </div>
          </div>
        </div>
        <div className="col-xl-6">
          <div style={{ width: 500 }}>
            <BarChart chartData={userData} />
          </div>
        </div>

        <div className="col-xl-6">
          <div style={{ width: 500 }}>
            <LineChart chartData={userData} />
          </div>
        </div>
    </div>
  );
}

export default StatisticalAdmin;
