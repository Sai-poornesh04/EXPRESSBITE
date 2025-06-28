// src/Components/HowItWorks.jsx
import React from 'react';
import Header from '../Header/Header'; // Import Header
import Footer from '../Home/Footer'; // Import Footer
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faShoppingBasket, faBiking } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const HowItWorks = ({ onSignInClick }) => {
  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: 'var(--font-poppins)', backgroundColor: 'var(--background-light)' }}>
      {/* Pass onSignInClick to Header */}
      <Header onSignInClick={onSignInClick} />

      <main className="flex-grow py-16 px-4" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <section style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '3.5em',
            color: '#f77024',
            marginBottom: '15px',
            marginTop:'70px'}}>
            How It Works
          </h1>
          <p style={{ fontSize: '1.2em', color: 'var(--text-light)', lineHeight: '1.6' }}>
            Getting your favorite food delivered is easy! Follow these simple steps.
          </p>
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem', marginBottom: '3rem', justifyContent: 'center' }}>
          {/* Step 1 */}
          <div style={{
            backgroundColor: 'var(--white)',
            borderRadius: 'var(--border-radius-btn)',
            boxShadow: 'var(--shadow-light)',
            padding: '2.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            <div style={{
              width: '6rem', height: '6rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '50%',
              backgroundColor: 'rgba(247, 112, 36, 0.1)', // Light orange background
              color: 'var(--primary-orange)',
              marginBottom: '1.5rem',
              fontSize: '3em'
            }}>
              <FontAwesomeIcon icon={faSearch} />
            </div>
            <h2 style={{ fontSize: '2em', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '1rem' }}>1. Find Your Food</h2>
            <p style={{ color: 'var(--text-light)' }}>
              Browse restaurants by cuisine, location, or dish. Discover new local favorites.
            </p>
          </div>

          {/* Step 2 */}
          <div style={{
            backgroundColor: 'var(--white)',
            borderRadius: 'var(--border-radius-btn)',
            boxShadow: 'var(--shadow-light)',
            padding: '2.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            <div style={{
              width: '6rem', height: '6rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '50%',
              backgroundColor: 'rgba(247, 112, 36, 0.1)',
              color: 'var(--primary-orange)',
              marginBottom: '1.5rem',
              fontSize: '3em'
            }}>
              <FontAwesomeIcon icon={faShoppingBasket} />
            </div>
            <h2 style={{ fontSize: '2em', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '1rem' }}>2. Place Your Order</h2>
            <p style={{ color: 'var(--text-light)' }}>
              Add items to your cart, customize your meal, and checkout securely.
            </p>
          </div>

          {/* Step 3 */}
          <div style={{
            backgroundColor: 'var(--white)',
            borderRadius: 'var(--border-radius-btn)',
            boxShadow: 'var(--shadow-light)',
            padding: '2.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            <div style={{
              width: '6rem', height: '6rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '50%',
              backgroundColor: 'rgba(247, 112, 36, 0.1)',
              color: 'var(--primary-orange)',
              marginBottom: '1.5rem',
              fontSize: '3em'
            }}>
              <FontAwesomeIcon icon={faBiking} />
            </div>
            <h2 style={{ fontSize: '2em', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '1rem' }}>3. Enjoy Your Meal</h2>
            <p style={{ color: 'var(--text-light)' }}>
              Track your order in real-time and get it delivered right to your door.
            </p>
          </div>
        </section>

        <section style={{
          maxWidth: '800px',
          margin: '0 auto',
          backgroundColor: 'var(--white)',
          borderRadius: 'var(--border-radius-btn)',
          padding: '3rem',
          textAlign: 'center',
          boxShadow: 'var(--shadow-medium)'
        }}>
          <h2 style={{ fontSize: '2.5em', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '1rem' }}>Need Help?</h2>
          <p style={{ fontSize: '1.1em', color: 'var(--text-light)', marginBottom: '2rem' }}>
            Our support team is ready to assist you.
          </p>
          <Link
            to="/contact-us" // Assuming you'll create a ContactUs page
            className="btn btn-secondary-solid" // Use your existing button styles
            style={{
              padding: '1rem 2.5rem',
              fontSize: '1.1em',
              fontWeight: 'bold',
              borderRadius: 'var(--border-radius-btn)',
              transition: 'background-color 0.3s ease',
            }}
          >
            Contact Support
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HowItWorks;