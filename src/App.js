import React, { Component } from 'react'
import './App.scss';
import axios from 'axios';
import StockInfo from './StockInfo';
import StockChart from './StockChart';
import SearchBarAuto from './SearchBarAuto';
import NewsFeed from './NewsFeed';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import ReactGA from 'react-ga';
import Particles from 'react-particles-js';


export default class App extends Component {
  constructor() {
    super()
    this.state={
      ticker: 'AAPL',
      profile: [],
      price: 0,
      change: 0,
      priceDetails: {},
      financialDetails: {},
      timeSeries: [],
      timeData: [],
      timeLabel: [],
      selectedTimeData: [],
      selectedTimeLabel: [],
      selectedTimeUnit: '',
      maxTimeLength: 0,
      companyName: '',
      news: [],
      apiError: false,
      search: false
    }
  }
  handleData = (data) => {
    // handle data from the search bar, save the ticker to state and call the apis
    this.setState({
    ticker: data,
    search: true
    })
    this.getProfile(data);
    this.getPriceAndSeries(data);
    this.getFinancialDetails(data);
    ReactGA.event({
      category: 'User',
      action: 'API Query'
    });
  }
  getProfile = (ticker) => {
    const url = 'https://api.unibit.ai/api/companyprofile/';

    const key = process.env.REACT_APP_UNIBIT_KEY
    //make the api call
    axios({
      method: 'GET',
      url: url + ticker,
      dataResponse: 'json',
      params: {
        AccessKey: key
      }
    }).then(response =>{
      response = response.data['company profile']

      // clean up company names 
      let companyName = response.company_name
      if(companyName.includes(' Inc')){
        companyName = companyName.substr(0,companyName.indexOf(' Inc'));
      } else if(companyName.includes(' Ltd')){
        companyName = companyName.substr(0,companyName.indexOf(' Ltd'));
      } else if(companyName.includes(' (The)')){
        companyName = companyName.substr(0,companyName.indexOf(' (The)'));
      }

      // // remove zeros from billion dollar market caps and append a B
      // let mktCap = response.mktCap 
      // if (mktCap >= 1000000000) {
      //   mktCap = (Math.round((mktCap / 1000000000) * 100) / 100) + ' B'
      // }
      
      this.getNews(companyName);
      // save profile to state
      this.setState({
        profile: response,
        companyName: companyName
      })
    }).catch(error => {
      console.log(error)
      this.setState({
        apiError: true
      })
    })
  }
  getFinancialDetails = (ticker) => {
    const url = 'https://api.unibit.ai/api/financials/summary/';

    const key = process.env.REACT_APP_UNIBIT_KEY
    //make the api call
    axios({
      method: 'GET',
      url: url + ticker,
      dataResponse: 'json',
      params: {
        AccessKey: key
      }
    }).then(response =>{
      let financialDetails = response.data['Company financials summary']
      this.setState({
        financialDetails
      })
    })
    
  }

  getPriceAndSeries = (ticker) => {
    const url = 'https://api.unibit.ai/api/realtimestock/';
    const url2 = 'https://api.worldtradingdata.com/api/v1/history';
    const uniKey = process.env.REACT_APP_UNIBIT_KEY
    const worldKey = process.env.REACT_APP_WORLD_KEY
    const date = moment().subtract(5, 'years').format("YYYY-MM-DD")
    // make the api call to get the price
    const promise1 = axios.get(url + ticker, {
      dataResponse: 'json',
      params: {
        AccessKey: uniKey,
        size: 1
      }
    })

    // make the api call to get the series
    const promise2 = axios.get(url2, {
      dataResponse: 'json',
      params: {
        symbol: ticker,
        api_token: worldKey,
        date_from: date
      }
    })

    Promise.all([promise1, promise2]).then(response =>{
      // make the api call to get the timeseries
      let priceDetails = response[0].data['Realtime Stock price'][0]
      let timeseries = Object.entries(response[1].data.history)
      let price = priceDetails.price.toFixed(2)

      let timeData = [];
      let timeLabel = [];
      timeseries.forEach((item) => {
        timeData.push(item[1].close)
        timeLabel.push(item[0])
      })
      
      let change = price - timeData[0]
      let priceDate = priceDetails.date.slice(0, 4) + '-' + priceDetails.date.slice(4, 6) + '-' + priceDetails.date.slice(6)
      if (timeLabel[0] === priceDate) {
        change = price - timeData[1]
      }
      change = change.toFixed(2)


      // profile data is inacurate so calculate additional data with the time series and price
      // this.calculateData(timeData, response2, response1)

      // set default chart length to the length of the series
      this.setChartLength(timeLabel, timeData, timeLabel.length)

      
      // save the price and series to state
      this.setState({
        priceDetails,
        timeseries,
        timeLabel,
        timeData,
        change,
        price
      })
    })
  }
  getNews = (name) => {
    const url = 'https://newsapi.org/v2/everything';
    const key = process.env.REACT_APP_NEWS_KEY
    // get business news from the api 
    axios.get(url, {
      dataResponse: 'json',
      params: {
        apiKey: key,
        sources: '"financial-post,cnbc,the-wall-street-journal,fortune,business-insider"',
        language: 'en',
        pageSize: 12,
        sortBy: 'publishedAt',
        q: name
      }
    }).then(response =>{
      response = response.data.articles
      // save the news articles in an array to state
      this.setState({
        news: response
      })
    }).catch(error => {
      console.log(error)
      this.setState({
        apiError: true
      })
    })
  }

