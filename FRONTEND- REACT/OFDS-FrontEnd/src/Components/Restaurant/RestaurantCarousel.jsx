// Components/RestaurantCarousel.jsx
import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RestaurantCarousel.css'; // Your CSS file

// IMPORTANT: Ensure these paths are correct relative to THIS RestaurantCarousel.jsx file
// For example, if RestaurantCarousel.jsx is in src/Components, then ../../public goes to src/public
import res1 from '/kfc.jpg'; // Import your local images
import res2 from '/res2.jpg';
import res3 from '/res3.jpg';
import res4 from '/res4.jpg';
import res5 from '/res5.jpg';
import res6 from '/res6.jpg';

import { useAuth } from '../../context/AuthContext';

// Array of local image imports to cycle through
const localRestaurantImages = [res1, res2, res3, res4, res5, res6];

// RestaurantCard component - kept internal to RestaurantCarousel for simplicity
const RestaurantCard = ({ restaurant, handleViewMenu }) => (
  <div className="restaurant-card-item">
    <div className="card-image-container">
      <img
        src={restaurant.image} // Use the image path assigned from local imports
        alt={restaurant.name}
        className="restaurant-image"
        onError={(e) => { // Fallback for broken images
          e.target.onerror = null; 
          e.target.src = 'https://placehold.co/300x200/cccccc/000000?text=No+Image';
        }}
      />
      <div className="restaurant-rating">
        {restaurant.rating.toFixed(1)} <span className="star-icon">★</span>
      </div>
    </div>
    <div className="restaurant-details">
      <h3 className="restaurant-name">{restaurant.name}</h3>
      <p className="restaurant-info">{restaurant.cuisine} <span className="info-dot">•</span> {restaurant.price}</p>
      <p className="restaurant-info">{restaurant.location} <span className="info-dot">•</span> {restaurant.distance}</p>
      {/* Add restaurant-booking-info and restaurant-offers here if they were previously defined */}
      {/* Example:
      <div className="restaurant-booking-info">Some booking info</div>
      <div className="restaurant-offers">Special offers</div>
      */}
    </div>
    <div className="card-actions">
      <button className="view-menu-button" onClick={() => handleViewMenu(restaurant.id)}>
        View Menu
      </button>
    </div>
  </div>
);


function RestaurantCarousel() {
  const carouselContainerRef = useRef(null);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const auth = useAuth();
  const navigate = useNavigate();

  const API_BASE_URL = 'http://localhost:1111/restaurant';

  const fetchRestaurants = async () => {
    setLoading(true);
    setError(null);

    if (!auth.jwtToken) {
      setError("Authentication token not available. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/viewAllRestaurant`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.jwtToken}`
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Raw backend response on error:', errorText);
        let errorMessage = `HTTP error! Status: ${response.status}`;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage += ` - ${errorJson.message || errorJson.error || 'Unknown backend error'}`;
        } catch (e) {
          errorMessage += ` - ${errorText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Fetched restaurants:', data);

      const mappedRestaurants = data.map((res, index) => ({
        id: res.restaurantId,
        name: res.name,
        rating: 4.2, // Dummy rating
        cuisine: 'Multi-cuisine • Indian', // Dummy cuisine
        price: '₹800 for two', // Dummy price
        location: res.address || 'Unknown Location',
        distance: '3.0 km', // Dummy distance
        // Assign local image based on index to cycle through them
        image: localRestaurantImages[index % localRestaurantImages.length]
      }));
      setRestaurants(mappedRestaurants);
    } catch (err) {
      console.error('Error fetching restaurants:', err);
      setError(
        `Failed to load restaurants: ${err.message}. Please ensure: \n\n` +
        `1. **API Gateway and Restaurant Service are Running.** \n` +
        `2. **CORS is configured correctly** on your API Gateway for \`http://localhost:5176\` with \`allowCredentials=true\` and \`Authorization\` header allowed. \n` +
        `3. **You are logged in** with a valid JWT token. \n` +
        `4. The backend endpoint \`/restaurant/viewAllRestaurant\` is accessible and returns data.`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!auth.isLoading && auth.isLoggedIn) {
      fetchRestaurants();
    } else if (!auth.isLoading && !auth.isLoggedIn) {
        setRestaurants([]);
        setError("Please log in to view restaurants.");
        setLoading(false);
    }
  }, [auth.isLoggedIn, auth.isLoading, auth.jwtToken]);

  const handleScroll = (direction) => {
    if (carouselContainerRef.current) {
      // Adjusted scroll amount for better UX
      const scrollWidth = carouselContainerRef.current.scrollWidth;
      const clientWidth = carouselContainerRef.current.clientWidth;
      const currentScrollLeft = carouselContainerRef.current.scrollLeft;

      let newScrollLeft;
      if (direction === 'left') {
        newScrollLeft = currentScrollLeft - clientWidth / 1.5; // Scroll by about 2/3 of visible width
      } else {
        newScrollLeft = currentScrollLeft + clientWidth / 1.5;
      }

      carouselContainerRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
    }
  };

  const handleViewMenu = (restaurantId) => {
    navigate(`/restaurant/${restaurantId}/menu`);
  };

  return (
    <section className="restaurant-carousel-wrapper">
      <div className="container">
        <div className="carousel-title-section">
          <h2 className="carousel-main-title">Discover best restaurants on Dineout</h2>
          <div className="carousel-nav-buttons">
            <button
              className="carousel-nav-arrow"
              onClick={() => handleScroll('left')}
              aria-label="Scroll left"
            >
              &larr;
            </button>
            <button
              className="carousel-nav-arrow"
              onClick={() => handleScroll('right')}
              aria-label="Scroll right"
            >
              &rarr;
            </button>
          </div>
        </div>

        {loading && (
          <div className="loading-message">
            <svg className="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
            </svg>
            Loading restaurants...
          </div>
        )}

        {error && (
          <div className="error-message">
            <div className="error-icon-text">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="m15 9-6 6"></path>
                    <path d="m9 9 6 6"></path>
                </svg>
                <span className="error-heading">Error Loading Restaurants!</span>
            </div>
            <p className="error-details">{error}</p>
          </div>
        )}

        {!loading && !error && restaurants.length === 0 && auth.isLoggedIn && (
            <p className="no-restaurants-message">No restaurants found. Please check your backend data.</p>
        )}
        {!loading && !error && restaurants.length === 0 && !auth.isLoggedIn && (
            <p className="no-restaurants-message">Please log in to discover restaurants.</p>
        )}

        {!loading && !error && restaurants.length > 0 && (
          <div className="restaurant-carousel-container" ref={carouselContainerRef}>
            {restaurants.map((restaurant) => (
              <RestaurantCard
                restaurant={restaurant}
                key={restaurant.id}
                handleViewMenu={handleViewMenu}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default RestaurantCarousel;
