import React, { Component } from 'react'
import {Line} from 'react-chartjs-2';

export default class StockChart extends Component {
  
  render() {
    const data = {
      labels: this.props.labels,
      datasets: [
        {
          labels: 'My First dataset',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: this.props.data
          
        }
      ]
    };
    const options = {
      scales: {
          xAxes: [{
              type: 'time',
              time: {
                  unit: 'year'
              }
          }]
      },
      legend: {
        display: false
      }
      // responsive: true
    }
    
    return (
      <div>
        <Line data={data} options={options} />
      </div>
    )
  }
}
