import React, { Component } from 'react'

export default class SearchBar extends Component {
  constructor() {
      super();
      this.state = {
          search: ''
      };
  }

  handleChange = (e) => {
      this.setState({
          search: e.target.value
      })
  }

  onSubmit = (e) => {
    e.preventDefault();
    this.props.handlerFromParant(this.state.search);
  }

  render() {
      return (
          <div>
          <form>
              <label>
                  Ticker:
                  <input
                      name='search'
                      value={this.state.search}
                      onChange={e => this.handleChange(e)}/>
              </label>
              <button onClick={(e) => this.onSubmit(e)}>Search</button>         
          </form>
          </div>
      );
  }
}