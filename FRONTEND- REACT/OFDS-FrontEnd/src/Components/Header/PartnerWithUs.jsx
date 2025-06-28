// src/Components/PartnerWithUs.jsx
import React from 'react';
import Header from '../Header/Header'; // Import Header
import Footer from '../Home/Footer'; // Import Footer

const PartnerWithUs = ({ onSignInClick }) => {
  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: 'var(--font-poppins)', backgroundColor: 'var(--background-light)' }}>
      {/* Pass onSignInClick to Header */}
      <Header onSignInClick={onSignInClick}  />
      
      <main className="flex-grow py-16 px-4" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <section style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1  style={{
            fontSize: '3.5em',
            color: '#f77024',
            marginBottom: '15px',
            marginTop:'70px'
          }}>
            Partner With Us
          </h1>
          <p style={{ fontSize: '1.2em', color: 'var(--text-light)', lineHeight: '1.6' }}>
            Expand your reach, grow your business, and delight more customers by joining our network.
          </p>
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem', marginBottom: '3rem' }}>
          {/* For Restaurants */}
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
            {/* Updated image source for preview environment */}
            <img src="../../download.jpg" alt="Restaurant Icon" style={{ width: '6rem', height: '6rem', marginBottom: '1.5rem' }} />
            <h2 style={{ fontSize: '2em', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '1rem' }}>For Restaurants</h2>
            <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem' }}>
              Reach a wider audience, streamline your order management, and boost your sales. We handle the delivery, you focus on the food!
            </p>
            <button
              onClick={() => onSignInClick('restaurant-partner')} // Logic change: Pass 'restaurant-partner' context
              className="btn btn-secondary-solid" // Use your existing button styles
            >
              Join as a Restaurant
            </button>
          </div>

          {/* For Delivery Partners */}
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
            {/* Updated image source for preview environment */}
            <img src="../../delivery-driver.png" alt="Delivery Icon" style={{ width: '6rem', height: '6rem', marginBottom: '1.5rem' }} />
            <h2 style={{ fontSize: '2em', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '1rem' }}>For Delivery Partners</h2>
            <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem' }}>
              Earn flexibly, deliver on your own schedule, and be a part of a growing community. Fast payouts and great support.
            </p>
            <button
              onClick={() => onSignInClick('delivery-partner')} // Logic change: Pass 'delivery-partner' context
              className="btn btn-secondary-solid" // Use your existing button styles
            >
              Sign Up as a Driver
            </button>
          </div>
        </section>

        <section style={{
          maxWidth: '800px',
          margin: '0 auto',
          backgroundColor: 'var(--primary-orange)',
          borderRadius: 'var(--border-radius-btn)',
          padding: '3rem',
          textAlign: 'center',
          color: 'var(--white)',
          boxShadow: 'var(--shadow-medium)'
        }}>
          <h2 style={{ fontSize: '2.5em', fontWeight: '700', marginBottom: '1rem' }}>Ready to Grow?</h2>
          <p style={{ fontSize: '1.1em', marginBottom: '2rem', opacity: '0.9' }}>
            Start your journey with us today and unlock new opportunities.
          </p>
          <button
            onClick={() => onSignInClick('partner')} // This button remains 'partner' for general partner login/signup
            className="btn" // Use your base button class
            style={{
              backgroundColor: 'var(--dark-orange)', // A slightly darker orange
              color: 'var(--white)',
              padding: '1rem 2.5rem',
              fontSize: '1.1em',
              fontWeight: 'bold',
              borderRadius: 'var(--border-radius-btn)',
              transition: 'background-color 0.3s ease',
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
            }}
          >
            Get Started Now
          </button>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PartnerWithUs;
