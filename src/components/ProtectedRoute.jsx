import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute Component
 * Prevents unauthorized access to sensitive pages.
 */
const ProtectedRoute = ({ children, adminOnly = false }) => {
    // Check auth state from localStorage
    const user = JSON.parse(localStorage.getItem('currentUser'));

    if (!user) {
        // If not logged in, redirect to login
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && user.role !== 'admin') {
        // If admin-only route and user is not admin, redirect to dashboard
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;
