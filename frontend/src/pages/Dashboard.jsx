import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthService from '../services/AuthService';

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    setUser(currentUser);
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-secondary-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-primary-500"></div>
          <p className="mt-4 text-neutral-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-neutral-900">
            Welcome back, {user.email}
          </h1>
          <p className="mt-2 text-neutral-600">
            You are logged in as <span className="font-semibold text-primary-600">{user.role}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {user.role === 'FARMER' && (
            <>
              <div className="card group">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-primary-50 rounded-lg p-3 group-hover:bg-primary-100 transition-colors">
                      <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">Farmer Profile</h3>
                  <p className="text-neutral-500 text-sm mb-4">Manage your personal information and farm details.</p>
                  <Link to="/farmer-profile" className="text-primary-600 font-medium hover:text-primary-700 inline-flex items-center transition-colors">
                    View Profile <span className="ml-2">→</span>
                  </Link>
                </div>
              </div>

              <div className="card group">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-green-50 rounded-lg p-3 group-hover:bg-green-100 transition-colors">
                      <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">Crop Management</h3>
                  <p className="text-neutral-500 text-sm mb-4">Add new crops and track their journey on the blockchain.</p>
                  <Link to="/crop-management" className="text-green-600 font-medium hover:text-green-700 inline-flex items-center transition-colors">
                    Manage Crops <span className="ml-2">→</span>
                  </Link>
                </div>
              </div>
            </>
          )}

          {user.role === 'ADMIN' && (
            <>
              <div className="card group">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-blue-50 rounded-lg p-3 group-hover:bg-blue-100 transition-colors">
                      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">User Management</h3>
                  <p className="text-neutral-500 text-sm mb-4">Oversee platform users, roles, and permissions.</p>
                  <Link to="/user-management" className="text-blue-600 font-medium hover:text-blue-700 inline-flex items-center transition-colors">
                    Manage Users <span className="ml-2">→</span>
                  </Link>
                </div>
              </div>

              <div className="card group">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-amber-50 rounded-lg p-3 group-hover:bg-amber-100 transition-colors">
                      <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">Farmer Verification</h3>
                  <p className="text-neutral-500 text-sm mb-4">Review and verify farmer documentation.</p>
                  <Link to="/farmer-verification" className="text-amber-600 font-medium hover:text-amber-700 inline-flex items-center transition-colors">
                    Verify Farmers <span className="ml-2">→</span>
                  </Link>
                </div>
              </div>

              <div className="card group">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-purple-50 rounded-lg p-3 group-hover:bg-purple-100 transition-colors">
                      <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">Platform Statistics</h3>
                  <p className="text-neutral-500 text-sm mb-4">Analyze growth, transactions, and user activity.</p>
                  <Link to="/statistics" className="text-purple-600 font-medium hover:text-purple-700 inline-flex items-center transition-colors">
                    View Stats <span className="ml-2">→</span>
                  </Link>
                </div>
              </div>
            </>
          )}

          {(user.role === 'DISTRIBUTOR' || user.role === 'RETAILER' || user.role === 'CONSUMER') && (
            <div className="card group">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-orange-50 rounded-lg p-3 group-hover:bg-orange-100 transition-colors">
                    <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Farmers Directory</h3>
                <p className="text-neutral-500 text-sm mb-4">Browse verified farmers and connect with them.</p>
                <Link to="/farmer-list" className="text-orange-600 font-medium hover:text-orange-700 inline-flex items-center transition-colors">
                  Browse Farmers <span className="ml-2">→</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
