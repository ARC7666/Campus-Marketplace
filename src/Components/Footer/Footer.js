import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const POPULAR_LOCATIONS = [
  'Hall 1',
  'Hall 2',
  'Hall 3',
  'Hall 4',
  'Hall 5',
  'Hall 7',
  'Hall 9',
];
const TRENDING_LOCATIONS = [
  'Hall 11',
  'Mother Teresa Hall',
  'Sister Nivedita Hall',
  'Pre-Sengupta Hall',
  'Sengupta Hall',
];

function Footer() {
  return (
    <div className="footerParentDiv">
      <div className="footerContent">
        <div className="footerContentInner">
          <div className="footerColumn">
            <h3 className="footerHeading">POPULAR LOCATIONS</h3>
            <ul className="footerList">
              {POPULAR_LOCATIONS.map((city) => (
                <li key={city}>
                  <Link to={`/search?location=${encodeURIComponent(city)}`}>
                    {city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="footerColumn">
            <h3 className="footerHeading">TRENDING LOCATIONS</h3>
            <ul className="footerList">
              {TRENDING_LOCATIONS.map((city) => (
                <li key={city}>
                  <Link to={`/search?location=${encodeURIComponent(city)}`}>
                    {city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="footerColumn">
            <h3 className="footerHeading">ABOUT US</h3>
            <ul className="footerList">
              <li>
                <Link to="/about">About NITroCart</Link>
              </li>
              <li>
                <Link to="/careers">Team</Link>
              </li>
              <li>
                <Link to="/contact">Contact Us</Link>
              </li>
              <li>
                <Link to="/people">NITD Community</Link>
              </li>
              <li>
                <Link to="/about">Sustainability</Link>
              </li>
            </ul>
          </div>
          <div className="footerColumn">
            <h3 className="footerHeading">NITROCART</h3>
            <ul className="footerList">
              <li>
                <Link to="/help">Help</Link>
              </li>
              <li>
                <Link to="/sitemap">Sitemap</Link>
              </li>
              <li>
                <Link to="/legal">Legal & Privacy information</Link>
              </li>
              <li>
                <Link to="/help">Blog</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footerBottom">
        <div className="footerBottomInner">
          <p>Exclusively for NIT Durgapur Students & Faculty</p>
          <p>NITroCart © 2024 NIT Durgapur</p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
