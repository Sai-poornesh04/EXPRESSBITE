// Components/HeroSection.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext'; // Make sure this path is correct relative to HeroSection.jsx

// IMPORTANT: Ensure these paths are correct relative to THIS HeroSection.jsx file
import Biriyani from '../../Food items/Biriyani.avif';
import food2 from '../../Food items/2.png';
import food1 from '../../Food items/food1.png';
import dosa1 from '../../Food items/dosa1.png';

function HeroSection({ onOrderNowClick }) { // Receive the click handler as a prop
  const auth = useAuth(); // Access the authentication context
  
    // Handler for the "Order Now" button click (defined in Home, called from HeroSection)
    
  const images = [
    Biriyani,
    food2,
    food1,
    dosa1,
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeImageClass, setActiveImageClass] = useState('');

  useEffect(() => {
    setActiveImageClass('active');

    const intervalId = setInterval(() => {
      setActiveImageClass('');

      const fadeOutTimeout = setTimeout(() => {
        setCurrentImageIndex(prevIndex =>
          (prevIndex + 1) % images.length
        );
        setActiveImageClass('active');
      }, 1000); // This delay should match your CSS transition for opacity (1s)

      return () => clearTimeout(fadeOutTimeout);

    }, 4500); // Total interval: 1000ms (fade-out) + 50ms (React render/browser reflow) + 3450ms (display) = ~4.5 seconds

    return () => clearInterval(intervalId);
  }, [images.length]);

  // Derive user display name from email
  const userDisplayName = auth.userEmail ? auth.userEmail.split('@')[0] : '';
  const capitalizedDisplayName = userDisplayName ? userDisplayName.charAt(0).toUpperCase() + userDisplayName.slice(1) : '';


  return (
    <section className="hero-section">
      <div className="container hero-grid">
        <div className="hero-content">
          {auth.isLoggedIn && ( // Conditionally render welcome message if logged in
            <p className="welcome-message">Welcome, <span className="highlight">{capitalizedDisplayName}</span>!</p>
          )}
          <h1 className="hero-headline">Craving something delicious?<span className="highlight">We Deliver!</span></h1>
          <p className="sub-headline">Order from your Favorite restaurants and get your food delivered straight to your doorstep.</p>
            <div>
              {/* Call the prop function on button click */}
              <button className="btn btn-secondary-solid" onClick={onOrderNowClick}>ORDER NOW</button>
          </div>
          <p className="popular-search-text">Popular: Pizza, Biriyani, Burgers, Sushi, etc.. </p>
        </div>
        <div className="hero-img" id="hero-image-carousel">
          <img
            src={images[currentImageIndex]}
            alt="Delicious Food Item"
            className={`biryani-image ${activeImageClass}`}
          />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
