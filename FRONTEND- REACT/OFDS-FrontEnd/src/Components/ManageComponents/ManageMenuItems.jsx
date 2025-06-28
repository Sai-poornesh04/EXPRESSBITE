import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './ManageMenuItems.css';

function ManageMenuItems() {
    const navigate = useNavigate();
    const auth = useAuth();

    const [menuItem, setMenuItem] = useState({
        name: '',
        description: '',
        price: '',
        restaurantID: ''
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState('');
    const [menuItems, setMenuItems] = useState([]);
    const [editingId, setEditingId] = useState(null);

    const API_BASE_URL = 'http://localhost:1111/menu';

    useEffect(() => {
        fetchMenuItems();
    }, []);

    const fetchMenuItems = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/viewMenu`, {
                headers: {
                    'Authorization': `Bearer ${auth.jwtToken}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setMenuItems(data);
            }
        } catch (error) {
            setMessage('Failed to load menu items');
            setMessageType('error');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMenuItem(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAdd = async (e) => {
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
            if (!menuItem.name || !menuItem.price || !menuItem.restaurantID) {
                throw new Error("Name, Price, and Restaurant ID are required.");
            }

            const response = await fetch(`${API_BASE_URL}/addMenu`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.jwtToken}`
                },
                body: JSON.stringify({
                    ...menuItem,
                    price: parseFloat(menuItem.price)
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add menu item.');
            }

            const newMenuItem = await response.json();
            setMessage(`Menu item '${newMenuItem.name}' added successfully with ID: ${newMenuItem.itemID}`);
            setMessageType('success');
            setMenuItem({
                name: '',
                description: '',
                price: '',
                restaurantID: ''
            });
            fetchMenuItems();

        } catch (err) {
            setMessage(`Error: ${err.message || 'Something went wrong.'}`);
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (id) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/updateMenu/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.jwtToken}`
                },
                body: JSON.stringify({
                    ...menuItem,
                    price: parseFloat(menuItem.price)
                })
            });

            if (!response.ok) throw new Error('Failed to update menu item');

            setMessage('Menu item updated successfully');
            setMessageType('success');
            setEditingId(null);
            setMenuItem({
                name: '',
                description: '',
                price: '',
                restaurantID: ''
            });
            fetchMenuItems();

        } catch (error) {
            setMessage(error.message);
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this menu item?')) {
            try {
                const response = await fetch(`${API_BASE_URL}/deleteMenu/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${auth.jwtToken}`
                    }
                });

                if (!response.ok) throw new Error('Failed to delete menu item');

                setMessage('Menu item deleted successfully');
                setMessageType('success');
                fetchMenuItems();

            } catch (error) {
                setMessage(error.message);
                setMessageType('error');
            }
        }
    };

    const handleEdit = (item) => {
        setEditingId(item.itemID);
        setMenuItem({
            name: item.name,
            description: item.description,
            price: item.price.toString(),
            restaurantID: item.restaurantID
        });
    };

    return (
        <div className="manage-menu-items-container">
            <h1 className="page-title">{editingId ? 'Update Menu Item' : 'Add New Menu Item'}</h1>

            {message && (
                <div className={`notification-message ${messageType}`}>
                    {message}
                </div>
            )}

            <form onSubmit={editingId ? (e) => {
                e.preventDefault();
                handleUpdate(editingId);
            } : handleAdd} className="menu-item-form">
                <div className="form-group">
                    <label htmlFor="name">Item Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={menuItem.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={menuItem.description}
                        onChange={handleChange}
                        rows="3"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="price">Price:</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={menuItem.price}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="restaurantID">Restaurant ID:</label>
                    <input
                        type="number"
                        id="restaurantID"
                        name="restaurantID"
                        value={menuItem.restaurantID}
                        onChange={handleChange}
                        required
                        min="1"
                    />
                </div>

                <div className="form-actions">
                    <button type="submit" className="submit-button" disabled={loading}>
                        {loading ? 'Processing...' : editingId ? 'Update Menu Item' : 'Add Menu Item'}
                    </button>
                    {editingId && (
                        <button type="button" className="cancel-button" onClick={() => {
                            setEditingId(null);
                            setMenuItem({
                                name: '',
                                description: '',
                                price: '',
                                restaurantID: ''
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

            <h2 className="page-title">Manage Menu Items</h2>
            <table className="menu-items-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Restaurant ID</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {menuItems.map((item) => (
                        <tr key={item.itemID}>
                            <td>{item.name}</td>
                            <td>{item.description}</td>
                            <td>Rs.{parseFloat(item.price).toFixed(2)}</td>
                            <td>{item.restaurantID}</td>
                            <td>
                                <button
                                    onClick={() => handleEdit(item)}
                                    className="edit-button"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(item.itemID)}
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

export default ManageMenuItems;