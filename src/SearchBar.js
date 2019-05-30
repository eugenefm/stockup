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
          search: (e.target.value).toUpperCase()
      })
  }

  onSubmit = (e) => {
    e.preventDefault();
    this.props.handlerFromParant(this.state.search);
  }

  render() {
      return (
          <div>
          <form onSubmit={(e) => this.onSubmit(e)}>
              <label>
                  <input
                      name='search'
                      value={this.state.search}
                      onChange={e => this.handleChange(e)}
                      placeholder='GOOG'
                      autoComplete='off'/>
              </label>
              {/* <button onClick={(e) => this.onSubmit(e)}>Search</button>          */}
          </form>
          </div>
      );
  }
}