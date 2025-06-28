// Components/Home.jsx
import React, { useState, useEffect, useRef } from 'react';
import Header from '../Header/Header';
import RestaurantCarousel from '../Restaurant/RestaurantCarousel'; // Ensure this import is correct
import Footer from '../Home/Footer';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'; // Add this import at the top
import ThoughtOfTheDay from '../Quote/ThoughtOfTheDay';
import HeroSection from '../Home/HeroSection';
// Main Home Component
function Home({ onSignInClick, onLoginSuccess }) {
    const [showLoginSuccessNotification, setShowLoginSuccessNotification] = useState(false);
    const [showLogoutSuccessNotification, setShowLogoutSuccessNotification] = useState(false);
    const [showRestaurants, setShowRestaurants] = useState(false); // State to control restaurant visibility
    const auth = useAuth();
    const navigate = useNavigate();
    // Ref to store the previous login state
    const prevIsLoggedInRef = useRef(auth.isLoggedIn);
    // Ref for the restaurant carousel section
    const restaurantCarouselRef = useRef(null);

    // Effect to handle login/logout state changes and update UI accordingly
    useEffect(() => {
        const prevIsLoggedIn = prevIsLoggedInRef.current;

        // If login status has changed
        if (auth.isLoggedIn !== prevIsLoggedIn) {
            if (auth.isLoggedIn) {
                // User just logged in
                setShowLoginSuccessNotification(true);
                setShowLogoutSuccessNotification(false); // Hide logout notification if logging in
                setShowRestaurants(true); // Show restaurants automatically on login
            } else {
                // User just logged out
                setShowLoginSuccessNotification(false); // Hide login notification
                setShowLogoutSuccessNotification(true); // Show logout notification
                setShowRestaurants(false); // Hide restaurants on logout
            }
        } else if (auth.isLoggedIn && !showRestaurants) {
            // If already logged in on initial load (or refresh), ensure restaurants are shown
            setShowRestaurants(true);
            setShowLogoutSuccessNotification(false); // Hide any lingering logout notification
        } else if (!auth.isLoggedIn && showRestaurants) {
            // If not logged in but restaurants are showing (e.g., after a refresh when not logged in)
            setShowRestaurants(false);
        }

        // Update the ref to the current login state for the next render
        prevIsLoggedInRef.current = auth.isLoggedIn;

    }, [auth.isLoggedIn]); // Dependencies: react to login state and carousel visibility

    // Effect to hide the success notifications after a few seconds
    useEffect(() => {
        let timer;
        if (showLoginSuccessNotification || showLogoutSuccessNotification) {
            timer = setTimeout(() => {
                setShowLoginSuccessNotification(false);
                setShowLogoutSuccessNotification(false);
            }, 3000); // Both notifications disappear after 3 seconds
        }
        return () => clearTimeout(timer); // Cleanup on component unmount or if notification hides sooner
    }, [showLoginSuccessNotification, showLogoutSuccessNotification]);

    const handleOrderNowClick = () => {
          if (auth.isLoggedIn) {
              navigate('/restaurant'); // Navigate to restaurant page if logged in
          } else {
              onSignInClick(); // Pop up login if not logged in
          }
      };

    
    return (
        <div className="min-h-screen flex flex-col font-inter">
            <Header onSignInClick={onSignInClick} />

            {/* Login Success Notification BAR */}
            {showLoginSuccessNotification && (
                <div className="login-success-notification-wrapper">
                    <div className="login-success-notification">
                        <FontAwesomeIcon icon={faCheckCircle} className="success-icon" />
                        <span>Successfully logged in</span>
                    </div>
                </div>
            )}

            {/* Logout Success Notification BAR */}
            {showLogoutSuccessNotification && (
                <div className="login-success-notification-wrapper">
                    <div className="login-success-notification logout-notification">
                        <FontAwesomeIcon icon={faSignOutAlt} className="success-icon" />
                        <span>Successfully signed out</span>
                    </div>
                </div>
            )}

            <main className="flex-grow">
                {/* Render the nested HeroSection component */}
                <HeroSection  onOrderNowClick={handleOrderNowClick}/>
                
                {/* Attach the ref to the section containing the RestaurantCarousel */}
                {/* Conditionally render RestaurantCarousel based on showRestaurants state */}
                {showRestaurants && (
                    <section ref={restaurantCarouselRef} className="restaurant-carousel-section">
                        <RestaurantCarousel />
                    </section>
                )}
            </main>
            <Footer />
            <ThoughtOfTheDay />
        </div>
    );
}

export default Home;
