import React, { Component } from 'react'
import Article from './Article'
import moment from 'moment'

export default class NewsFeed extends Component {
  render() {
    // show a message if no articles are available
    let error = '';
    if (!this.props.newsFeed.length) {
      error = <p>No articles available at this time.</p>
    }
    return (
      <div className="newsFeed">
        <h2>Relevant News</h2>
        {/* map through an array of articles to display them on the newsfeed */}
        {this.props.newsFeed.map((article, index) =>{
          return (
            <Article 
              key={index}
              title={article.title}
              url={article.url}
              urlToImage={article.urlToImage}
              date={moment(article.publishedAt).format("MMM D, YYYY |")}
              source={article.source.name}
              description={article.description} />
              
        )})}
        {error}
      </div>
    )
  }
}
