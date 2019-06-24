import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

export default function StockInfo(props) {

  // change the class of the 'Change' dispay if it's positive or negatice
  const change = () => {
    if (props.change < 0) {
      return <span className="change negative">{props.change} <FontAwesomeIcon icon={ faChevronDown }/></span>;
    } else if (props.change >= 0) {
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
          <img src={`//logo.clearbit.com/${props.profile.website}`} onError={(e)=>{e.target.onerror = null; e.target.src="./logoFallback.png"}} alt={props.companyName} />  
        </div>
        <div>
          <h2>{props.companyName} <span>({props.ticker})</span></h2>
          <p><span className="price"><span className="current">{props.price}</span>{change()}</span></p>
        </div>
      </div>
      <div className="descriptionAndList">
        <p className="stockDescription">{props.profile.company_description && props.profile.company_description.length > 300 ? props.profile.company_description.slice(0, 300) + '...' : props.profile.company_description} <a href={props.profile.website} target="_blank" rel="noopener noreferrer">Learn&nbsp;More</a></p>
        <ul className="infoList">
          <li>
            <span>52 Week Range</span>
            <span>{props.financialDetails.week_52_range}</span>
          </li>
          <li>
            <span>Beta</span>
            <span>{props.financialDetails.beta}</span>
          </li>
          <li>
            <span>Market Cap</span>
            <span>{props.financialDetails.market_cap}</span>
          </li>
          <li>
            <span>PE</span>
            <span>{props.financialDetails.pe_ratio}</span>
          </li>
          <li>
            <span>EPS</span>
            <span>{props.financialDetails.eps}</span>
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