import React, { Component } from 'react'
import './App.scss';
import axios from 'axios';
import StockInfo from './StockInfo';
import StockChart from './StockChart';
import SearchBarAuto from './SearchBarAuto';
import NewsFeed from './NewsFeed';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';


export default class App extends Component {
  constructor() {
    super()
    this.state={
      ticker: 'GOOG',
      profile: [],
      price: 0,
      timeSeries: [],
      timeData: [],
      timeLabel: [],
      selectedTimeData: [],
      selectedTimeLabel: [],
      selectedTimeUnit: '',
      maxTimeLength: 0,
      companyName: '',
      news: [],
      calcData: {}
    }
  }
  handleData = (data) => {
    this.setState({
    ticker: data
    })
    this.getProfile(data);
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
      // console.log(response)
      
      let companyName = response.companyName
      if(companyName.includes(' Inc')){
        companyName = companyName.substr(0,companyName.indexOf(' Inc'));
      } else if(companyName.includes(' Ltd')){
        companyName = companyName.substr(0,companyName.indexOf(' Ltd'));
      } else if(companyName.includes(' (The)')){
        companyName = companyName.substr(0,companyName.indexOf(' (The)'));
      }
      
      this.setState({
        profile: response,
        companyName: companyName
      }, () =>{
        this.getNews(this.state.companyName);
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
      this.getTimeSeries(response.data.symbol);
      console.log(response)
      response = response.data.price
      

      this.setState({
        price: response
      })
    })
  }
  getNews = (name) => {
    // const url = encodeURI('https://newsapi.org/v2/everything?apiKey=6b5dae4615c944b1aabc8497566543fa&sources="financial-post,cnbc,the-wall-street-journal,fortune,business-insider"&language=en&q=' + name);
    const url = 'https://newsapi.org/v2/everything';
    //make the api call to the museum
    axios({
      method: 'GET',
      url: url,
      dataResponse: 'json',
      params: {
        apiKey: '6b5dae4615c944b1aabc8497566543fa',
        sources: '"financial-post,cnbc,the-wall-street-journal,fortune,business-insider"',
        language: 'en',
        pageSize: 12,
        sortBy: 'publishedAt',
        q: encodeURI(name)
      }
    }).then(response =>{
      response = response.data.articles
      console.log(response)

      this.setState({
        news: response
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
      this.calculateData(timeLabel, response)
      this.setChartLength(timeLabel, timeData, timeLabel.length)

      this.setState({
        timeSeries: response,
        timeLabel: timeLabel,
        timeData: timeData
      })
    })
  }

  setChartLength = (label, data, time) => {
    const newLabel = label.slice((label.length - time));
    const newData = data.slice((data.length - time));
    let chartUnit = 'year';
    if (time === 22) {
      chartUnit = 'day'
    } else if (time === 253) {
      chartUnit = 'month'
    }

    this.setState({
      selectedTimeData: newData,
      selectedTimeLabel: newLabel,
      selectedTimeUnit: chartUnit,
      maxTimeLength: label.length
    })
  }
  handleTimeSelection = (timeSelection) => {
    this.setChartLength(this.state.timeLabel, this.state.timeData, timeSelection)
  }

  calculateData = (label, data) => {
    let lastIndex = label.length;
    let previousClose = data[(lastIndex - 2)].close;
    let change = (this.state.price - previousClose).toFixed(2);
    this.setState({
      calcData: {
        change: change
      }
    });   
  }

  componentDidMount(){
    this.getProfile(this.state.ticker);
    this.getPrice(this.state.ticker);
  }
  render() {
    return (
      <div className="App">
        <header>
          <div className={'topBar wrapper'}>
            <h1><img src={require('./logo.svg')} alt="Stockup.ninja" /></h1>
            <SearchBarAuto handlerFromParent={this.handleData} />
          </div>
          <div className={'twoColumn wrapper'}>
            <StockInfo 
              ticker={this.state.ticker}
              change={this.state.calcData.change}
              price={this.state.price}
              profile={this.state.profile}
              companyName={this.state.companyName}
              />
            <StockChart labels={this.state.selectedTimeLabel} data={this.state.selectedTimeData} handlerFromParent={this.handleTimeSelection} unit={this.state.selectedTimeUnit} max={this.state.maxTimeLength}/>
          </div>
        </header>
        <main className='wrapper'>
          <NewsFeed newsFeed={this.state.news} />
        </main>
        <footer><p className='wrapper'>Built with <FontAwesomeIcon icon={ faHeart }/> by Eugene Michasiw</p></footer>
      </div>
    )
  }
}
