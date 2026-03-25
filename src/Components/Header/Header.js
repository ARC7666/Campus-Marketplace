import React, { useContext, useState } from 'react';
import { useHistory, useLocation, Link } from 'react-router-dom';
import './Header.css';
import OlxLogo from '../../assets/OlxLogo';
import SearchIcon from '../../assets/SearchIcon';
import SellButtonPlus from '../../assets/SellButtonPlus';
import { AuthContext } from '../../contextStore/AuthContext';
import { useSearchFilter } from '../../hooks/useSearchFilter';
import NotificationBell from '../Notifications/NotificationBell';
import LocationDropdown from './LocationDropdown';
import UserDropdown from './UserDropdown';
import MobileMenu from './MobileMenu';

function Header() {
  const history = useHistory();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const loginState = { from: { pathname: location.pathname } };
  const {
    filteredData,
    wordEntered,
    isOpen,
    wrapperRef,
    handleFilter,
    closeDropdown,
    handleSelectedSearch,
    handleKeyDown,
  } = useSearchFilter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = () => {
    if (wordEntered.trim()) {
      history.push(`/search?q=${encodeURIComponent(wordEntered.trim())}`);
    } else {
      history.push('/search');
    }
    closeDropdown();
  };

  const handleEmptyClick = () => {
    history.push('/search');
  };

  return (
    <div className="headerParentDiv">
      {/* Top Utility Bar - Mirroring nitdgp.ac.in */}
      <div className="headerTopBar">
        <div className="headerTopContent">
          <div className="headerTopLinks">
            <Link to="/"><i className="fas fa-home"></i> Home</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div className="headerTopPortal">
            <span className="portalText">NIT Durgapur Student Marketplace</span>
          </div>
        </div>
      </div>
      
      <div className="headerChildDiv">
        <button
          type="button"
          className="headerHamburger d-md-none"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          <span />
          <span />
          <span />
        </button>
        <Link
          to="/"
          className="brandName"
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <OlxLogo size={42} src={`${process.env.PUBLIC_URL || ''}/assets/images/nit1.png`} />
          <div className="brandTextContainer">
            <h2 className="brandMain">NITroCart</h2>
            <span className="brandSub">NIT DURGAPUR MARKETPLACE</span>
          </div>
        </Link>
        <div className="headerLocationWrap d-none d-lg-flex">
          <LocationDropdown />
        </div>
        <div className="headerSearchWrap d-none d-md-block" ref={wrapperRef}>
          <div className="headerSearchInner">
            <input
              type="text"
              placeholder="Search for books, electronics, more..."
              value={wordEntered}
              onChange={handleFilter}
              onKeyDown={(e) => {
                handleKeyDown(e);
                if (e.key === 'Enter') handleSearchSubmit();
              }}
            />
            <button
              type="button"
              className="headerSearchBtn"
              onClick={
                wordEntered.trim() ? handleSearchSubmit : handleEmptyClick
              }
              aria-label="Search"
            >
              <SearchIcon />
            </button>
          </div>
          {isOpen && filteredData.length > 0 && (
            <div className="dataResult-header glass">
              {filteredData.slice(0, 15).map((value, key) => (
                <div
                  key={value.id || key}
                  className="dataItem-header"
                  role="button"
                  tabIndex={0}
                  onClick={() => handleSelectedSearch(value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSelectedSearch(value);
                    }
                  }}
                >
                  <p>{value.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="headerRight">
          {user ? (
            <div className="d-flex align-items-center gap-3">
              <NotificationBell />
              <UserDropdown />
            </div>
          ) : (
            <Link
              to={{ pathname: '/login', state: loginState }}
              className="headerLoginLink"
            >
              Log in
            </Link>
          )}
          <Link to="/create" className="headerSellLink d-none d-sm-block">
            <div className="sellMenu">
              <SellButtonPlus />
              <span>Sell Item</span>
            </div>
          </Link>
        </div>
      </div>
      <MobileMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </div>
  );
}

export default Header;
