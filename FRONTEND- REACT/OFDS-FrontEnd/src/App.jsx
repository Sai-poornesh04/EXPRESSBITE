import { Routes, Route, Navigate } from 'react-router-dom';
import React, { useState } from 'react';
import Home from './Components/Home/Home';
import OrderMgmt from './Components/Order/OrderMgmt';
import AboutUs from './Components/Header/AboutUs';
import PartnerWithUs from './Components/Header/PartnerWithUs';
import HowItWorks from './Components/Header/HowItWorks';
import LoginPopup from './Components/Login/LoginPopup';
import AdminDashboard from './Components/Admin/AdminDashboard';
import { useAuth } from './context/AuthContext'; // Import useAuth
import MenuPage from './Components/Menu/MenuPage';
import Header from './Components/Header/Header';
import Unauthorized from './Components/Protected/Unauthorized';
import RestaurantCarousel from './Components/Restaurant/RestaurantCarousel'; // Import RestaurantCarousel
import CheckoutPage from './Components/Checkout/CheckoutPage';
import Profile from './Components/Profile/Profile';
import ManageRestaurants from './Components/ManageComponents/ManageRestaurants'; // Import ManageRestaurants
import ManageMenuItems from './Components/ManageComponents/ManageMenuItems'; 
import ManageUsers from './Components/ManageComponents/ManageUsers';// Import ManageMenuItems
import DeliveryTrackingPage from './Components/Delivery/DeliveryTrackingPage'; // <-- NEW IMPORT

const PrivateRoute = ({ children, roles }) => {
    const auth = useAuth(); // Ensure useAuth is accessible here
    if (auth.isLoading) {
        return <div>Loading authentication...</div>; // Or a spinner/loader
    }
    if (!auth.isLoggedIn) {
        return <Navigate to="/" replace />; // Redirect to home/login if not authenticated
    }
    // Check roles if specified
    if (roles && auth.userRole && !roles.includes(auth.userRole)) {
        console.warn(`Unauthorized access attempt for role: ${auth.userRole}. Required roles: ${roles.join(', ')}`);
        return <Navigate to="/unauthorized" replace />; // Redirect to unauthorized page
    }
    return children; // Render the child component if authorized
};

const AdminRoute = ({ children }) => (
    <PrivateRoute roles={['ADMIN']}>{children}</PrivateRoute> // Assumes ADMIN role string
);


const NotFound = () => (
    <div style={{ padding: '80px 20px', textAlign: 'center', minHeight: 'calc(100vh - 140px)' }}>
        <h1 style={{ fontSize: '4em', color: '#ffac12' }}>404</h1> {/* Using your theme color */}
        <p style={{ fontSize: '1.5em', color: '#666' }}>Page Not Found</p>
        <p style={{ fontSize: '1em', color: '#888' }}>The page you are looking for does not exist.</p>
    </div>
);

function App() {
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [popupTriggerContext, setPopupTriggerContext] = useState(null);
    const auth = useAuth(); // Get auth context here

    const handleSignInClick = (context = null) => {
        setPopupTriggerContext(context);
        setShowLoginPopup(true);
    };

    const handleCloseLoginPopup = () => {
        setShowLoginPopup(false);
        setPopupTriggerContext(null);
    };

    const handleLoginSuccess = () => {
        setShowLoginPopup(false);
        // Additional logic if needed for Home component or other parts
    };

    return (
        <>
            {/* Header is always rendered */}
            <Header onSignInClick={handleSignInClick} />

            {/* ALL routes go inside the <Routes> component */}
            <Routes>
                <Route path="/" element={<Home onSignInClick={handleSignInClick} onLoginSuccess={handleLoginSuccess} />} />
                <Route path="/home" element={<Home />} /> {/* Duplicate route for /home, consider if needed */}
                <Route path="/about-us" element={<AboutUs onSignInClick={handleSignInClick} />} />
                <Route path="/partner-with-us" element={<PartnerWithUs onSignInClick={handleSignInClick} />} />
                <Route path="/how-it-works" element={<HowItWorks onSignInClick={handleSignInClick} />} />
                
                {/* User Protected Routes */}
                <Route path="/order" element={<PrivateRoute><OrderMgmt onSignInClick={handleSignInClick} /></PrivateRoute>} />
                <Route path="/profile-settings" element={<PrivateRoute><Profile /></PrivateRoute>} />
                <Route path="/checkout" element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
                
                {/* New Delivery Tracking Page - Protected as it needs order info */}
                <Route path="/delivery-tracking" element={<PrivateRoute><DeliveryTrackingPage /></PrivateRoute>} /> {/* <-- NEW ROUTE */}

                {/* Public restaurant menu (no login required to view a menu) */}
                <Route path="/restaurant" element={<PrivateRoute><RestaurantCarousel /></PrivateRoute>} /> {/* Protecting RestaurantCarousel here */}
                <Route path="/restaurant/:restaurantId/menu" element={<MenuPage />} />

                {/* Admin Protected Routes */}
                {/* Make sure 'ADMIN' matches the exact role string from your backend */}
                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/admin/manage-user" element={<AdminRoute><ManageUsers /></AdminRoute>} /> {/* Removed allowedRoles here as AdminRoute already handles it */}
                <Route path="/admin/manage-orders" element={<AdminRoute><OrderMgmt /></AdminRoute>} />
                <Route path="/admin/manage-restaurants" element={<AdminRoute><ManageRestaurants /></AdminRoute>} />
                <Route path="/admin/manage-menuitems" element={<AdminRoute><ManageMenuItems /></AdminRoute>} />
                
                {/* Public Unauthorized page */}
                <Route path="/unauthorized" element={<Unauthorized />} />
                
                {/* Catch-all for 404 Not Found */}
                <Route path="*" element={<NotFound />} />
            </Routes>

            {/* Login Popup is conditionally rendered outside of Routes as an overlay */}
            {showLoginPopup && (
                <LoginPopup
                    onClose={handleCloseLoginPopup}
                    triggerContext={popupTriggerContext}
                    onLoginSuccess={handleLoginSuccess}
                />
            )}
        </>
    );
}

export default App;
