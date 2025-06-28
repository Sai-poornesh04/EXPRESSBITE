// src/Components/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Import Link and useLocation
import pacmanWhiteLogo from '../../logos/pacman-white.png';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon
import { faUser } from '@fortawesome/free-solid-svg-icons'; // Import the user icon
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

function Header({ onSignInClick }) {
    const auth = useAuth();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const location = useLocation(); // Get the current URL path
    const navigate = useNavigate(); 
    const handleProfileClick = () => {
        setShowProfileMenu(prev => !prev);
    };

    const handleLogoutClick = () => {
        auth.logout();
        setShowProfileMenu(false);
        navigate('/'); 
        // Redirect to home after logout
    };

    // Close profile menu if clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check if the click is outside the profile section and the menu is open
            if (showProfileMenu && !event.target.closest('.profile-section')) {
                setShowProfileMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showProfileMenu]);

    // Determine the "Sign In" button text based on the current path
    const getSignInButtonText = () => {
        if (location.pathname === '/partner-with-us') {
            return 'Sign In as Partner';
        }
        return 'Sign In';
    };

    // Determine the context to pass to onSignInClick
    const getSignInContext = () => {
        if (location.pathname === '/partner-with-us') {
            return 'partner';
        }
        return null; // Default context for other pages
    };

    return (
        <header className="main-header">
            <div className="container header-content">
                <nav className="navbar">
                    <div className="navbar-left">
                        {/* Use Link component for internal navigation */}
                        <Link to="/" className="logo">
                            <img src={pacmanWhiteLogo} alt="Express bite logo" />
                            <span className='app-name'>ExpressBite</span>
                        </Link>
                    </div>
                    <div className="navbar-right">
                        <ul className="nav-links">
                            {/* Use Link components for internal navigation */}
                            <li><Link to="/about-us">About us</Link></li>
                            <li><Link to="/partner-with-us">Partner with us</Link></li>
                            <li><Link to="/how-it-works">How it works</Link></li>
                        </ul>
                        <div className="header-actions">
                            <button className="btn btn-get-app">Get the App</button>
                            {auth.isLoggedIn ? (
                                <div className="profile-section">
                                    <button className="btn btn-profile-icon" onClick={handleProfileClick}>
                                        <FontAwesomeIcon icon={faUser} /> {/* Using Font Awesome React component */}
                                    </button>
                                    {showProfileMenu && (
                                        <div className="profile-menu">
                                            <ul className="profile-menu-links">
                                                <li><Link to="/profile-settings">Profile</Link></li>
                                                {/* Conditional links based on roles */}
                                                {auth.userRole && auth.userRole.includes('ROLE_USER') && (
                                                    <>
                                                        <li><Link to="/order">My Orders</Link></li>
                                                        <li><Link to="/favourites">Favourite </Link></li>
                                                    </>
                                                )}
                                                {auth.userRole && auth.userRole.includes('ADMIN') && (
                                                    <li><Link to="/admin">Admin Dashboard</Link></li>
                                                )}
                                                {auth.userRole && auth.userRole.includes('ROLE_DELIVERY') && (
                                                    <li><Link to="/delivery-dashboard">Delivery Dashboard</Link></li>
                                                )}
                                                {auth.userRole && auth.userRole.includes('ROLE_RESTAURANT') && (
                                                    <li><Link to="/delivery-dashboard">Restaurant Dashboard</Link></li>
                                                )}

                                            </ul>
                                            <button className="btn btn-logout" onClick={handleLogoutClick}>Logout</button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                // Call onSignInClick with the determined context
                                <button className="btn btn-sign-in" onClick={() => onSignInClick(getSignInContext())}>
                                    {getSignInButtonText()} {/* Display dynamic text */}
                                </button>
                            )}
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    );
}

export default Header;
