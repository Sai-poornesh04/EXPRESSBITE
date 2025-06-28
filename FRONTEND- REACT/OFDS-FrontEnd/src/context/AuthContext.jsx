import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext(null);

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [jwtToken, setJwtToken] = useState(null);
    const [userEmail, setUserEmail] = useState(null); // This will actually be the username (name field)
    const [isLoading, setIsLoading] = useState(true); // Added isLoading state

    // Helper function to decode JWT payload
    const decodeJwt = useCallback((token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            const decoded = JSON.parse(jsonPayload);
            console.log("Decoded JWT Payload:", decoded); // Keep this for debugging
            return decoded;
        } catch (error) {
            console.error("Error decoding JWT:", error);
            return null;
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            const decodedToken = decodeJwt(token);
            if (decodedToken && decodedToken.sub) {
                setJwtToken(token);
                setUserEmail(decodedToken.sub); // 'sub' typically holds the username/email
                
                // Extract roles
                if (decodedToken.roles) {
                    setUserRole(decodedToken.roles);
                } else {
                    console.warn('AuthContext: JWT token found but no roles claim.');
                    setUserRole(null);
                }

                // Extract userId (if present)
                if (decodedToken.userId) { // Check for the 'userId' claim
                    // Assuming you have a state for userAuthId in AuthContext
                    // setUserAuthId(decodedToken.userId); // Uncomment if you add userAuthId state
                } else {
                    // console.warn('AuthContext: JWT token found but no userId claim.'); // Uncomment if needed
                    // setUserAuthId(null); // Uncomment if you add userAuthId state
                }

                setIsLoggedIn(true);
                console.log('AuthContext: Initialized from localStorage - Logged in as', decodedToken.sub, 'with roles:', decodedToken.roles);
            } else {
                // Token invalid or missing sub, clear local storage
                localStorage.removeItem('jwtToken');
                localStorage.removeItem('userRole');
                // localStorage.removeItem('userAuthId'); // Uncomment if you add userAuthId state
                console.log('AuthContext: Invalid token in localStorage. Not logged in.');
                setIsLoggedIn(false); // Explicitly set to false
            }
        } else {
            console.log('AuthContext: No token found in localStorage. Not logged in.');
            setIsLoggedIn(false); // Explicitly set to false
        }
        setIsLoading(false); // Authentication check is complete
    }, [decodeJwt]);

    const login = (token) => { // Now only accepts token
        localStorage.setItem('jwtToken', token);
        const decodedToken = decodeJwt(token);
        if (decodedToken && decodedToken.sub) {
            setJwtToken(token);
            setUserEmail(decodedToken.sub); // Set user email (username)
            if (decodedToken.roles) {
                setUserRole(decodedToken.roles);
                localStorage.setItem('userRole', decodedToken.roles); // Store role in localStorage
                console.log('AuthContext: User logged in as', decodedToken.sub, 'with roles:', decodedToken.roles);
            } else {
                console.warn('Login: JWT token provided but no roles claim.');
                setUserRole(null);
                localStorage.removeItem('userRole');
            }
            // Handle userId if present
            if (decodedToken.userId) {
                // Assuming you have a state for userAuthId in AuthContext
                // setUserAuthId(decodedToken.userId); // Uncomment if you add userAuthId state
                // localStorage.setItem('userAuthId', decodedToken.userId); // Uncomment if you add userAuthId state
            } else {
                // console.warn('Login: JWT token provided but no userId claim.'); // Uncomment if needed
                // setUserAuthId(null); // Uncomment if you add userAuthId state
                // localStorage.removeItem('userAuthId'); // Uncomment if you add userAuthId state
            }
            setIsLoggedIn(true);
        } else {
            console.error("Login: Could not decode token or 'sub' claim missing.");
            logout(); // Logout if token is bad
        }
    };

    const logout = () => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userRole');
        // localStorage.removeItem('userAuthId'); // Uncomment if you add userAuthId state
        setJwtToken(null);
        setUserRole(null);
        setUserEmail(null); // Clear user email on logout
        // setUserAuthId(null); // Uncomment if you add userAuthId state
        setIsLoggedIn(false);
        console.log('AuthContext: User logged out.');
    };

    const cacheOrders = (cache) => {
        localStorage.setItem('expressbite_orders_cache', JSON.stringify(cache));
    };

    const authContextValue = {
        isLoggedIn,
        userRole,
        jwtToken,
        userEmail, // Provide user email (username) in context
        isLoading, // Provide isLoading in context
        login,
        logout,
        cacheOrders, // Provide cacheOrders in context
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};
