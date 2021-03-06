import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';
import axios from 'axios';
import AutosuggestHighlightMatch from 'autosuggest-highlight/match';
import AutosuggestHighlightParse from 'autosuggest-highlight/parse';

const apikey = process.env.REACT_APP_FMP_KEY;
export default class SearchBarAuto extends Component {
  constructor() {
    super();

    this.state = {
      value: '',
      suggestions: [],
      tickers: [],
      validTickers: [],
    };
  }

  getTickers = () => {
    const url = 'https://financialmodelingprep.com/api/v3/stock/list';
    //make the api call to get every available ticker sumbol
    axios
      .get(url, {
        dataResponse: 'json',
        params: {
          datatype: 'json',
          apikey,
        },
      })
      .then((response) => {
        response = response.data;
        let validTickers = response.map((ticker) => {
          return ticker.symbol;
        });
        // save full response and array of valid tickers to the component's state
        this.setState({
          tickers: response,
          validTickers: validTickers,
        });
      });
  };

  componentDidMount() {
    // make api call on load
    this.getTickers();
  }

  // react autosuggest code begins, code adapted from their custom render demo: https://codepen.io/moroshko/pen/PZWbzK

  // escape special characters
  escapeRegexCharacters = (str) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  // get suggestions
  getSuggestions = (value) => {
    const escapedValue = this.escapeRegexCharacters(value.trim());

    if (escapedValue === '') {
      return [];
    }

    const regex = new RegExp('\\b' + escapedValue, 'i');

    return this.state.tickers.filter((stock) =>
      regex.test(this.getSuggestionValue(stock))
    );
  };

  // get suggestion value
  getSuggestionValue = (suggestion) => {
    return `${suggestion.symbol} ${suggestion.name}`;
  };

  // render the list of of suggestions
  renderSuggestion = (suggestion, { query }) => {
    const suggestionText = `${suggestion.symbol} | ${suggestion.name}`;
    const matches = AutosuggestHighlightMatch(suggestionText, query);
    const parts = AutosuggestHighlightParse(suggestionText, matches);

    // render the list and apply the class of highlight to the parts that match the input
    return (
      <span className={'suggestion-content '}>
        <span className='suggestion'>
          {parts.map((part, index) => {
            const className = part.highlight ? 'highlight' : null;

            return (
              <span className={className} key={index}>
                {part.text}
              </span>
            );
          })}
        </span>
      </span>
    );
  };

  // have react handle the inout change
  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue.toUpperCase(),
    });
  };

  // store the suggestions to state
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value),
    });
  };

  // clear the state
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  // when a suggestion is slected pass the ticker to an event handler from the parent
  onSuggestionSelected = (
    event,
    { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }
  ) => {
    event.preventDefault();
    const ticker = suggestionValue.substr(0, suggestionValue.indexOf(' '));
    this.setState({
      value: ticker,
    });
    this.props.handlerFromParent(ticker);
  };

  // if the user submits a valid input instead of picking a suggestion from the list, pass the ticker to an event handler from the parent
  onSubmit = (e) => {
    e.preventDefault();
    if (this.state.validTickers.includes(this.state.value)) {
      this.props.handlerFromParent(this.state.value);
    }
  };

  render() {
    const { value, suggestions } = this.state;

    // input props set the parameters on the input
    const inputProps = {
      placeholder: 'Ticker: GOOG',
      value,
      onChange: this.onChange,
      id: 'stockSearch',
    };

    return (
      <form onSubmit={(e) => this.onSubmit(e)}>
        <label htmlFor='stockSearch' className='visuallyHidden'>
          Input stock sticker.
        </label>
        <Autosuggest
          suggestions={suggestions.slice(0, 5)}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          onSuggestionSelected={this.onSuggestionSelected}
          inputProps={inputProps}
          focusInputOnSuggestionClick={false}
        />
      </form>
    );
  }
}
