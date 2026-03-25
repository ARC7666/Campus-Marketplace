import React from 'react';
import './goloading.css';

function GoLoading() {
  const logo = `${process.env.PUBLIC_URL || ''}/assets/images/nit2.png`;
  return (
    <div className="apple-loader-container">
      <img
        src={logo}
        alt="Logo"
        style={{
          width: '60px',
          height: '60px',
          marginBottom: '20px',
          borderRadius: '12px',
        }}
      />
      <div className="apple-loader-bar">
        <div className="apple-loader-progress"></div>
      </div>
      <span className="apple-loader-text">Loading</span>
    </div>
  );
}

export default GoLoading;
