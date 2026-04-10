import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AuthContext } from '../../contextStore/AuthContext';
import './MobileBottomNav.css';

const HomeIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M3 10.5L12 3L21 10.5V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V10.5Z"
      stroke="currentColor"
      strokeWidth={active ? "2.2" : "1.8"}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={active ? "currentColor" : "none"}
    />
    <path
      d="M9 22V12H15V22"
      stroke={active ? "#fff" : "currentColor"}
      strokeWidth={active ? "2.2" : "1.8"}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SearchIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle
      cx="11"
      cy="11"
      r="7"
      stroke="currentColor"
      strokeWidth={active ? "2.2" : "1.8"}
      fill={active ? "currentColor" : "none"}
    />
    {active && (
      <circle cx="11" cy="11" r="4" fill="#fff" />
    )}
    <path
      d="M16.5 16.5L21 21"
      stroke="currentColor"
      strokeWidth={active ? "2.2" : "1.8"}
      strokeLinecap="round"
    />
  </svg>
);

const SellIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="14" cy="14" r="13" fill="#002f34" stroke="#002f34" strokeWidth="1.5" />
    <path
      d="M14 8V20M8 14H20"
      stroke="#fff"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
  </svg>
);

const NotifIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M18 8A6 6 0 1 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
      stroke="currentColor"
      strokeWidth={active ? "2.2" : "1.8"}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={active ? "currentColor" : "none"}
    />
    <path
      d="M13.73 21a2 2 0 0 1-3.46 0"
      stroke={active ? "#fff" : "currentColor"}
      strokeWidth={active ? "2.2" : "1.8"}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ProfileIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle
      cx="12"
      cy="8"
      r="4"
      stroke="currentColor"
      strokeWidth={active ? "2.2" : "1.8"}
      fill={active ? "currentColor" : "none"}
    />
    <path
      d="M4 21C4 17.134 7.58172 14 12 14C16.4183 14 20 17.134 20 21"
      stroke="currentColor"
      strokeWidth={active ? "2.2" : "1.8"}
      strokeLinecap="round"
      fill={active ? "currentColor" : "none"}
    />
  </svg>
);

const iconPropTypes = { active: PropTypes.bool };

HomeIcon.propTypes = iconPropTypes;
SearchIcon.propTypes = iconPropTypes;
NotifIcon.propTypes = iconPropTypes;
ProfileIcon.propTypes = iconPropTypes;

function MobileBottomNav() {
  const { user } = React.useContext(AuthContext);
  const location = useLocation();
  const path = location.pathname;

  const isActive = (route) => {
    if (route === '/') return path === '/';
    return path.startsWith(route);
  };

  return (
    <nav className="mobileBottomNav" aria-label="Mobile navigation">
      <Link to="/" className={`mobileBottomNavItem ${isActive('/') ? 'active' : ''}`} aria-label="Home">
        <span className="mobileBottomNavIcon">
          <HomeIcon active={isActive('/')} />
        </span>
        <span className="mobileBottomNavLabel">Home</span>
      </Link>
      <Link to="/search" className={`mobileBottomNavItem ${isActive('/search') ? 'active' : ''}`} aria-label="Search">
        <span className="mobileBottomNavIcon">
          <SearchIcon active={isActive('/search')} />
        </span>
        <span className="mobileBottomNavLabel">Search</span>
      </Link>
      <Link
        to="/create"
        className="mobileBottomNavItem mobileBottomNavSell"
        aria-label="Sell"
      >
        <span className="mobileBottomNavIcon mobileBottomNavSellIcon">
          <SellIcon />
        </span>
        <span className="mobileBottomNavLabel">Sell</span>
      </Link>
      <Link to="/notifications" className={`mobileBottomNavItem ${isActive('/notifications') ? 'active' : ''}`} aria-label="Notifications">
        <span className="mobileBottomNavIcon">
          <NotifIcon active={isActive('/notifications')} />
        </span>
        <span className="mobileBottomNavLabel">Alerts</span>
      </Link>
      {user ? (
        <Link
          to="/profile/edit"
          className={`mobileBottomNavItem ${isActive('/profile') ? 'active' : ''}`}
          aria-label="Profile"
        >
          <span className="mobileBottomNavIcon">
            <ProfileIcon active={isActive('/profile')} />
          </span>
          <span className="mobileBottomNavLabel">Profile</span>
        </Link>
      ) : (
        <Link to="/login" className={`mobileBottomNavItem ${isActive('/login') ? 'active' : ''}`} aria-label="Login">
          <span className="mobileBottomNavIcon">
            <ProfileIcon active={isActive('/login')} />
          </span>
          <span className="mobileBottomNavLabel">Account</span>
        </Link>
      )}
    </nav>
  );
}

export default MobileBottomNav;
