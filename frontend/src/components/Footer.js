import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p className="footer-text">
          &copy; {new Date().getFullYear()} MindLift. All rights reserved.
        </p>
        {/* You can add more links or social media icons here */}
      </div>
    </footer>
  );
}

export default Footer;