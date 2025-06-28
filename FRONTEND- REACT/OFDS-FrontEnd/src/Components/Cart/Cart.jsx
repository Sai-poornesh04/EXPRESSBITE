import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../Menu/MenuPage.css'; // Import the shared CSS file

const Cart = ({
  cartItems,
  totalCartItems,
  totalCartPrice,
  isCartModalOpen,
  setIsCartModalOpen,
  handleIncreaseQuantity,
  handleDecreaseQuantity,
  handleRemoveFromCart,
}) => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleProceedToCheckout = () => {
    setIsCartModalOpen(false); // Close the cart modal
    navigate('/checkout', { state: { cartItems: cartItems } }); // Navigate and pass cart items
  };

  return (
    <>
      {/* Floating Cart Button */}
      {totalCartItems > 0 && (
        <button
          className="floating-cart-button"
          onClick={() => setIsCartModalOpen(true)}
          aria-label={`View cart with ${totalCartItems} items`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="cart-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="cart-item-count">{totalCartItems}</span>
        </button>
      )}

      {/* Cart Modal */}
      {isCartModalOpen && (
        <div className="cart-modal-overlay" onClick={() => setIsCartModalOpen(false)}>
          <div className="cart-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="cart-modal-header">
              <h2 className="cart-modal-title">Your Cart</h2>
              <button className="close-modal-button" onClick={() => setIsCartModalOpen(false)}>
                &times;
              </button>
            </div>
            <div className="cart-modal-body">
              {cartItems.length === 0 ? (
                <p className="empty-cart-message">Your cart is empty.</p>
              ) : (
                <ul className="cart-items-list">
                  {cartItems.map((item) => (
                    <li key={item.itemID} className="cart-item">
                      <div className="cart-item-details">
                        <span className="cart-item-name">{item.name}</span>
                        <span className="cart-item-price">₹{item.price * item.quantity}</span>
                      </div>
                      <div className="cart-item-controls">
                        <button className="quantity-button" onClick={() => handleDecreaseQuantity(item.itemID)}>-</button>
                        <span className="item-quantity">{item.quantity}</span>
                        <button className="quantity-button" onClick={() => handleIncreaseQuantity(item.itemID)}>+</button>
                        <button className="remove-item-button" onClick={() => handleRemoveFromCart(item.itemID)}>Remove</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="cart-modal-footer">
              <div className="cart-total">
                <span>Total:</span>
                <span className="total-price">₹{totalCartPrice.toFixed(2)}</span> {/* Ensure total price is formatted */}
              </div>
              <button
                className="checkout-button"
                disabled={cartItems.length === 0}
                onClick={handleProceedToCheckout} // Call the new handler
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
