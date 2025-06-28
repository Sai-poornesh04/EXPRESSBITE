import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../Header/Header'; // Assuming Header is in the same directory
import './MenuPage.css';
import '../Cart/Cart.css';
import Cart from '../Cart/Cart';

const MenuPage = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const { jwtToken, isLoggedIn, isLoading } = useAuth(); // Corrected: use jwtToken, isLoggedIn, isLoading from useAuth()

  const [restaurantName, setRestaurantName] = useState(`Restaurant ${restaurantId}`); // State to hold restaurant name
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [cartItems, setCartItems] = useState([]);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const API_GATEWAY_URL = 'http://localhost:1111'; // Your API Gateway URL

  useEffect(() => {
    const fetchRestaurantAndMenu = async () => {
      setLoading(true);
      setError(null);

      // Wait until auth context is done loading and user is logged in
      if (isLoading || !isLoggedIn || !jwtToken) {
        if (!isLoading && !isLoggedIn) {
            setError('Authentication token not found. Please log in.');
        } else if (isLoading) {
            // Still loading, do nothing yet
        } else if (!jwtToken) {
            setError('Authentication token not available. Please log in.');
        }
        setLoading(false);
        return;
      }

      try {
        // Fetch restaurant details first to get the name
        const restaurantResponse = await fetch(`${API_GATEWAY_URL}/restaurant/viewRestaurantById/${restaurantId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}` // Use jwtToken
            },
        });

        if (!restaurantResponse.ok) {
            const errorText = await restaurantResponse.text();
            console.error('Raw restaurant response error:', errorText);
            throw new Error(`Failed to fetch restaurant details: ${restaurantResponse.status} - ${errorText}`);
        }
        const restaurantData = await restaurantResponse.json();
        setRestaurantName(restaurantData.name || `Restaurant ${restaurantId}`); // Set actual restaurant name

        // Fetch menu items for the restaurant
        const menuResponse = await fetch(`${API_GATEWAY_URL}/menu/menuItems/${restaurantId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}` // Use jwtToken
            },
        });

        if (!menuResponse.ok) {
            const errorText = await menuResponse.text();
            console.error('Raw menu response error:', errorText);
            throw new Error(`Failed to fetch menu items: ${menuResponse.status} - ${errorText}`);
        }
        const menuData = await menuResponse.json();
        setMenuItems(menuData); // FIXED: Changed 'data' to 'menuData' and removed duplicate line

      } catch (err) {
        console.error('Error fetching menu:', err);
        setError(`Failed to load menu: ${err.message}. Please ensure backend services are running and you are logged in.`);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if restaurantId is available and auth context is not loading
    if (restaurantId && !isLoading) {
      fetchRestaurantAndMenu();
    }
  }, [restaurantId, jwtToken, isLoggedIn, isLoading, API_GATEWAY_URL]); // Add all dependencies

  const handleGoBack = () => {
    navigate('/'); // Go back to the home page (where the carousel is)
  };

  const handleAddToCart = (itemToAdd) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((item) => item.itemID === itemToAdd.itemID);
      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += 1;
        return updatedItems;
      } else {
        return [...prevItems, { ...itemToAdd, quantity: 1 }];
      }
    });
  };

  const handleIncreaseQuantity = (itemId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.itemID === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecreaseQuantity = (itemId) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.itemID === itemId ? { ...item, quantity: Math.max(0, item.quantity - 1) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveFromCart = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.itemID !== itemId));
  };

  return (
    <div className="menu-page-container">
      <Header /> {/* Re-using your Header component */}
      <header className="menu-header">
        <button onClick={handleGoBack} className="back-button" aria-label="Go back">
          <svg xmlns="http://www.w3.org/2000/svg" className="back-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="menu-title">{restaurantName} Menu</h1> {/* Use dynamic restaurant name */}
        <div className="header-placeholder"></div>
      </header>

      <main className="menu-main-content">
        {loading && <p className="loading-message">Loading menu items...</p>}
        {error && <p className="error-message">{error}</p>}

        {!loading && !error && menuItems.length === 0 && (
          <p className="no-items-message">No menu items found for this restaurant.</p>
        )}

        {!loading && !error && menuItems.length > 0 && (
          <div className="menu-grid">
            {menuItems.map((item) => {
              const itemInCart = cartItems.find((cartItem) => cartItem.itemID === item.itemID);
              return (
                <div key={item.itemID} className="menu-item-card">
                  <h3 className="menu-item-name">{item.name}</h3>
                  <p className="menu-item-description">{item.description}</p>
                  <div className="menu-item-bottom">
                    <span className="menu-item-price">₹{item.price ? item.price.toFixed(2) : 'N/A'}</span>
                    {itemInCart ? (
                      <div className="item-quantity-controls">
                        <button
                          className="quantity-button-inline"
                          onClick={() => handleDecreaseQuantity(item.itemID)}
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="item-quantity-display">
                          {itemInCart.quantity}
                        </span>
                        <button
                          className="quantity-button-inline"
                          onClick={() => handleIncreaseQuantity(item.itemID)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        className="add-to-cart-button"
                        onClick={() => handleAddToCart(item)}
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Cart
        cartItems={cartItems}
        totalCartItems={totalCartItems}
        totalCartPrice={totalCartPrice}
        isCartModalOpen={isCartModalOpen}
        setIsCartModalOpen={setIsCartModalOpen}
        handleIncreaseQuantity={handleIncreaseQuantity}
        handleDecreaseQuantity={handleDecreaseQuantity}
        handleRemoveFromCart={handleRemoveFromCart}
      />

      <footer className="menu-footer">
        <p>&copy; {new Date().getFullYear()} ExpressBite. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MenuPage;
