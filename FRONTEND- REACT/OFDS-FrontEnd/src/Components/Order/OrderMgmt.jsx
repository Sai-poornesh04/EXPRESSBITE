import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderMgmt.css';
import { useAuth } from '../../context/AuthContext';
import Footer from '../Home/Footer';
import OrderDetailModal from './OrderDetailModal';

const OrderMgmt = () => {
    const ORDER_API_BASE_URL = 'http://localhost:1111/order';
    const RESTAURANT_API_BASE_URL = 'http://localhost:1111/restaurant';

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('current'); // 'current' or 'past'
    // Simplified filterStatus options: only PENDING and DELIVERED
    const [filterStatus, setFilterStatus] = useState('All'); // 'All', 'PENDING', 'DELIVERED'

    const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const auth = useAuth();
    const navigate = useNavigate();

    // Handlers for modal and navigation
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedOrderDetails(null);
    };

    const handleOrderCardClick = (order) => {
        setSelectedOrderDetails(order);
        setIsModalOpen(true);
    };

    const handleTrackOrder = (order) => {
        if (order.deliveryId && order.agentId && order.orderId) {
            navigate('/delivery-tracking', {
                state: {
                    orderId: order.orderId,
                    deliveryId: order.deliveryId,
                    agentId: order.agentId,
                }
            });
        } else {
            console.warn("Cannot track order: Missing deliveryId or agentId for order ID:", order.orderId);
            setError("Tracking information is not yet available for this order.");
        }
    };

    useEffect(() => {
        console.log(`Frontend connecting to backend at: ${ORDER_API_BASE_URL}`);
    }, []);

    // Effect to fetch orders whenever tab, filter, or auth state changes
    useEffect(() => {
        if (!auth.isLoading) {
            if (auth.isLoggedIn && auth.jwtToken) {
                fetchAllOrders(activeTab, filterStatus);
            } else {
                setOrders([]);
                setError("You must be logged in to view your orders.");
                setLoading(false);
            }
        }
    }, [activeTab, filterStatus, auth.isLoggedIn, auth.isLoading, auth.jwtToken]);

    const fetchAllOrders = async (currentTab, currentFilterStatus) => {
        setLoading(true);
        setError(null);

        const userEmail = auth.userEmail;
        const userRole = auth.userRole;
        
        let queryParams = [];
        let statusesToRequest = [];

        if (currentFilterStatus !== 'All') {
            statusesToRequest.push(currentFilterStatus);
        } else {
            // Simplified status logic for tabs: PENDING for current, DELIVERED for past
            if (currentTab === 'current') {
                statusesToRequest = ['PENDING']; // Only PENDING for current
            } else if (currentTab === 'past') {
                statusesToRequest = ['DELIVERED']; // Only DELIVERED for past
            }
        }

        if (statusesToRequest.length > 0) {
            queryParams.push(`statuses=${statusesToRequest.join(',')}`);
        }

        if (userRole !== 'ADMIN' && userEmail) {
            queryParams.push(`email=${userEmail}`);
        }

        let url = `${ORDER_API_BASE_URL}/list`;
        if (queryParams.length > 0) {
            url += `?${queryParams.join('&')}`;
        }
        
        console.log(`FETCHING ORDERS - URL: ${url}`);
        console.log(`FETCHING ORDERS - Requesting Statuses: ${statusesToRequest.join(', ')}`);
        console.log(`FETCHING ORDERS - Using JWT Token: ${auth.jwtToken ? auth.jwtToken.substring(0, 30) + '...' : 'No Token'}`);

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.jwtToken}`
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Raw backend response on error:', errorText);
                let errorMessage = `HTTP error! Status: ${response.status}`;
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMessage += ` - ${errorJson.message || errorJson.error || 'Unknown backend error'}`;
                } catch (e) {
                    errorMessage += ` - ${errorText}`;
                }
                throw new Error(errorMessage);
            }
            let backendOrders = await response.json();
            console.log('Successfully fetched raw backend orders:', backendOrders);

            let cachedOrdersMap = {};
            try {
                cachedOrdersMap = JSON.parse(localStorage.getItem('expressbite_orders_map') || '{}');
            } catch (e) {
                console.error("Error parsing expressbite_orders_map from localStorage:", e);
                cachedOrdersMap = {};
            }
            console.log('Cached orders map from localStorage:', cachedOrdersMap);

            const ordersToDisplay = await Promise.all(backendOrders.map(async (backendOrder) => {
                const cachedDetail = cachedOrdersMap[backendOrder.orderId];
                let orderDisplay = { ...backendOrder };

                if (cachedDetail) {
                    orderDisplay = {
                        ...orderDisplay,
                        ...cachedDetail,
                        status: backendOrder.status
                    };
                }

                if (orderDisplay.restaurantID && !orderDisplay.restaurantName) {
                    try {
                        const restaurantResponse = await fetch(`${RESTAURANT_API_BASE_URL}/viewRestaurantById/${orderDisplay.restaurantID}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${auth.jwtToken}`
                            }
                        });
                        if (restaurantResponse.ok) {
                            const restaurantData = await restaurantResponse.json();
                            orderDisplay.restaurantName = restaurantData.name || `ID: ${orderDisplay.restaurantID}`;
                        } else {
                            orderDisplay.restaurantName = `ID: ${orderDisplay.restaurantID}`;
                        }
                    } catch (e) {
                        console.error(`Error fetching restaurant for ID ${orderDisplay.restaurantID}:`, e);
                        orderDisplay.restaurantName = `ID: ${orderDisplay.restaurantID}`;
                    }
                } else if (!orderDisplay.restaurantID) {
                    orderDisplay.restaurantName = 'N/A';
                }

                return orderDisplay;
            }));

            ordersToDisplay.sort((a, b) => b.orderId - a.orderId);

            setOrders(ordersToDisplay);
        } catch (err) {
            console.error('Error fetching orders or restaurant names:', err);
            setError(
                `Failed to fetch orders: ${err.message}. Please check the following: \n\n` +
                `1. **Backend Running?**: Ensure your API Gateway (port 1111), Order Service, and Restaurant Service are running. \n` +
                `2. **CORS Configuration**: Verify your backend services have correct \`@CrossOrigin\` annotations for \`http://localhost:5176\`. \n` +
                `3. **Backend Restart**: Remember to restart your backend services after *any* code changes. \n` +
                `4. **Authentication**: Ensure you are logged in. \n` +
                `5. **Network/Firewall**: Temporarily disable any local firewalls or antivirus that might block ports. \n` +
                `6. **Backend /order/list endpoint**: MOST IMPORTANTLY, ensure your backend's \`/order/list\` endpoint correctly filters orders by the \`statuses\` query parameter (e.g., \`/list?statuses=PENDING\`).`
            );
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyles = (status) => {
        // Only handle PENDING and DELIVERED for styling
        switch (status?.toLowerCase()) {
            case 'pending': return 'status-pending';
            case 'delivered': return 'status-delivered';
            default: return 'status-unknown'; // For any other unexpected statuses
        }
    };

    // Determine if the "Track Order" button should be shown (only for PENDING orders with tracking info)
    const shouldShowTrackButton = (order) => {
        const lowerCaseStatus = order.status?.toLowerCase();
        return (lowerCaseStatus === 'pending') && order.deliveryId && order.agentId;
    };

    return (
        <div className="my-orders-page">
            <div className="main-content">
                <h1 className="page-title">My Orders</h1>
                <p className="page-description">
                    View your past and current food orders with ease.
                </p>

                <div className="controls-container">
                    <div className="order-tabs">
                        <button
                            className={`order-tab-button ${activeTab === 'current' ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTab('current');
                                setFilterStatus('All'); // Reset filter when switching tabs
                            }}
                        >
                            Current Orders
                        </button>
                        <button
                            className={`order-tab-button ${activeTab === 'past' ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTab('past');
                                setFilterStatus('All'); // Reset filter when switching tabs
                            }}
                        >
                            Past Orders
                        </button>
                    </div>

                    <div className="filter-dropdown-container">
                        <select
                            className="filter-dropdown"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="All">All</option>
                            <option value="PENDING">Pending</option>
                            <option value="DELIVERED">Delivered</option>
                        </select>
                        <div className="dropdown-arrow">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m6 9 6 6 6-6"></path>
                            </svg>
                        </div>
                    </div>
                </div>

                {loading && (
                    <div className="loading-message">
                        <svg className="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
                        </svg>
                        Loading orders...
                    </div>
                )}
                {error && (
                    <div className="error-message">
                        <div className="error-icon-text">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="m15 9-6 6"></path>
                                <path d="m9 9 6 6"></path>
                            </svg>
                            <span className="error-heading">Connection Error!</span>
                        </div>
                        <p className="error-details">{error}</p>
                    </div>
                )}

                <div className="orders-grid">
                    {orders.length === 0 && !loading && !error ? (
                        <p className="no-orders-message">No orders found for the selected criteria.</p>
                    ) : (
                        orders.map((order) => (
                            <div key={order.orderId} className="order-card" onClick={() => handleOrderCardClick(order)}>
                                <div className="order-card-header">
                                    <h3 className="order-id">Order ID: {order.orderId}</h3>
                                    <span className={`order-status ${getStatusStyles(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <p className="order-restaurant-name">Restaurant: <span>{order.restaurantName || 'Loading...'}</span></p>
                                <p className="order-total-amount">Total Amount: <span>₹{order.totalAmount?.toFixed(2)}</span></p>
                                <p className="order-date">Order Time: <span>{order.orderTime ? new Date(order.orderTime).toLocaleString() : 'N/A'}</span></p>
                                
                                {shouldShowTrackButton(order) && (
                                    <div className="order-card-actions">
                                        <button
                                            className="track-order-button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleTrackOrder(order);
                                            }}
                                        >
                                            Track Order
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Order Detail Modal */}
            {isModalOpen && selectedOrderDetails && (
                <OrderDetailModal order={selectedOrderDetails} onClose={handleCloseModal} />
            )}

            <Footer />
        </div>
    );
};

export default OrderMgmt;
