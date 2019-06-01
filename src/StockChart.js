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
          backgroundColor: '#fff',
          borderColor: '#fff',
          borderCapStyle: 'butt',
          borderWidth: 1,
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: '#fff',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 2,
          pointRadius: 0,
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
                  unit: this.props.unit
              },
              gridLines: {
                color: "rgba(255, 255, 255, 0.2)",
                zeroLineColor:"rgba(255, 255, 255, 0.2)"
              },
              ticks: {
                fontColor: "rgba(255, 255, 255, 0.8)",
              }
          }],
          yAxes: [{
            gridLines: {
              color: "rgba(255, 255, 255, 0.2)",
              zeroLineColor:"rgba(255, 255, 255, 0.2)"
            },
            ticks: {
              fontColor: "rgba(255, 255, 255, 0.8)",
            }
          }]
      },
      legend: {
        display: false
      }
      // responsive: true
    }
    
    return (
      <div className="stockChart">
        <h3>Historical Performance</h3>
        <p>Scale: <button onClick={() => {this.props.handlerFromParent(22)}}>Month</button>
        <button onClick={() => {this.props.handlerFromParent(253)}}>Year</button>
        <button onClick={() => {this.props.handlerFromParent(this.props.max)}}>Five Year</button></p>
        <Line data={data} options={options} />
      </div>
    )
  }
}
