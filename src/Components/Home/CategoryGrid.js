import React from 'react';
import { getCategoriesForHome } from '../../data/categories';
import './CategoryGrid.css';

const ICON_MAP = {
  cars: 'car',
  bikes: 'motorcycle',
  motorcycles: 'motorcycle',
  'mobile-phones': 'mobile',
  mobiles: 'mobile',
  vehicles: 'car',
  properties: 'house',
  property: 'house',
  'electronics-appliances': 'electronics',
  electronics: 'electronics',
  'commercial-vehicles-spares': 'truck',
  jobs: 'jobs',
  furniture: 'furniture',
  'home-garden': 'furniture',
  fashion: 'fashion',
  pets: 'pets',
  'books-sports-hobbies': 'books',
  services: 'tools',
  kids: 'kids',
  'tools-machinery': 'tools',
  'music-instruments': 'music',
  rent: 'house',
  commercial: 'truck',
  scooters: 'motorcycle',
  houses: 'house',
};

function CategoryGrid({ onSelectCategory }) {
  const categories = getCategoriesForHome();

  const handleClick = (name, id) => {
    if (onSelectCategory) {
      onSelectCategory(name, id);
    }
  };

  return (
    <div className="categoryGridWrapper animate-fade-in">
      <div className="categoryGridStrip">
        <div className="categoryGridScroll">
          {categories.map((cat) => (
            <button
              type="button"
              key={cat.id}
              className="categoryGridItem"
              onClick={() => handleClick(cat.name, cat.id)}
            >
              <div className="categoryGridIcon">
                <CategoryIcon iconType={ICON_MAP[cat.id] || 'house'} />
              </div>
              <span className="categoryGridName">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function CategoryIcon({ iconType }) {
  switch (iconType) {
    case 'car':
      return (
        <svg viewBox="0 0 24 24" className="catSvg">
          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
        </svg>
      );
    case 'motorcycle':
      return (
        <svg viewBox="0 0 24 24" className="catSvg">
          <path d="M19.44 9.03L15.41 5H11v2h3.59l2 2H5c-2.8 0-5 2.2-5 5s2.2 5 5 5c2.46 0 4.45-1.69 4.9-4h1.1c.45 2.31 2.44 4 4.9 4 2.8 0 5-2.2 5-5 0-1.71-.83-3.22-2.1-4.14zM5 17c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3zm10.9-4h-1.1c-.45-2.31-2.43-4-4.9-4h1.1l4.9 4zm.1 4c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z"/>
        </svg>
      );
    case 'mobile':
      return (
        <svg viewBox="0 0 24 24" className="catSvg">
          <path d="M17 1H7c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 18H7V5h10v14zM12 17c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z"/>
        </svg>
      );
    case 'house':
      return (
        <svg viewBox="0 0 24 24" className="catSvg">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
      );
    case 'furniture':
      return (
        <svg viewBox="0 0 24 24" className="catSvg">
          <path d="M4 18v3h3v-3h10v3h3v-3h1v-5H3v5h1zm15-8V4c0-1.1-.9-2-2-2H7c-1.1 0-2 .9-2 2v6c-1.1 0-2 .9-2 2v2h18v-2c0-1.1-.9-2-2-2zm-2 0H7V4h10v6z"/>
        </svg>
      );
    case 'fashion':
      return (
        <svg viewBox="0 0 24 24" className="catSvg">
          <path d="M12 3c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 6h-5V7c0-1.1-.9-2-2-2h-2c-1.1 0-2 .9-2 2v2H2c-.55 0-1 .45-1 1v1h20v-1c0-.55-.45-1-1-1zM9 21h6v-6H9v6zm-4 0h2v-6H5v6zm12-6v6h2v-6h-2z"/>
        </svg>
      );
    case 'pets':
      return (
        <svg viewBox="0 0 24 24" className="catSvg">
          <path d="M4.5 9.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm15 0c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zM12 13c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM8.5 7.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zM15.5 7.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5z"/>
        </svg>
      );
    case 'books':
      return (
        <svg viewBox="0 0 24 24" className="catSvg">
          <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-6 16.5l-3-1.5-3 1.5V4h6v14.5zM16 4v16H8V4h8z"/>
        </svg>
      );
    case 'tools':
      return (
        <svg viewBox="0 0 24 24" className="catSvg">
          <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 7 7 9 1.7 3.7C.6 6.1 1 9.1 3 11.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.4-.4.4-1.1 0-1.4z"/>
        </svg>
      );
    case 'truck':
      return (
        <svg viewBox="0 0 24 24" className="catSvg">
          <path d="M20 8l-3-4H4c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM17 9.5V11l-2-2V8h2v1.5z"/>
        </svg>
      );
    case 'electronics':
      return (
        <svg viewBox="0 0 24 24" className="catSvg">
          <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12zM8 10h8v2H8v-2zm0 4h8v2H8v-2z"/>
        </svg>
      );
    case 'jobs':
      return (
        <svg viewBox="0 0 24 24" className="catSvg">
          <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
        </svg>
      );
    case 'music':
      return (
        <svg viewBox="0 0 24 24" className="catSvg">
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
        </svg>
      );
    case 'kids':
      return (
        <svg viewBox="0 0 24 24" className="catSvg">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" className="catSvg">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
      );
  }
}

export default CategoryGrid;
