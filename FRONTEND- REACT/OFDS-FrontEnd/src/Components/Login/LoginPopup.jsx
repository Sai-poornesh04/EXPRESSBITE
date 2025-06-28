// Components/LoginPopup.jsx
import React, { useState, useEffect, useContext } from 'react';
import './LoginPopup.css'; // Import the CSS file
import { AuthContext } from '../../context/AuthContext';

// Accept a new prop: triggerContext and onLoginSuccess
function LoginPopup({ onClose, triggerContext, onLoginSuccess }) {
    const [isActive, setIsActive] = useState(false);
    const [isSignup, setIsSignup] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [loginEmail, setLoginEmail] = useState(''); // Maps to 'email' for login
    const [loginPassword, setLoginPassword] = useState('');

    const [signupUsername, setSignupUsername] = useState(''); // Maps to 'name' in UserInfo for signup
    const [signupEmail, setSignupEmail] = useState(''); // Maps to 'email' in UserInfo for signup
    const [signupPassword, setSignupPassword] = useState('');

    const API_BASE_URL = 'http://localhost:1111'; // Your API Gateway URL

    // const auth = useAuth();
    const auth = useContext(AuthContext);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsActive(true);
        }, 10);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsActive(false);
        setTimeout(() => {
            onClose();
            // Reset popup state when it's fully closed
            setIsSignup(false);
            setErrorMessage('');
            // setLoginSuccessMessage(''); // Removed
            setLoginEmail(''); // Reset login email
            setLoginPassword('');
            setSignupUsername(''); // Reset signup username
            setSignupEmail('');
            setSignupPassword('');
        }, 400);
    };

    const handleToggleView = (e, view) => {
        e.preventDefault();
        setIsSignup(view === 'signup');
        setErrorMessage('');
        // setLoginSuccessMessage(''); // Removed
        if (view === 'login') {
            setSignupUsername(''); // Clear signup username
            setSignupEmail('');
            setSignupPassword('');
        } else {
            setLoginEmail(''); // Clear login email
            setLoginPassword('');
        }
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        // setLoginSuccessMessage(''); // Removed

        try {
            const response = await fetch(`${API_BASE_URL}/auth/authenticate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: loginEmail, // Sending 'email' field
                    password: loginPassword,
                }),
            });

            if (response.ok) {
                const token = await response.text();
                console.log('Login successful! Token:', token);
                // setLoginSuccessMessage('Successfully Logged In!'); // Removed

                auth.login(token); // Pass the raw token to AuthContext
                onLoginSuccess(); // Trigger the success callback in Home.jsx

                setTimeout(() => {
                   
                    handleClose(); // Close the popup
                }, 1000); // Small delay before closing, allowing Home.jsx notification to appear
            } else {
                let errorMsg = 'Login failed. Please try again.';
                try {
                    const errorBody = await response.json();
                    if (errorBody && errorBody.message) {
                        errorMsg = errorBody.message;
                    } else {
                        errorMsg = JSON.stringify(errorBody);
                    }
                } catch (jsonParseError) {
                    const textError = await response.text();
                    errorMsg = textError || 'An unknown error occurred during login.';
                }
                console.error('Login failed:', response.status, errorMsg);
                setErrorMessage(errorMsg);
            }
        } catch (error) {
            console.error('Network error or unexpected issue:', error);
            setErrorMessage('Could not connect to the server. Please ensure the backend is running and accessible.');
        }
    };

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        // setLoginSuccessMessage(''); // Removed for signup success message as well, Home.jsx handles it

        if (!signupUsername.trim()) {
            setErrorMessage('Username cannot be empty.');
            return;
        }

        let rolesToSend = "ROLE_USER";
        if (triggerContext === 'restaurant-partner') {
            rolesToSend = "ROLE_RESTAURANT";
        } else if (triggerContext === 'delivery-partner') {
            rolesToSend = "ROLE_DELIVERY";
        }

        try {
            const response = await fetch(`${API_BASE_URL}/auth/new`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: signupUsername,
                    email: signupEmail,
                    password: signupPassword,
                    roles: rolesToSend
                }),
            });

            if (response.ok) {
                const responseText = await response.text();
                console.log('Signup successful:', responseText);
                // setLoginSuccessMessage('Registration successful! Please log in.'); // Removed
                setIsSignup(false); // Switch to login view after successful signup
                setLoginEmail(signupEmail); // Pre-fill login email
                setLoginPassword('');
                setSignupUsername('');
                setSignupEmail('');
                setSignupPassword('');

                // No need for a separate timeout here, as Home.jsx will handle the notification
                // and the popup will close after successful login.
            } else {
                let errorMsg = 'Registration failed. Please try again.';
                try {
                    const errorBody = await response.json();
                    if (errorBody && errorBody.message) {
                        errorMsg = errorBody.message;
                    } else {
                        errorMsg = JSON.stringify(errorBody);
                    }
                } catch (jsonParseError) {
                    const textError = await response.text();
                    errorMsg = textError || 'An unknown error occurred during registration.';
                }
                console.error('Signup failed:', response.status, errorMsg);
                setErrorMessage(errorMsg);
            }
        } catch (error) {
            console.error('Network error or unexpected issue during signup:', error);
            setErrorMessage('Could not connect to the server for registration. Please ensure the backend is running and accessible.');
        }
    };

    const getPopupHeading = () => {
        if (isSignup) {
            if (triggerContext === 'restaurant-partner') {
                return 'Sign up as Restaurant';
            } else if (triggerContext === 'delivery-partner') {
                return 'Sign up as Driver';
            }
            return 'Sign up';
        } else {
            if (triggerContext === 'restaurant-partner' || triggerContext === 'delivery-partner') {
                return 'Partner Login';
            }
            return 'Login';
        }
    };

    return (
        <div className={`login-popup-overlay ${isActive ? 'active' : ''}`}>
            <div className={`login-popup-content ${isActive ? 'active' : ''}`}>
                <button className="close-button" onClick={handleClose}>
                    &times;
                </button>

                {/* Removed the conditional rendering for loginSuccessMessage */}
                {/* {loginSuccessMessage ? (
                    <div className="login-success-container">
                        <FontAwesomeIcon icon={faCheckCircle} className="success-icon" />
                        <p className="success-message">{loginSuccessMessage}</p>
                    </div>
                ) : ( */}
                    <>
                        <div className="popup-top-section">
                            <div className="popup-header">
                                <h2>{getPopupHeading()}</h2>
                                <p className="toggle-view-link">
                                    or{' '}
                                    {isSignup ? (
                                        <a href="#" onClick={(e) => handleToggleView(e, 'login')}>
                                            login to your account
                                        </a>
                                    ) : (
                                        <a href="#" onClick={(e) => handleToggleView(e, 'signup')}>
                                            create an account
                                        </a>
                                    )}
                                </p>
                            </div>
                            <div className="popup-image">
                                <img
                                    src={"../../carrot.png"}
                                    alt={isSignup ? "Signup icon" : "Login icon"}
                                />
                            </div>
                        </div>

                        {errorMessage && (
                            <p style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>
                                {errorMessage}
                            </p>
                        )}

                        {isSignup ? (
                            <form onSubmit={handleSignupSubmit} className="popup-form">
                                <div className="input-group">
                                    <input
                                        type="text"
                                        id="signupUsername"
                                        placeholder=" "
                                        value={signupUsername}
                                        onChange={(e) => setSignupUsername(e.target.value)}
                                        required
                                    />
                                    <label htmlFor="signupUsername">Username</label>
                                </div>
                                <div className="input-group">
                                    <input
                                        type="email"
                                        id="signupEmail"
                                        placeholder=" "
                                        value={signupEmail}
                                        onChange={(e) => setSignupEmail(e.target.value)}
                                        required
                                    />
                                    <label htmlFor="signupEmail">Email</label>
                                </div>
                                <div className="input-group">
                                    <input
                                        type="password"
                                        id="signupPassword"
                                        placeholder=" "
                                        value={signupPassword}
                                        onChange={(e) => setSignupPassword(e.target.value)}
                                        required
                                    />
                                    <label htmlFor="signupPassword">Password</label>
                                </div>
                                <button type="submit" className="popup-button">
                                    CONTINUE
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleLoginSubmit} className="popup-form">
                                <div className="input-group">
                                    <input
                                        type="email"
                                        id="loginEmail"
                                        placeholder=" "
                                        value={loginEmail}
                                        onChange={(e) => setLoginEmail(e.target.value)}
                                        required
                                    />
                                    <label htmlFor="loginEmail">Email</label>
                                </div>
                                <div className="input-group">
                                    <input
                                        type="password"
                                        id="loginPassword"
                                        placeholder=" "
                                        value={loginPassword}
                                        onChange={(e) => setLoginPassword(e.target.value)}
                                        required
                                    />
                                    <label htmlFor="loginPassword">Password</label>
                                </div>
                                <button type="submit" className="popup-button">
                                    LOGIN
                                </button>
                            </form>
                        )}

                        <p className="terms-policy">
                            By {isSignup ? 'creating an account' : 'clicking on Login'}, I accept the{' '}
                            <a href="#terms">Terms & Conditions</a> &{' '}
                            <a href="#policy">Privacy Policy</a>
                        </p>
                    </>
                {/* ) */}
            </div>
        </div>
    );
}

export default LoginPopup;
