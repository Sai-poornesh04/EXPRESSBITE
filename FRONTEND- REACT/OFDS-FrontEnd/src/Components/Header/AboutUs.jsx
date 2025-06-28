import React from 'react';
import Header from '../Header/Header'; // This import should now correctly point to your new Header.jsx
import Footer from '../Home/Footer'; // Import the Footer component
import './AboutUs.css'; // Import the external CSS file

const AboutUs = ({ onSignInClick }) => {
    return (
        <div className="about-us-container">
            {/* Pass onSignInClick to the Header */}
            <Header onSignInClick={onSignInClick} />

            <main className="about-us-main">
                {/* Your existing AboutUs page content goes here */}
                <header className="about-us-header">
                    <h1>About ExpressBite</h1>
                    <p>
                        Connecting you with the best local flavors, delivered fresh and fast.
                    </p>
                </header>

                <section className="our-story-section">
                    <div className="our-story-content">
                        <h2>Our Story</h2>
                        <p>
                            ExpressBite was founded on the simple idea that great food should be accessible to everyone,
                            anytime, anywhere. What started as a small team with a big vision has grown into a thriving
                            platform serving communities and supporting countless local restaurants. We're passionate
                            about food, technology, and making people happy.
                        </p>
                        <p>
                            From humble beginnings to becoming a go-to for food delivery, our journey has been driven by
                            a commitment to quality, efficiency, and exceptional customer service.
                        </p>
                    </div>
                    <div className="our-story-image-container">
                        <img
                            src="../../ourStory.png"
                            alt="ExpressBite Story"
                            className="our-story-image"
                        />
                    </div>
                </section>

                <section className="core-values-section">
                    <h2>Our Core Values</h2>
                    <ul className="core-values-list">
                        <li className="core-value-item">
                            <h3>Innovation</h3>
                            <p>
                                Constantly evolving to provide a seamless and intuitive ordering experience.
                            </p>
                        </li>
                        <li className="core-value-item">
                            <h3>Reliability</h3>
                            <p>
                                Ensuring your orders are accurate and delivered on time, every time.
                            </p>
                        </li>
                        <li className="core-value-item">
                            <h3>Community</h3>
                            <p>
                                Building strong relationships with our restaurant partners and customers.
                            </p>
                        </li>
                    </ul>
                </section>

                <section className="team-section">
                    <h2>Meet Our Team</h2>
                    <div className="team-members-grid">
                        {/* Team Member: SAI POORNESH KAVILI */}
                        <div className="team-member-card">
                            <h3>Sai Poornesh Kavili</h3>
                            <p>Developer</p>
                            <p className="description">
                                A key contributor to the ExpressBite platform's development.
                            </p>
                        </div>

                        {/* Team Member: CHETTY VARDHAN GOUD */}
                        <div className="team-member-card">
                            <h3>Chetty Vardhan Goud</h3>
                            <p>Developer</p>
                            <p className="description">
                                Bringing innovative solutions to enhance user experience.
                            </p>
                        </div>

                        {/* Team Member: VINISHA KRISHNAN */}
                        <div className="team-member-card">
                            <h3>Vinisha Krishnan</h3>
                            <p>Developer</p>
                            <p className="description">
                                Dedicated to building robust and scalable features.
                            </p>
                        </div>

                        {/* Team Member: SRI HARI VISWANATH */}
                        <div className="team-member-card">
                            <h3>Sri Hari Viswanath</h3>
                            <p>Developer</p>
                            <p className="description">
                                Ensuring high-quality code and seamless functionality.
                            </p>
                        </div>

                        {/* Team Member: PADMAPRIYA MAHALINGAM */}
                        <div className="team-member-card">
                            <h3>Padmapriya Mahalingam</h3>
                            <p>Developer</p>
                            <p className="description">
                                Passionate about delivering efficient and reliable software.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="join-us-section">
                    <h2>Join the ExpressBite Family!</h2>
                    <p>
                        Whether you're looking to enjoy delicious food or become a partner, we welcome you.
                    </p>
                    <a href="/" className="action-button">
                        Order Now
                    </a>
                    <a href="/partner-with-us" className="action-button secondary">
                        Partner With Us
                    </a>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default AboutUs;
