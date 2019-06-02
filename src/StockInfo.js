import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

export default function StockInfo(props) {

  // change the class of the 'Change' dispay if it's positive or negatice
  const change = () => {
    if (props.change < 0) {
      return <span className="change negative">{props.change} <FontAwesomeIcon icon={ faChevronDown }/></span>;
    } else if (props.change > 0) {
      return <span className="change positive">{props.change} <FontAwesomeIcon icon={ faChevronUp }/></span>;
    } else {
      return <span className="change">{props.change}</span>;
    }
  }

  // render the stock info
  return (
    <div className="stockInfo">
      <div className="mainInfo">
        <div className="imageBox">
          <img srcSet={props.profile.image} alt={props.companyName} />  
        </div>
        <div>
          <h2>{props.companyName} <span>({props.ticker})</span></h2>
          <p><span className="price">Price: </span>{props.price}{change()}</p>
        </div>
      </div>
      <div className="descriptionAndList">
        <p className="stockDescription">{props.profile.description}</p>
        <ul className="infoList">
          <li>
            <span>52 Week Range</span>
            <span>{props.range}</span>
          </li>
          <li>
            <span>Beta</span>
            <span>{props.profile.beta}</span>
          </li>
          <li>
            <span>Market Cap</span>
            <span>{props.mktCap}</span>
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