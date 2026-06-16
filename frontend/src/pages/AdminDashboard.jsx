import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import AdminService from '../services/AdminService';

const StatCard = ({ title, value, icon, color, link }) => (
  <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100 hover:shadow-xl transform transition-all duration-300 hover:scale-105">
    <div className="p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={`p-4 rounded-xl ${color} shadow-lg`}>
            {icon}
          </div>
        </div>
        <div className="ml-6 w-0 flex-1">
          <dl>
            <dt className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{title}</dt>
            <dd className="text-3xl font-bold text-gray-900 mt-1">{value}</dd>
          </dl>
        </div>
      </div>
      {link && (
        <div className="mt-6">
          <Link to={link} className="inline-flex items-center text-sm font-semibold text-green-600 hover:text-green-700 transition-colors duration-200">
            View details
            <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFarmers: 0,
    pendingVerifications: 0,
    activeUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStatistics = useCallback(async () => {
    try {
      const [farmersData, usersData, pendingFarmersData] = await Promise.all([
        AdminService.getTotalFarmersCount(),
        AdminService.getTotalUsersCount(),
        AdminService.getPendingFarmers()
      ]);
      setStats({
        totalFarmers: farmersData.data || 0,
        totalUsers: usersData.data || 0,
        pendingVerifications: pendingFarmersData.data ? pendingFarmersData.data.length : 0,
        activeUsers: usersData.data || 0 // Assuming all users are active for now
      });
    } catch (err) {
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStatistics();
  }, [loadStatistics]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
          <p className="mt-4 text-gray-600">Loading statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <button
              onClick={loadStatistics}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Refresh Stats
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Transactions"
              value="View All"
              icon={
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              color="bg-green-600"
              link="/admin/orders"
            />
          </div>

          <div className="mt-8">
            <Link to="/user-management" className="block w-full">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white hover:from-blue-700 hover:to-indigo-800 transition-all transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                      <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-bold">All System Users & Stats</h3>
                      <p className="text-blue-100 mt-1">
                        Manage Farmers, Distributors, Retailers, Consumers. View status, details, and roles.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold mr-4">{stats.totalUsers} Total Users</span>
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
