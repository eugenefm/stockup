import React from 'react'

export default function StockInfo(props) {
  
  const change = () => {
    if (props.change < 0) {
      return <span className="negative"> {props.change} </span>;
    } else {
      return <span className="positive"> {props.change} </span>;
    }
  }
  return (
    <div className="stockInfo">
      <div className="mainInfo">
        <div className="imageBox">
          <img srcSet={props.profile.image} alt={props.companyName} />  
        </div>
        <div>
          <h2>{props.companyName} </h2>
          <p>({props.ticker}) {props.price} {change()}</p>
        </div>
      </div>
      <div className="descriptionAndList">
        <p className="stockDescription">{props.profile.description}</p>
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
    </div>
  )
}