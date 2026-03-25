import React from 'react';

export default function NITroCartLogo({ size = 40, src }) {
  const logo = src || `${process.env.PUBLIC_URL || ''}/assets/images/nit2.png`;
  return (
    <img
      src={logo}
      alt="Logo"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        objectFit: 'contain',
        borderRadius: '4px',
      }}
    />
  );
}
