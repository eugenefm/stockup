import React, { Component } from 'react'

export default class Article extends Component {
  // loads an image if its available
  loadImages = () => {
    if (this.props.urlToImage) {

      // if the image is an http, rewrite the url as https to prevent mixed content errors.
      let urlToImage = this.props.urlToImage;
      let newUrlToImage = urlToImage;
      if (urlToImage.includes('http:')) {
      newUrlToImage = newUrlToImage.slice(0, 4) + "s" + newUrlToImage.slice(4);
      }
      return (
        <div className="previewImage">
          <img src={newUrlToImage} alt={this.props.title} />
        </div>
      );
    }}
  render() {
    return (
      <div className="article">
        <a href={this.props.url}>
          {this.loadImages()}
        </a>
        <p className="articleSource">{this.props.source} <span className="articleDate">{this.props.date}</span> </p>
        <a href={this.props.url}>
          <h3>{this.props.title}</h3>
        </a> 
        <p>{this.props.description}</p>
        <a className="readMore"href={this.props.url}>Read More</a> 
      </div>
    )
  }
}
