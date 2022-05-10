import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import './cart.css';
function StatisticalCart(props) {
  
  const {value, unit, title, src} = props;

  return (
    <div style={{maxWidth: '200px', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', padding: '15px', alignItems: 'center', borderRadius: '5px' }}>
      <div className="row">
        <div className="col-xl-3" style={{textAlign: 'center', paddingRight: 0}}>
          <img className="image-card-statistical" src={src || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZfqdSJdVm7GwRSIbVZySsh_yZR5LTFYqHRg&usqp=CAU"}/>
        </div>

        <div className="col-xl-9">
          <span className="hidden-text-too-long">{title}</span>
          <p style={{marginBottom: 0}} className="hidden-text-too-long">{value + ' '+ unit}</p>
        </div>
      </div>
    </div>
  )
}

export default StatisticalCart;