import React from 'react'

export default function StockInfo(props) {
  return (
    <div className="stockInfo">
      <div className="mainInfo">
        <div className="imageBox">
          <img srcSet={props.profile.image} alt={props.profile.companyName} />  
        </div>
        <div>
          <h2>{props.ticker}</h2>
          <p>{props.price}</p>
        </div>
      </div>
      <p>{props.profile.description}</p>
      <ul className="infoList">
        <li>
          <span>52 Week Range</span>
          <span>{props.profile.range}</span>
        </li>
        <li>
          <span>Beta</span>
          <span>{props.profile.beta}</span>
        </li>
        <li>
          <span>Market Cap</span>
          <span>{props.profile.mktCap}</span>
        </li>
        <li>
          <span>Exchange</span>
          <span>{props.profile.exchange}</span>
        </li>
        <li>
          <span>Sector</span>
          <span>{props.profile.sector}</span>
        </li>
        <li>
          <span>Industry</span>
          <span>{props.profile.industry}</span>
        </li>
      </ul>
    </div>
  )
}