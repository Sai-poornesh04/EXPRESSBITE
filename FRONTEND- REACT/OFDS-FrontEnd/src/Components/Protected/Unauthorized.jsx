import React from 'react';

// import { Link } from 'react-router-dom';
import './Unauthorized.css'; // Import the external CSS file
import Header from '../Header/Header';
import Footer from '../Home/Footer';



function Unauthorized() {
    return (
        <div className="unauthorized-container">
            <Header /> {/* Display header */}
            <main className="unauthorized-main">
                <div className="unauthorized-card">
                    <h1>Access Denied!</h1>
                    <p>
                        You do not have the proper authorization to view this page.
                        Kindly log in with appropriate credentials.
                    </p>
                    {/* Using <a> tag instead of <Link> for broader Canvas compatibility */}
                    <a href="/" className="home-link">
                        Go to Home
                    </a>
                </div>
            </main>
            <Footer /> {/* Display footer */}
        </div>
    );
}

export default Unauthorized;
