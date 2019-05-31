import React, { Component } from 'react'
import Article from './Article'

export default class NewsFeed extends Component {
  render() {
    let error = '';
    if (!this.props.newsFeed.length) {
      error = <p>No articles available at this time.</p>
    }
    return (
      <div className="newsFeed">
        <h2>Recent News</h2>
        {this.props.newsFeed.map((article, index) =>{
          return (
            <Article 
              key={index}
              title={article.title}
              url={article.url}
              urlToImage={article.urlToImage}
              source={article.source.name}
              description={article.description} />
              
        )})}
        {error}
      </div>
    )
  }
}
