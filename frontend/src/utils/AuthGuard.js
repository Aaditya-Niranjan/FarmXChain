import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

const AuthGuard = ({ children, requiredRole }) => {
  const isAuthenticated = AuthService.isAuthenticated();
  const currentUser = AuthService.getCurrentUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && currentUser.role !== requiredRole) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default AuthGuard;
