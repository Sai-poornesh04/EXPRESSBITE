// Components/Footer.jsx
import React from 'react';
// Restored original local image imports
import pacmanWhiteLogo from '../../logos/pacman-white.png';
import appStoreBadge from '../../logos/app-store-badge.svg';
import googlePlayBadge from '../../logos/google-play-badge.svg';

function Footer() {
    return (
        <footer className="main-footer">
            <div className="container footer-grid">
                <div className="footer-brand">
                    <a href="#" className="logo footer-logo">
                        <img src={pacmanWhiteLogo} alt="Express bite logo" />
                        <span>ExpressBite</span>
                    </a>
                </div>
                <div className="footer-column">
                    <h3>About ExpressBite</h3>
                    <ul>
                        <li><a href="#">Who We Are</a></li>
                        <li><a href="#">Blog</a></li>
                        <li><a href="#">Careers</a></li>
                        <li><a href="#">Investor Relations</a></li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h3>For Restaurants</h3>
                    <ul>
                        <li><a href="#">Partner With Us</a></li>
                        <li><a href="#">Our Network</a></li>
                        <li><a href="#">Business Tools</a></li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h3>For Delivery Partners</h3>
                    <ul>
                        <li><a href="#">Become a Rider</a></li>
                        <li><a href="#">Deliver with Us</a></li>
                        <li><a href="#">Rider Benefits</a></li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h3>Learn More</h3>
                    <ul>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Security</a></li>
                        <li><a href="#">Terms & Conditions</a></li>
                        <li><a href="#">Help & Support</a></li>
                        <li><a href="#">Report a Fraud</a></li>
                    </ul>
                </div>
                <div className="footer-column">
                    <div className="app-buttons">
                        <a href="#" aria-label="Download on App Store">
                            <img src={appStoreBadge} alt="App Store" className="app-badge" />
                        </a>
                        <a href="#" aria-label="Get it on Google Play">
                            <img src={googlePlayBadge} alt="Google Play" className="app-badge" />
                        </a>
                    </div>
                </div>
            </div>
            <div className="container footer-bottom">
                <p>By continuing past this page, you agree to our Terms of Service, Cookie Policy, Privacy Policy and Content Policies. All trademarks are properties of their respective owners.</p>
                <p>&copy; 2023 ExpressBite. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
