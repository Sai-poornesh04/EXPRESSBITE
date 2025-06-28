import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../Header/Header';
import Footer from '../Home/Footer';
import './DeliveryTrackingPage.css'; // New CSS for this page
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMotorcycle, faUserCircle, faPhoneAlt, faBoxOpen, faMapMarkerAlt, faClock, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
 
const DELIVERY_API_URL = 'http://localhost:1111/delivery'; // Your Delivery Service base URL
 
function DeliveryTrackingPage() {
    const location = useLocation();
    const auth = useAuth();
 
    const [orderId, setOrderId] = useState(null);
    const [deliveryId, setDeliveryId] = useState(null);
    const [agentId, setAgentId] = useState(null);
 
    const [deliveryStatus, setDeliveryStatus] = useState('Loading...');
    const [agentInfo, setAgentInfo] = useState(null); // { name, phone }
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
 
    // Move fetchDetails outside useEffect so it can be reused
    const fetchDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch Delivery Details
            const deliveryResponse = await fetch(`${DELIVERY_API_URL}/${deliveryId}`, {
                headers: { 'Authorization': `Bearer ${auth.jwtToken}` }
            });
            if (!deliveryResponse.ok) {
                throw new Error(`Failed to fetch delivery status: ${deliveryResponse.status}`);
            }
            const deliveryData = await deliveryResponse.json();
            setDeliveryStatus(deliveryData.status);
 
            // Fetch Agent Details
            const agentResponse = await fetch(`${DELIVERY_API_URL}/agent/${agentId}`, {
                headers: { 'Authorization': `Bearer ${auth.jwtToken}` }
            });
            if (!agentResponse.ok) {
                throw new Error(`Failed to fetch agent details: ${agentResponse.status}`);
            }
            const agentData = await agentResponse.json();
            setAgentInfo({ name: agentData.name, phone: agentData.phone });
 
            // Wait for 5 seconds before hiding the loading spinner
            setTimeout(() => {
                setLoading(false);
            }, 2000);
 
        } catch (err) {
            setError(`Failed to load tracking info: ${err.message}. Ensure backend services are running.`);
            setLoading(false);
        }
    };
 
    // Effect to get IDs from route state
    useEffect(() => {
        if (location.state) {
            setOrderId(location.state.orderId);
            setDeliveryId(location.state.deliveryId);
            setAgentId(location.state.agentId);
        } else {
            setError("No order or delivery details provided. Please place an order first.");
            setLoading(false);
        }
    }, [location.state]);
 
    // Effect to fetch delivery and agent details on mount or when IDs/token change
    useEffect(() => {
        if (deliveryId && agentId && auth.jwtToken) {
            fetchDetails();
        } else if (!auth.jwtToken && !auth.isLoading) {
            setError("You must be logged in to track orders.");
            setLoading(false);
        }
    }, [deliveryId, agentId, auth.jwtToken, auth.isLoading]);
 
    if (loading) {
        return (
            <div className="tracking-page-container">
                <Header />
                <div className="loading-message">
                    <FontAwesomeIcon icon={faSyncAlt} spin className="spinner-icon" />
                    Loading tracking details...
                </div>
                <Footer />
            </div>
        );
    }
 
    // Function to get appropriate CSS class for delivery status
    const getStatusClassForTracking = (status) => {
        const lowerStatus = status?.toLowerCase();
        switch (lowerStatus) {
            case 'pending': return 'status-pending';
            case 'delivered': return 'status-delivered';
            default: return 'status-unknown'; // For any other status not explicitly handled
        }
    };
 
    return (
        <div className="tracking-page-container">
            <Header />
            <main className="tracking-main-content">
                <h1 className="tracking-page-title">Order Tracking</h1>
                <p className="tracking-order-id">Order ID: <span>#{orderId || 'N/A'}</span></p>
 
                {error && (
                    <div className="error-card">
                        <p>{error}</p>
                    </div>
                )}
 
                {!error && (
                    <div className="tracking-details-card">
                        <div className="tracking-status-section">
                            <FontAwesomeIcon icon={faBoxOpen} className="status-icon" />
                            <div className="status-info">
                                <p className="label">Current Status:</p>
                                {/* Use the getStatusClassForTracking function here */}
                                <p className={`status-text ${getStatusClassForTracking(deliveryStatus)}`}>{deliveryStatus}</p>
                            </div>
                        </div>
 
                        {agentInfo ? (
                            <div className="tracking-agent-section">
                                <FontAwesomeIcon icon={faMotorcycle} className="agent-icon" />
                                <div className="agent-info">
                                    <p className="label">Your Delivery Agent:</p>
                                    <h3 className="agent-name">
                                        <FontAwesomeIcon icon={faUserCircle} /> {agentInfo.name}
                                    </h3>
                                    <p className="agent-phone">
                                        <a href={`tel:${agentInfo.phone}`}>
                                            <FontAwesomeIcon icon={faPhoneAlt} /> {agentInfo.phone}
                                        </a>
                                    </p>
                                    <p className="agent-status-msg">Your agent is on the way!</p>
                                </div>
                            </div>
                        ) : (
                            <div className="tracking-agent-section">
                                <FontAwesomeIcon icon={faMotorcycle} className="agent-icon" />
                                <div className="agent-info">
                                    <p className="label">Assigning Delivery Agent...</p>
                                    <p className="agent-status-msg">Please wait while we assign an agent for your order.</p>
                                </div>
                            </div>
                        )}
 
                        <div className="tracking-estimated-time">
                            <FontAwesomeIcon icon={faClock} className="time-icon" />
                            <p>Estimated Delivery: <span>30-45 minutes</span></p> {/* This is dummy data, update with real ETA if possible */}
                        </div>
 
                        <div className="tracking-map-placeholder">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="map-icon" />
                            <p>Map tracking coming soon!</p>
                        </div>
 
                        <button className="refresh-button" onClick={fetchDetails}>
                            <FontAwesomeIcon icon={faSyncAlt} /> Refresh Status
                        </button>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
 
export default DeliveryTrackingPage;   