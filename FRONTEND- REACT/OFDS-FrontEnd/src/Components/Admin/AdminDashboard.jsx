import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminDashboard.css';

function AdminDashboard() {
    const auth = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        auth.logout();
        navigate('/');
    };

    const handleManageRestaurantsClick = () => {
        navigate('/admin/manage-restaurants'); // Navigate to the new page
    };

    const handleManageMenuItemsClick = () => {
        navigate('/admin/manage-menuitems'); // Navigate to the new page
    };

    const handleManageUserClick = () => {
        navigate('/admin/manage-user'); // Navigate to the new page
    };

    const handleManageOrderClick = () => {
        navigate('/admin/manage-orders'); // Navigate to the new page
    };
    return (
        
        <div className="admin-dashboard-container">
            <h1 className="admin-dashboard-title">Admin Dashboard</h1>
            <p className="admin-welcome-message">Welcome, Admin! You are logged in as: <span className="admin-user-email">{auth.userEmail}</span></p>
            <p className="admin-user-role">Your role: <span className="admin-role-text">{auth.userRole}</span></p>

            <div className="admin-cards-grid">
                <div className="admin-card">
                    <h2 className="admin-card-title">Manage Users</h2>
                    <p className="admin-card-description">View, add, edit, or delete user accounts.</p>
                    <button className="admin-card-button users-button"
                    onClick={handleManageUserClick}
                    >Go to User Management</button>
                </div>
                <div className="admin-card">
                    <h2 className="admin-card-title">Manage Restaurants</h2>
                    <p className="admin-card-description">Approve new restaurants, update existing ones.</p>
                    <button
                        className="admin-card-button restaurants-button"
                        onClick={handleManageRestaurantsClick}
                    >
                        Go to Restaurant Management
                    </button>
                </div>
                <div className="admin-card">
                    <h2 className="admin-card-title">Manage MenuItems</h2>
                    <p className="admin-card-description">Add new Menus, update existing ones.</p>
                    <button
                        className="admin-card-button restaurants-button"
                        onClick={handleManageMenuItemsClick}
                    >
                        Go to MenuItems Management
                    </button>
                </div>
                <div className="admin-card">
                    <h2 className="admin-card-title">View Orders</h2>
                    <p className="admin-card-description">Monitor all orders and their statuses.</p>
                    <button className="admin-card-button orders-button" 
                    onClick={handleManageOrderClick}
                    >View All Orders</button>
                </div>
                <div className="admin-card">
                    <h2 className="admin-card-title">System Settings</h2>
                    <p className="admin-card-description">Configure application-wide settings.</p>
                    <button className="admin-card-button settings-button">Adjust Settings</button>
                </div>
                
            </div>

            <button
                onClick={handleLogout}
                className="admin-logout-button"
            >
                Logout
            </button>
        </div>
    );
}

export default AdminDashboard;
