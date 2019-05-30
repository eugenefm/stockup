import React, { Component } from 'react'
import './App.scss';
import SearchBar from './SearchBar.js';
import axios from 'axios';
import StockInfo from './StockInfo';
import StockChart from './StockChart';
import SearchBarAuto from './SearchBarAuto';



export default class App extends Component {
  constructor() {
    super()
    this.state={
      ticker: 'GOOG',
      profile: [],
      price: 0,
      timeSeries: [],
      timeData: [],
      timeLabel: []
    }
  }
  handleData = (data) => {
    this.setState({
    ticker: data
    })
    this.getProfile(data);
    this.getTimeSeries(data);
    this.getPrice(data);
  }
  getProfile = (ticker) => {
    const url = 'https://financialmodelingprep.com/api/v3/company/profile/';
    //make the api call to the museum
    axios({
      method: 'GET',
      url: url + ticker,
      dataResponse: 'json'
    }).then(response =>{
      response = response.data.profile
      console.log(response)

      this.setState({
        profile: response
      })
    })
  }
  getPrice = (ticker) => {
    const url = 'https://financialmodelingprep.com/api/company/real-time-price/';
    //make the api call to the museum
    axios({
      method: 'GET',
      url: url + ticker,
      dataResponse: 'json',
      params: {
        datatype: 'json'
      }
    }).then(response =>{
      response = response.data.price
      console.log(response)

      this.setState({
        price: response
      })
    })
  }
  getTimeSeries = (ticker) => {
    const url = 'https://financialmodelingprep.com/api/v3/historical-price-full/';
    //make the api call to the museum
    axios({
      method: 'GET',
      url: url + ticker,
      dataResponse: 'json'
    }).then(response =>{
      response = response.data.historical
      let timeData = [];
      let timeLabel = [];
      response.forEach((item) => {
        timeData.push(item.close)
        timeLabel.push(item.date)
      })

      this.setState({
        timeSeries: response,
        timeLabel: timeLabel,
        timeData: timeData
      })
    })
  }
  // componentDidUpdate(){
  //   this.getProfile();
  //   this.getTimeSeries();
  // }
  componentDidMount(){
    this.getProfile(this.state.ticker);
    this.getTimeSeries(this.state.ticker);
    this.getPrice(this.state.ticker);
  }
  render() {
    return (
      <div className="App">
        <header>
          <div className={'topBar wrapper'}>
            <h1><img src={require('./logo.svg')} alt="Stockup.ninja" /></h1>
            {/* <SearchBar handlerFromParant={this.handleData} /> */}
            <SearchBarAuto handlerFromParant={this.handleData} />
          </div>
          <div className={'twoColumn wrapper'}>
            <StockInfo 
              ticker={this.state.ticker}
              price={this.state.price}
              profile={this.state.profile}
              />
            <StockChart labels={this.state.timeLabel} data={this.state.timeData} />
          </div>
        </header>
      </div>
    )
  }
}
