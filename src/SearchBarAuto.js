import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';
import axios from 'axios';
import AutosuggestHighlightMatch from 'autosuggest-highlight/match';
import AutosuggestHighlightParse from 'autosuggest-highlight/parse';

// const people = [
//   {
//     first: 'Charlie',
//     last: 'Brown',
//     twitter: 'dancounsell'
//   },
//   {
//     first: 'Charlotte',
//     last: 'White',
//     twitter: 'mtnmissy'
//   },
//   {
//     first: 'Chloe',
//     last: 'Jones',
//     twitter: 'ladylexy'
//   },
//   {
//     first: 'Cooper',
//     last: 'King',
//     twitter: 'steveodom'
//   }
// ];

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters


export default class SearchBarAuto extends Component {
  constructor() {
    super();

    this.state = {
      value: '',
      suggestions: [],
      tickers: [],
      validTickers: []
    };    
  }

  getTickers = () => {
    const url = 'https://financialmodelingprep.com/api/stock/list/all?datatype=json';
    //make the api call to the museum
    axios({
      method: 'GET',
      url: url,
      dataResponse: 'json'
    }).then(response =>{
      response = response.data
      // console.log(response)
      let validTickers = response.map((ticker) => {
        return ticker.Ticker;
      });

      this.setState({
        tickers: response,
        validTickers: validTickers
      })
    })
  }

  componentDidMount(){
    this.getTickers();
  }

  escapeRegexCharacters = (str) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  
  getSuggestions = (value) => {
    const escapedValue = this.escapeRegexCharacters(value.trim());
    
    if (escapedValue === '') {
      return [];
    }
  
    const regex = new RegExp('\\b' + escapedValue, 'i');
    
    return this.state.tickers.filter(stock => regex.test(this.getSuggestionValue(stock)));
  }
  
  getSuggestionValue = (suggestion) => {
    return `${suggestion.Ticker} ${suggestion.companyName}`;
  }
  
  renderSuggestion = (suggestion, { query }) => {
    const suggestionText = `${suggestion.Ticker} | ${suggestion.companyName}`;
    const matches = AutosuggestHighlightMatch(suggestionText, query);
    const parts = AutosuggestHighlightParse(suggestionText, matches);
  
    return (
      <span className={'suggestion-content '}>
        <span className="suggestion">
          {
            parts.map((part, index) => {
              const className = part.highlight ? 'highlight' : null;
  
              return (
                <span className={className} key={index}>{part.text}</span>
              );
            })
          }
        </span>
      </span>
    );
  }

  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue.toUpperCase()
    });
  };
  
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  onSuggestionSelected = (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) =>{
    event.preventDefault();
    const ticker = suggestionValue.substr(0,suggestionValue.indexOf(' '));
    this.setState({
      value: ticker,
    })
    this.props.handlerFromParant(ticker);
    
  };
  onSubmit = (e) => {
    e.preventDefault();
    if(this.state.validTickers.includes(this.state.value)) {
      this.props.handlerFromParant(this.state.value);
    }
    
  }

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: "Ticker: GOOG",
      value,
      onChange: this.onChange
    };

    return (
      <form onSubmit={(e) => this.onSubmit(e)}>
        <Autosuggest 
          suggestions={suggestions.slice(0, 5)}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          onSuggestionSelected={this.onSuggestionSelected}
          inputProps={inputProps} />
      </form>
    );
  }
}


// // const languages = [
// //   {
// //     name: 'C',
// //     year: 1972
// //   },
// //   {
// //     name: 'Elm',
// //     year: 2012
// //   }
// // ];

// // Teach Autosuggest how to calculate suggestions for any given input value.
// // const getSuggestions = value => {
// //   const inputValue = value.trim().toLowerCase();
// //   const inputLength = inputValue.length;

// //   return inputLength === 0 ? [] : languages.filter(lang =>
// //     lang.name.toLowerCase().slice(0, inputLength) === inputValue
// //   );
// // };

// // // When suggestion is clicked, Autosuggest needs to populate the input
// // // based on the clicked suggestion. Teach Autosuggest how to calculate the
// // // input value for every given suggestion.
// // const getSuggestionValue = suggestion => suggestion.name;

// // // Use your imagination to render suggestions.
// // const renderSuggestion = suggestion => (
// //   <div>
// //     {suggestion.name}
// //   </div>
// // );

// export default class Example extends Component {
//   constructor() {
//     super();

//     // Autosuggest is a controlled component.
//     // This means that you need to provide an input value
//     // and an onChange handler that updates this value (see below).
//     // Suggestions also need to be provided to the Autosuggest,
//     // and they are initially empty because the Autosuggest is closed.
//     this.state = {
//       value: '',
//       suggestions: [],
//       tickers: []
//     };
//   }
//   getTickers = () => {
//     const url = 'https://financialmodelingprep.com/api/stock/list/all?datatype=json';
//     //make the api call to the museum
//     axios({
//       method: 'GET',
//       url: url,
//       dataResponse: 'json'
//     }).then(response =>{
//       response = response.data
//       console.log(response)

//       this.setState({
//         tickers: response
//       })
//     })
//   }

//   getSuggestions = value => {
//     const inputValue = value.trim().toUpperCase();
//     const inputLength = inputValue.length;
//     const tickers = this.state.tickers;
  
//     return inputLength === 0 ? [] : tickers.filter(arr =>
//       arr.Ticker.toUpperCase().slice(0, inputLength) === inputValue
//     );
//   };
  
//   // When suggestion is clicked, Autosuggest needs to populate the input
//   // based on the clicked suggestion. Teach Autosuggest how to calculate the
//   // input value for every given suggestion.
//   getSuggestionValue = suggestion => suggestion.Ticker;
  
//   // Use your imagination to render suggestions.
//   renderSuggestion = suggestion => (
//     <div>
//       {suggestion.Ticker}
//       {suggestion.companyName}
//     </div>
//   );

//   onChange = (event, { newValue }) => {
//     this.setState({
//       value: newValue.toUpperCase()
//     });
//   };

//   // Autosuggest will call this function every time you need to update suggestions.
//   // You already implemented this logic above, so just use it.
//   onSuggestionsFetchRequested = ({ value }) => {
//     this.setState({
//       suggestions: this.getSuggestions(value)
//     });
//   };

//   // Autosuggest will call this function every time you need to clear suggestions.
//   onSuggestionsClearRequested = () => {
//     this.setState({
//       suggestions: []
//     });
//   };
//   componentDidMount(){
//     this.getTickers();
//   }

//   render() {
//     const { value, suggestions } = this.state;

//     // Autosuggest will pass through all these props to the input.
//     const inputProps = {
//       placeholder: 'Type a programming language',
//       value,
//       onChange: this.onChange
//     };

//     // Finally, render it!
//     return (
//       <Autosuggest
//         suggestions={suggestions.slice(0, 5)}
//         onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
//         onSuggestionsClearRequested={this.onSuggestionsClearRequested}
//         getSuggestionValue={this.getSuggestionValue}
//         renderSuggestion={this.renderSuggestion}
//         inputProps={inputProps}
//       />
//     );
//   }
// }