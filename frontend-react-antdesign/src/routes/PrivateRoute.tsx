import React from 'react';
import { Route, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

const PrivateRoute = () => {
    const { authenticated } = useAuth();
    return authenticated ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;

