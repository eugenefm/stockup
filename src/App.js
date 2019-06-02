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
      mktCap: '',
      range: '',
      news: [],
      calcData: {}
    }
  }
  handleData = (data) => {
    // handle data from the search bar, save the ticker to state and call the apis
    this.setState({
    ticker: data
    })
    this.getProfile(data);
    this.getPriceAndSeries(data);
  }
  getProfile = (ticker) => {
    const url = 'https://financialmodelingprep.com/api/v3/company/profile/';
    //make the api call
    axios({
      method: 'GET',
      url: url + ticker,
      dataResponse: 'json'
    }).then(response =>{
      response = response.data.profile
      
      // clean up company names 
      let companyName = response.companyName
      if(companyName.includes(' Inc')){
        companyName = companyName.substr(0,companyName.indexOf(' Inc'));
      } else if(companyName.includes(' Ltd')){
        companyName = companyName.substr(0,companyName.indexOf(' Ltd'));
      } else if(companyName.includes(' (The)')){
        companyName = companyName.substr(0,companyName.indexOf(' (The)'));
      }

      // remove zeros from billion dollar market caps and append a B
      let mktCap = response.mktCap 
      if (mktCap >= 1000000000) {
        mktCap = (Math.round((mktCap / 1000000000) * 100) / 100) + ' B'
      }
      
      this.getNews(companyName);
      // save profile to state
      this.setState({
        profile: response,
        companyName: companyName,
        mktCap: mktCap
      })
    })
  }
  getPriceAndSeries = (ticker) => {
    const url = 'https://financialmodelingprep.com/api/company/real-time-price/';
    const url2 = 'https://financialmodelingprep.com/api/v3/historical-price-full/';

    // make the api call to get the price
    const promise1 = axios.get(url + ticker, {
      dataResponse: 'json',
      params: {
        datatype: 'json'
      }
    })

    const promise2 = axios.get(url2 + ticker, {
      dataResponse: 'json'
    })

    Promise.all([promise1, promise2]).then(response =>{
      // make the api call to get the timeseries
      let response1 = response[0].data.price
      let response2 = response[1].data.historical
      let timeData = [];
      let timeLabel = [];
      response2.forEach((item) => {
        timeData.push(item.close)
        timeLabel.push(item.date)
      })

      // calculate additional data with the time series
      this.calculateData(timeData, response2, response1)
      this.setChartLength(timeLabel, timeData, timeLabel.length)

      
      // save the price in to state
      this.setState({
        price: response1,
        timeSeries: response,
        timeLabel: timeLabel,
        timeData: timeData
      })
    })
  }
  getNews = (name) => {
    const url = 'https://newsapi.org/v2/everything';
    //make the api call
    axios.get(url, {
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
      // save the news to state
      this.setState({
        news: response
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

  calculateData = (data, series, price) => {

    // change provided by the api is wrong so calculate our own with last closing price and current price
    let lastIndex = data.length;
    let previousClose = series[(lastIndex - 2)].close;
    let change = (price - previousClose).toFixed(2);


    // range provided by the api is out of date so calculate our own
    let yearData = data.slice((data.length - 253));
    let yearMax = Math.max(...yearData);
    let yearMin = Math.min(...yearData);

    this.setState({
      calcData: {
        change: change,
        range: yearMin + " - " + yearMax
      }
    });   
  }

  componentDidMount(){
    this.getProfile(this.state.ticker);
    this.getPriceAndSeries(this.state.ticker);
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
              range={this.state.calcData.range}
              mktCap={this.state.mktCap}
              companyName={this.state.companyName}
              />
            <StockChart labels={this.state.selectedTimeLabel} data={this.state.selectedTimeData} handlerFromParent={this.handleTimeSelection} unit={this.state.selectedTimeUnit} max={this.state.maxTimeLength}/>
          </div>
        </header>
        <main className='wrapper'>
          <NewsFeed newsFeed={this.state.news} />
        </main>
        <footer>
          <div className='wrapper footerContent'>
            <p>Built with <FontAwesomeIcon icon={ faHeart }/> by <a href="https://michasiw.com">Eugene Michasiw</a>.</p>
            <p>Financial data provided <a href="https://financialmodelingprep.com/">Financial Modeling Prep</a>. News provided by <a href="https://newsapi.org/">News API</a>.</p>
          </div>
        </footer>
          
      </div>
    )
  }
}
