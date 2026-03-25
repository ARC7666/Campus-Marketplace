import React, { useState, useContext } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { ToastContext } from '../../contextStore/ToastContext';
import './InfoPages.css';

function ContactUs() {
  const { addToast } = useContext(ToastContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addToast('Your message has been sent to the Campus Marketplace team. We will get back to you soon.', 'success');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="infoPage">
      <Header />
      <div className="infoPageLayout">
        <div className="infoHero contactHero">
          <h1>Connect with Campus Marketplace</h1>
          <p>Have questions about trading on campus? Our dedicated team is here to ensure a seamless and secure experience for buying and selling within NIT Durgapur.</p>
        </div>

        <div className="contactGrid">
          <div className="infoSection contactFormSection">
            <h2>Send us a Message</h2>
            <form className="infoForm" onSubmit={handleSubmit}>
              <div className="formRow">
                <div className="formGroup">
                  <label htmlFor="contact-name">Full Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your name"
                  />
                </div>
                <div className="formGroup">
                  <label htmlFor="contact-email">Institutional Email</label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="username@nitdgp.ac.in"
                  />
                </div>
              </div>

              <div className="formGroup">
                <label htmlFor="contact-subject">Topic</label>
                <select
                  id="contact-subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a topic</option>
                  <option value="general">General Inquiries</option>
                  <option value="listing">Listing & Ads Support</option>
                  <option value="safety">Safety & Reporting</option>
                  <option value="technical">Technical Issues</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="formGroup">
                <label htmlFor="contact-message">How can we help?</label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Describe your issue or feedback in detail..."
                />
              </div>

              <button type="submit" className="infoBtn contactSubmitBtn">
                Send Message
              </button>
            </form>
          </div>

          <div className="contactSidebar">
            <div className="infoSection sidebarCard">
              <h3>Support Hub</h3>
              <p>For immediate assistance with account verification or safety reports, please visit the Help Centre.</p>
              <div className="contactDetail">
                <span className="label">Email</span>
                <span className="value">support@campusmarketplace.in</span>
              </div>
            </div>

            <div className="infoSection sidebarCard">
              <h3>Campus Presence</h3>
              <p>Our student moderators are available across various halls for direct assistance.</p>
              <ul className="locationList">
                <li>Hall 13 - Main Desk</li>
                <li>Hall 14 - Support Office</li>
                <li>Student Activity Center</li>
              </ul>
            </div>

            <div className="infoSection sidebarCard safetyCard">
              <h3>Safety First</h3>
              <p>Always meet in public campus areas like the SAC or Nescafe for transactions.</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ContactUs;
