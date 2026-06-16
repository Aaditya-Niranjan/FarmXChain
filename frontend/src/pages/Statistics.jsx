import React, { useState, useEffect, useCallback } from 'react';
import AdminService from '../services/AdminService';

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white overflow-hidden shadow rounded-lg">
    <div className="p-5">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={`p-3 rounded-md ${color}`}>
            {icon}
          </div>
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="text-lg font-medium text-gray-900">{value}</dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
);

const Statistics = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFarmers: 0,
    pendingVerifications: 0,
    activeUsers: 0,
    verifiedFarmers: 0,
    rejectedUsers: 0,
    suspendedUsers: 0
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
        activeUsers: usersData.data || 0, // Assuming all users are active for now
        verifiedFarmers: 0, // Would need additional API
        rejectedUsers: 0, // Would need additional API
        suspendedUsers: 0 // Would need additional API
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
            <h1 className="text-3xl font-bold text-gray-900">Platform Statistics</h1>
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

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              icon={
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              }
              color="bg-blue-500"
            />

            <StatCard
              title="Total Farmers"
              value={stats.totalFarmers}
              icon={
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              }
              color="bg-green-500"
            />

            <StatCard
              title="Verified Farmers"
              value={stats.verifiedFarmers || 0}
              icon={
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              color="bg-emerald-500"
            />

            <StatCard
              title="Active Users"
              value={stats.activeUsers}
              icon={
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              }
              color="bg-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
              title="Pending Verifications"
              value={stats.pendingVerifications}
              icon={
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              color="bg-yellow-500"
            />

            <StatCard
              title="Rejected Users"
              value={stats.rejectedUsers || 0}
              icon={
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              }
              color="bg-red-500"
            />

            <StatCard
              title="Suspended Users"
              value={stats.suspendedUsers || 0}
              icon={
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              }
              color="bg-orange-500"
            />
          </div>

          <div className="mt-12 bg-white shadow-lg rounded-xl border border-gray-100">
            <div className="px-6 py-8 sm:p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Platform Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">User Distribution</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Farmers</span>
                      <span className="text-lg font-bold text-green-600">{stats.totalFarmers}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Distributors</span>
                      <span className="text-lg font-bold text-blue-600">0</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Retailers</span>
                      <span className="text-lg font-bold text-purple-600">0</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Consumers</span>
                      <span className="text-lg font-bold text-orange-600">0</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Verification Status</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Verified</span>
                      <span className="text-lg font-bold text-green-600">{stats.verifiedFarmers || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Pending</span>
                      <span className="text-lg font-bold text-yellow-600">{stats.pendingVerifications}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Rejected</span>
                      <span className="text-lg font-bold text-red-600">{stats.rejectedUsers || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
