import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faMotorcycle, faUtensils, faMapMarkerAlt, faCreditCard, faClock, faUser } from '@fortawesome/free-solid-svg-icons';
import './OrderDetailModal.css'; // CORRECT: Import its OWN CSS file for modal styling

const OrderDetailModal = ({ order, onClose }) => {
    const navigate = useNavigate();

    if (!order) {
        return null;
    }

    const handleTrackDeliveryClick = () => {
        onClose(); // Close the modal
        navigate('/delivery-tracking', {
            state: {
                orderId: order.orderId,
                deliveryId: order.deliveryId,
                agentId: order.agentId,
            }
        });
    };

    const formatAddress = (details) => {
        if (!details) return "N/A";
        return (
            <>
                <p><strong>Name:</strong> {details.firstName || ''} {details.lastName || ''}</p>
                <p><strong>Address:</strong> {details.street || ''}, {details.city || ''}, {details.state || ''} - {details.zipCode || ''}, {details.country || ''}</p>
                <p><strong>Phone:</strong> {details.phone || 'N/A'}</p>
                <p><strong>Email:</strong> {details.email || 'N/A'}</p>
            </>
        );
    };

    const getStatusClassName = (status) => {
        // Only handle PENDING and DELIVERED for styling in the modal
        switch (status?.toLowerCase()) {
            case 'pending': return 'status-pending';
            case 'delivered': return 'status-delivered';
            default: return 'status-unknown'; // For any other unexpected statuses
        }
    };

    // Determine if the "Track Order" button should be shown (only for PENDING orders with tracking info)
    const shouldShowTrackButtonInModal = (order) => {
        const lowerCaseStatus = order.status?.toLowerCase();
        return (lowerCaseStatus === 'pending') && order.deliveryId && order.agentId;
    };


    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>
                <h2 className="modal-title">Order Details</h2>

                <div className="order-summary-header">
                    <p className="order-modal-id">Order ID: <span>#{order.orderId}</span></p>
                    <span className={`order-modal-status ${getStatusClassName(order.status)}`}>
                        {order.status}
                    </span>
                </div>

                <div className="order-details-sections">
                    <div className="detail-section">
                        <h3><FontAwesomeIcon icon={faUtensils} /> Restaurant Info</h3>
                        <p><strong>Name:</strong> {order.restaurantName || 'Unknown'}</p>
                        <p><strong>ID:</strong> {order.restaurantID}</p>
                    </div>

                    <div className="detail-section">
                        <h3><FontAwesomeIcon icon={faUser} /> Customer & Delivery</h3>
                        {formatAddress(order.deliveryDetails)}
                        {order.paymentMethod && <p><strong>Payment Method:</strong> {order.paymentMethod}</p>}
                        <p><strong>Order Time:</strong> {order.orderTime ? new Date(order.orderTime).toLocaleString() : 'N/A'}</p>
                    </div>

                    <div className="detail-section order-items-list">
                        <h3><FontAwesomeIcon icon={faUtensils} /> Ordered Items</h3>
                        {order.orderItems && order.orderItems.length > 0 ? (
                            <ul>
                                {order.orderItems.map((item, index) => (
                                    <li key={index}>
                                        <span>{item.name} x {item.quantity}</span>
                                        <span>₹{(item.price * item.quantity)?.toFixed(2)}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No item details available.</p>
                        )}
                        <p className="total-amount-modal"><strong>Total:</strong> ₹{order.totalAmount?.toFixed(2)}</p>
                    </div>

                    {/* Delivery Agent Information - Conditionally Displayed */}
                    <div className="detail-section delivery-agent-info">
                        <h3><FontAwesomeIcon icon={faMotorcycle} /> Delivery Status</h3>
                        {order.deliveryId ? (
                            <>
                                <p><strong>Delivery ID:</strong> {order.deliveryId}</p>
                                <p><strong>Agent ID:</strong> {order.agentId || 'Not assigned yet'}</p>
                                {shouldShowTrackButtonInModal(order) ? (
                                    <button className="track-delivery-button" onClick={handleTrackDeliveryClick}>
                                        <FontAwesomeIcon icon={faMapMarkerAlt} /> Track Delivery
                                    </button>
                                ) : (
                                    // Simplified message logic
                                    order.status === 'DELIVERED' ? (
                                        <p className="delivered-message">Order has been successfully delivered!</p>
                                    ) : (
                                        <p>Awaiting assignment or further status updates.</p>
                                    )
                                )}
                            </>
                        ) : (
                            <p>Delivery details not yet available (Order not assigned to agent).</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailModal;
