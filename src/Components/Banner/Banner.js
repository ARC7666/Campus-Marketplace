import React from 'react';
import { Link } from 'react-router-dom';
import './Banner.css';

function Banner() {
  return (
    <div className="bannerParentDiv animate-fade-in">
      <div className="bannerChildDiv">
        <div className="heroContent">
          <span className="heroTagline">Elevating Campus Life</span>
          <h1 className="heroTitle">
            Buy, Sell & Trade <br /> 
            <span>Within Your Campus</span>
          </h1>
          <p className="heroDescription">
            The ultimate marketplace for students. Find textbooks, gear, 
            tech, and more from your fellow peers.
          </p>
          <div className="heroActions">
            <Link to="/search" className="cta-primary">Explore Items</Link>
            <Link to="/create" className="cta-secondary">Start Selling</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Banner;
