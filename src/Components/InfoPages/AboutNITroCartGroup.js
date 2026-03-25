import React from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './InfoPages.css';

function AboutNITroCart() {
  return (
    <div className="infoPage">
      <Header />
      <div className="infoPageLayout">
        <div className="contactHero">
          <h1>About NITroCart</h1>
          <p>
            NITroCart connects students and faculty at NIT Durgapur to buy, sell, or exchange used goods
            and services within the campus.
          </p>
        </div>

        <div className="infoSection">
          <h2>Our Mission</h2>
          <p>
            We aim to create a circular economy within our campus by making it simple to buy and
            sell locally. Whether you are decluttering your hostel room, upgrading your tech, or finding a
            deal on books, NITroCart is the trusted marketplace for the NITDGP community.
          </p>
        </div>

        <div className="infoSection">
          <h2>Campus Presence</h2>
          <p>
            NITroCart is exclusively designed for the NIT Durgapur campus. Our platform 
            ensures that all transactions happen within a trusted, academic environment,
            reducing the risks associated with external marketplaces.
          </p>
          <div className="infoGrid">
            <div className="infoCard">
              <h3>Community</h3>
              <p>Built specifically for NIT Durgapur students and faculty.</p>
            </div>
            <div className="infoCard">
              <h3>Security</h3>
              <p>Transactions happen within the safe confines of the campus halls and SAC.</p>
            </div>
            <div className="infoCard">
              <h3>Sustainability</h3>
              <p>Promoting reuse and recycling of items within the student body.</p>
            </div>
          </div>
        </div>

        <div className="infoSection">
          <h2>Our Core Values</h2>
          <ul>
            <li>
              <strong>Integrity:</strong> We foster a safe and honest environment for peer-to-peer trading.
            </li>
            <li>
              <strong>Efficiency:</strong> Easy to list your items in seconds and find what you need instantly.
            </li>
            <li>
              <strong>Peer-to-Peer:</strong> We empower students to help each other directly.
            </li>
            <li>
              <strong>Innovation:</strong> Continuously evolving based on student feedback to serve the campus better.
            </li>
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AboutNITroCart;
