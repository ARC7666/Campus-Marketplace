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
        <div className="contactHero">
          <h1>Connect with Us</h1>
          <p>The marketplace for NIT Durgapur, by the students, for the students.</p>
        </div>

        <div className="contactGrid">
          <div className="contactFormSection">
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
                <label htmlFor="contact-subject">Inquiry Topic</label>
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

              <button type="submit" className="contactSubmitBtn">
                Send Message
              </button>
            </form>
          </div>

          <div className="contactSidebar">
            <div className="sidebarCard">
              <h3>Support Hub</h3>
              <p>For urgent help with account verification or safety reports, email our team directly.</p>
              <div className="contactDetail">
                <span className="label">Primary Support Email</span>
                <span className="value">support@campusmarketplace.in</span>
              </div>
            </div>

            <div className="sidebarCard">
              <h3>On-Campus Presence</h3>
              <p>Find our student representatives at these locations during academic hours:</p>
              <ul className="locationList">
                <li>Hall 13 — Main Admin Desk</li>
                <li>Hall 14 — Support Office</li>
                <li>Student Activity Center (SAC)</li>
              </ul>
            </div>

            <div className="sidebarCard safetyCard">
              <h3>Safety First</h3>
              <p>To ensure a safe trading environment, always meet in public campus areas like the SAC or Nescafe.</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ContactUs;
