import React, { Component } from 'react'

export default class Article extends Component {
  
  loadImages = () => {
    if (this.props.urlToImage) {
      return <img src={this.props.urlToImage} alt={this.props.title}></img>;
    }}
  render() {
    return (
      <div className="article">
        <a href={this.props.url}>
          {this.loadImages()}
          <h3>{this.props.title}</h3>
          <p>{this.props.description}</p>
        </a>
      </div>
    )
  }
}
