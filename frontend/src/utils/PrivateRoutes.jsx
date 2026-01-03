import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const PrivateRoutes = ({ requiredRole }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>; // Or a spinner

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (requiredRole && !requiredRole.includes(user.role)) {
        return <Navigate to="/unauthorized" />;
    }

    return <Outlet />;
};

export default PrivateRoutes;
