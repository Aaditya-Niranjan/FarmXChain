import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import AuthService from './services/AuthService';
import AuthGuard from './utils/AuthGuard';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FarmerProfile from './pages/FarmerProfile';
import CropManagement from './pages/CropManagement';
import UserManagement from './pages/UserManagement';
import FarmerVerification from './pages/FarmerVerification';
import AdminDashboard from './pages/AdminDashboard';
import FarmerList from './pages/FarmerList';
import Statistics from './pages/Statistics';
import UserList from './pages/UserList';
import Marketplace from './pages/Marketplace';
import Orders from './pages/Orders';
import Tracking from './pages/Tracking';
import UserProfile from './pages/UserProfile';
import FarmerDetails from './pages/FarmerDetails';
import AdminOrders from './pages/AdminOrders';
import DistributorDashboard from './pages/DistributorDashboard';
import EarningsHistory from './pages/EarningsHistory';
import Logo from './components/Logo';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(AuthService.isAuthenticated());
  const [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(AuthService.isAuthenticated());
      setCurrentUser(AuthService.getCurrentUser());
    };

    // Check auth on mount
    checkAuth();

    // Listen for storage changes (login/logout)
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);

    // Custom event for auth changes within the same tab
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    window.location.href = '/login';
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {isAuthenticated && (
          <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-neutral-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                    <Logo className="h-9 w-auto" />
                  </div>
                  <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                    {currentUser?.role !== 'ADMIN' && (
                      <Link to="/dashboard" className="text-neutral-600 hover:text-primary-600 inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors">
                        Dashboard
                      </Link>
                    )}
                    {currentUser?.role !== 'DISTRIBUTOR' && (
                      <Link to="/marketplace" className="text-neutral-600 hover:text-primary-600 inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors">
                        Marketplace
                      </Link>
                    )}
                    {currentUser?.role === 'FARMER' && (
                      <>
                        <Link to="/farmer-profile" className="text-neutral-600 hover:text-primary-600 inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors">
                          My Profile
                        </Link>
                        <Link to="/crop-management" className="text-neutral-600 hover:text-primary-600 inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors">
                          Crop Management
                        </Link>
                      </>
                    )}
                    {currentUser?.role === 'ADMIN' && (
                      <>
                        <Link to="/admin-dashboard" className="text-neutral-600 hover:text-primary-600 inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors">
                          Dashboard
                        </Link>
                        <Link to="/user-management" className="text-neutral-600 hover:text-primary-600 inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors">
                          Users
                        </Link>
                        <Link to="/farmer-verification" className="text-neutral-600 hover:text-primary-600 inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors">
                          Verification
                        </Link>
                        <Link to="/statistics" className="text-neutral-600 hover:text-primary-600 inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors">
                          Stats
                        </Link>
                        <Link to="/admin/orders" className="text-neutral-600 hover:text-primary-600 inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors">
                          Transactions
                        </Link>
                      </>
                    )}
                    {currentUser?.role === 'DISTRIBUTOR' && (
                      <>
                        <Link to="/distributor-dashboard" className="text-neutral-600 hover:text-primary-600 inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors">
                          My Shipments
                        </Link>
                        <Link to="/earnings" className="text-neutral-600 hover:text-primary-600 inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors">
                          Earnings
                        </Link>
                      </>
                    )}
                    {(currentUser?.role === 'DISTRIBUTOR' || currentUser?.role === 'RETAILER' || currentUser?.role === 'CONSUMER' || currentUser?.role === 'ADMIN') && (
                      <Link to="/farmer-list" className="text-neutral-600 hover:text-primary-600 inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors">
                        Farmers
                      </Link>
                    )}
                    {isAuthenticated && currentUser?.role !== 'ADMIN' && currentUser?.role !== 'DISTRIBUTOR' && (
                      <Link to="/orders" className="text-neutral-600 hover:text-primary-600 inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors">
                        My Orders
                      </Link>
                    )}
                    {currentUser?.role !== 'FARMER' && currentUser?.role !== 'ADMIN' && (
                      <Link to="/profile" className="text-neutral-600 hover:text-primary-600 inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors">
                        My Profile
                      </Link>
                    )}
                  </div>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-6">
                  {isAuthenticated && currentUser?.role !== 'ADMIN' && (
                    <div className="flex items-center px-4 py-1.5 bg-green-50 border border-green-100 rounded-full shadow-sm group hover:bg-green-100 transition-colors">
                      <div className="flex flex-col items-center mr-3">
                        <svg className="h-4 w-4 text-green-600 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-green-600 font-black uppercase tracking-widest leading-none mb-0.5">Wallet Balance</p>
                        <p className="text-sm font-black text-green-700 leading-none">₹{currentUser?.balance?.toLocaleString() || '0'}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col items-end border-l border-neutral-200 pl-6">
                    <span className="text-sm font-black text-neutral-900 leading-none mb-1">
                      {currentUser?.name}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest leading-none">
                      {currentUser?.role}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center px-3 py-1.5 border border-neutral-300 shadow-sm text-sm font-medium rounded-md text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </nav>
        )}

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          } />
          <Route path="/marketplace" element={
            <AuthGuard>
              <Marketplace />
            </AuthGuard>
          } />
          <Route path="/farmer-profile" element={
            <AuthGuard requiredRole="FARMER">
              <FarmerProfile />
            </AuthGuard>
          } />
          <Route path="/crop-management" element={
            <AuthGuard requiredRole="FARMER">
              <CropManagement />
            </AuthGuard>
          } />
          <Route path="/admin-dashboard" element={
            <AuthGuard requiredRole="ADMIN">
              <AdminDashboard />
            </AuthGuard>
          } />
          <Route path="/user-management" element={
            <AuthGuard requiredRole="ADMIN">
              <UserManagement />
            </AuthGuard>
          } />
          <Route path="/farmer-verification" element={
            <AuthGuard requiredRole="ADMIN">
              <FarmerVerification />
            </AuthGuard>
          } />
          <Route path="/statistics" element={
            <AuthGuard requiredRole="ADMIN">
              <Statistics />
            </AuthGuard>
          } />
          <Route path="/admin/orders" element={
            <AuthGuard requiredRole="ADMIN">
              <AdminOrders />
            </AuthGuard>
          } />
          <Route path="/farmer-list" element={
            <AuthGuard>
              <FarmerList />
            </AuthGuard>
          } />
          <Route path="/farmers/:id" element={
            <AuthGuard>
              <FarmerDetails />
            </AuthGuard>
          } />
          <Route path="/profile" element={
            <AuthGuard>
              <UserProfile />
            </AuthGuard>
          } />
          <Route path="/orders" element={
            <AuthGuard>
              <Orders />
            </AuthGuard>
          } />
          <Route path="/tracking/:orderId" element={
            <AuthGuard>
              <Tracking />
            </AuthGuard>
          } />
          <Route path="/distributors" element={
            <AuthGuard>
              <UserList role="DISTRIBUTOR" title="Distributors" />
            </AuthGuard>
          } />
          <Route path="/distributor-dashboard" element={
            <AuthGuard requiredRole="DISTRIBUTOR">
              <DistributorDashboard />
            </AuthGuard>
          } />
          <Route path="/earnings" element={
            <AuthGuard requiredRole="DISTRIBUTOR">
              <EarningsHistory />
            </AuthGuard>
          } />
          <Route path="/retailers" element={
            <AuthGuard>
              <UserList role="RETAILER" title="Retailers" />
            </AuthGuard>
          } />
          <Route path="/consumers" element={
            <AuthGuard>
              <UserList role="CONSUMER" title="Consumers" />
            </AuthGuard>
          } />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </Router >
  );
}

export default App;