  setChartLength = (label, data, time) => {
    const newLabel = label.slice(0,  time);
    const newData = data.slice(0, time);
    let chartUnit = 'year';
    if (time === 22) {
      chartUnit = 'day'
    } else if (time === 253) {
      chartUnit = 'month'
    }
    // save the selected chart length to state
    this.setState({
      selectedTimeData: newData,
      selectedTimeLabel: newLabel,
      selectedTimeUnit: chartUnit,
      maxTimeLength: label.length
    })
  }
  handleTimeSelection = (timeSelection) => {
    // set chart length from the time slection buttons
    this.setChartLength(this.state.timeLabel, this.state.timeData, timeSelection)
  }

  closeError = () => {
    this.setState ({
      apiError: false
    })
  }

  initializeReactGA = () => {
    ReactGA.initialize('UA-142603434-1');
    ReactGA.pageview('/');
  }

  componentDidMount(){
    this.initializeReactGA();
  }

  render() {
    return (
      <div className="App">
        <header>
          {!this.state.search && (
            <Particles
              className="particles" 
              params={{
                "particles": {
                  "number": {
                    "value": 80,
                    "density": {
                      "enable": true,
                      "value_area": 800
                    }
                  },
                  "color": {
                    "value": "#ffffff"
                  },
                  "shape": {
                    "type": "circle",
                    "stroke": {
                      "width": 0,
                      "color": "#000000"
                    },
                    "polygon": {
                      "nb_sides": 5
                    },
                  },
                  "opacity": {
                    "value": 0.2,
                    "random": false,
                    "anim": {
                      "enable": false,
                      "speed": 1,
                      "opacity_min": 0.05,
                      "sync": false
                    }
                  },
                  "size": {
                    "value": 3,
                    "random": true,
                    "anim": {
                      "enable": false,
                      "speed": 40,
                      "size_min": 0.1,
                      "sync": false
                    }
                  },
                  "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#ffffff",
                    "opacity": 0.4,
                    "width": 1
                  },
                  "move": {
                    "enable": true,
                    "speed": 2,
                    "direction": "none",
                    "random": false,
                    "straight": false,
                    "out_mode": "bounce",
                    "bounce": false,
                    "attract": {
                      "enable": false,
                      "rotateX": 600,
                      "rotateY": 1200
                    }
                  }
                },
                "interactivity": {
                  "detect_on": "canvas",
                  "events": {
                    "resize": true
                  },
                  "modes": {
                    "grab": {
                      "distance": 400,
                      "line_linked": {
                        "opacity": 1
                      }
                    },
                    "bubble": {
                      "distance": 400,
                      "size": 40,
                      "duration": 2,
                      "opacity": 8,
                      "speed": 3
                    },
                    "repulse": {
                      "distance": 200,
                      "duration": 0.4
                    },
                    "push": {
                      "particles_nb": 4
                    },
                    "remove": {
                      "particles_nb": 2
                    }
                  }
                },
                "retina_detect": true
              }} />
            )}
          <div className={'topBar wrapper'}>
            <h1><img src={require('./logo.svg')} alt="Stockup.ninja" /></h1>
            {this.state.search && <SearchBarAuto handlerFromParent={this.handleData} />}
          </div>
          {!this.state.search && (
          <div className="homeSearch">
            <h2>Search for a company by name or ticker.</h2>
            <SearchBarAuto handlerFromParent={this.handleData} />
          </div>
          )}
        {this.state.search && (
          <div className={'twoColumn wrapper'}>
            <StockInfo 
              ticker={this.state.ticker}
              change={this.state.change}
              price={this.state.price}
              profile={this.state.profile}
              financialDetails={this.state.financialDetails}
              companyName={this.state.companyName}
              />
            <StockChart labels={this.state.selectedTimeLabel} data={this.state.selectedTimeData} handlerFromParent={this.handleTimeSelection} unit={this.state.selectedTimeUnit} max={this.state.maxTimeLength}/>
          </div>
        )}  
          
        </header>
        {this.state.search && (
          <main className='wrapper'>
            <NewsFeed newsFeed={this.state.news} />
            {this.state.apiError && (<div className='error'>
              <p>An error occured getting the appropriate data for this company.</p>
              <button onClick={this.closeError}>X</button>
            </div>)}
          </main>
        )}
        {this.state.search && (
          <footer>
            <div className='wrapper footerContent'>
              <p>Built with <FontAwesomeIcon icon={ faHeart }/> by <a href="https://michasiw.com" target="_blank" rel="noopener noreferrer">Eugene Michasiw</a>.</p>
              <p>Financial data provided by <a href="https://worldtradingdata.com/" target="_blank" rel="noopener noreferrer">World Trading Data</a> and <a href="https://unibit.ai/" target="_blank" rel="noopener noreferrer">UniBit</a>. News provided by <a href="https://newsapi.org/" target="_blank" rel="noopener noreferrer">NewsAPI.org</a>. Logos provided by <a href="https://clearbit.com/" target="_blank" rel="noopener noreferrer">Clearbit</a>.</p>
            </div>
          </footer>
        )}
      </div>
    )
  }
}
