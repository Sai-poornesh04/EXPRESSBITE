// Components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Assuming AuthContext path

const ProtectedRoute = ({ children, allowedRoles }) => {
    const auth = useAuth();

    // 1. While authentication status is still loading
    if (auth.isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-lg text-gray-700">Loading user session...</p>
            </div>
        );
    }

    // 2. If not logged in at all
    if (!auth.isLoggedIn) {
        // Redirect to a login page or the home page
        // You might want to pass a state to the login page to show a "Please log in" message
        return <Navigate to="/" replace />; // Redirect to home/login page
    }

    // 3. If logged in but role is not allowed
    if (allowedRoles && !allowedRoles.includes(auth.userRole)) {
        return <Navigate to="/unauthorized" replace />; // Redirect to unauthorized page
    }

    // 4. If logged in and role is allowed, render the children (the protected component)
    return children;
};

export default ProtectedRoute;
