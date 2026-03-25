import React from 'react';

export default function OlxLogo({ size = 40 }) {
  const logo = `${process.env.PUBLIC_URL || ''}/assets/images/nit2.png`;
  return (
    <img
      src={logo}
      alt="Logo"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        objectFit: 'contain',
        borderRadius: '8px',
      }}
    />
  );
}
