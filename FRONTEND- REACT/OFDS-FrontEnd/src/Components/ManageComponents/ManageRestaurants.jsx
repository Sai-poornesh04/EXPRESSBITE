import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './ManageRestaurants.css'; // New CSS file for this component

function ManageRestaurants() {
    const navigate = useNavigate();
    const auth = useAuth();
    
    const [restaurant, setRestaurant] = useState({
        name: '',
        address: '',
        phoneNumber: '',
        email: ''
        // Add more fields here as per your backend Restaurant model (e.g., cuisine, lat/long)
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null); // For success or error messages
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'
    const [restaurants, setRestaurants] = useState([]);
    const [editingId, setEditingId] = useState(null);

    const API_BASE_URL = 'http://localhost:1111/restaurant'; // Assuming your Restaurant Service base URL

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const fetchRestaurants = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/viewAllRestaurant`, {
                headers: {
                    'Authorization': `Bearer ${auth.jwtToken}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setRestaurants(data);
            }
        } catch (error) {
            console.error('Error fetching restaurants:', error);
            setMessage('Failed to load restaurants');
            setMessageType('error');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRestaurant(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setMessageType('');

        if (!auth.jwtToken) {
            setMessage("Authentication token not found. Please log in as an administrator.");
            setMessageType('error');
            setLoading(false);
            return;
        }

        try {
            // Validate basic fields
            if (!restaurant.name || !restaurant.address || !restaurant.phoneNumber || !restaurant.email) {
                throw new Error("All fields are required.");
            }
            if (!/^[7-9][0-9]{9}$/.test(restaurant.phoneNumber)) {
                throw new Error("Phone number must be 10 digits and start with 7, 8, or 9.");
            }
            if (!/\S+@\S+\.\S+/.test(restaurant.email)) {
                throw new Error("Invalid email address.");
            }

            const response = await fetch(`${API_BASE_URL}/addRestaurant`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.jwtToken}`
                },
                body: JSON.stringify(restaurant)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add restaurant.');
            }

            const newRestaurant = await response.json();
            setMessage(`Restaurant '${newRestaurant.name}' added successfully with ID: ${newRestaurant.restaurantId}`);
            setMessageType('success');
            setRestaurant({ // Clear form fields
                name: '',
                address: '',
                phoneNumber: '',
                email: ''
            });
            console.log('New restaurant added:', newRestaurant);
            fetchRestaurants();

        } catch (err) {
            console.error('Error adding restaurant:', err);
            setMessage(`Error: ${err.message || 'Something went wrong.'}`);
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/updateRestaurant/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.jwtToken}`
                },
                body: JSON.stringify(restaurant)
            });

            if (!response.ok) throw new Error('Failed to update restaurant');
            
            setMessage('Restaurant updated successfully');
            setMessageType('success');
            setEditingId(null);
            // Clear form after successful update
            setRestaurant({
                name: '',
                address: '',
                phoneNumber: '',
                email: ''
            });
            fetchRestaurants();
            
        } catch (error) {
            setMessage(error.message);
            setMessageType('error');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this restaurant?')) {
            try {
                const response = await fetch(`${API_BASE_URL}/deleteRestaurant/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${auth.jwtToken}`
                    }
                });

                if (!response.ok) throw new Error('Failed to delete restaurant');
                
                setMessage('Restaurant deleted successfully');
                setMessageType('success');
                fetchRestaurants();
                
            } catch (error) {
                setMessage(error.message);
                setMessageType('error');
            }
        }
    };

    const handleEdit = (restaurant) => {
        setEditingId(restaurant.restaurantId);
        setRestaurant(restaurant);
    };

    return (
        <div className="manage-restaurants-container">
            <h1 className="page-title">{editingId ? 'Update Restaurant' : 'Add New Restaurant'}</h1>

            {message && (
                <div className={`notification-message ${messageType}`}>
                    {message}
                </div>
            )}

            <form onSubmit={editingId ? (e) => {
                e.preventDefault();
                handleUpdate(editingId);
            } : handleSubmit} className="restaurant-form">
                <div className="form-group">
                    <label htmlFor="name">Restaurant Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={restaurant.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="address">Address:</label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={restaurant.address}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="phoneNumber">Phone Number:</label>
                    <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={restaurant.phoneNumber}
                        onChange={handleChange}
                        required
                        pattern="[7-9]{1}[0-9]{9}" // Basic pattern for 10 digits starting with 7, 8, or 9
                        title="Phone number must be 10 digits and start with 7, 8, or 9"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={restaurant.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-actions">
                    <button type="submit" className="submit-button" disabled={loading}>
                        {loading ? 'Processing...' : editingId ? 'Update Restaurant' : 'Add Restaurant'}
                    </button>
                    {editingId && (
                        <button type="button" className="cancel-button" onClick={() => {
                            setEditingId(null);
                            setRestaurant({
                                name: '',
                                address: '',
                                phoneNumber: '',
                                email: ''
                            });
                        }}>
                            Cancel Edit
                        </button>
                    )}
                    <button type="button" className="back-button" onClick={() => navigate('/admin')}>
                        Back to Dashboard
                    </button>
                </div>
            </form>

            <h2 className="page-title">Manage Restaurants</h2>
            <table className="restaurants-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Phone Number</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {restaurants.map((rest) => (
                        <tr key={rest.restaurantId}>
                            <td>{rest.name}</td>
                            <td>{rest.address}</td>
                            <td>{rest.phoneNumber}</td>
                            <td>{rest.email}</td>
                            <td>
                                <button 
                                    onClick={() => handleEdit(rest)}
                                    className="edit-button"
                                >
                                    Edit
                                </button>
                                <button 
                                    onClick={() => handleDelete(rest.restaurantId)}
                                    className="delete-button"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ManageRestaurants;
