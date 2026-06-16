import React, { useState, useEffect, useCallback } from 'react';
import UserService from '../services/UserService';

const UserList = ({ role, title }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadUsers = useCallback(async () => {
        try {
            setLoading(true);
            let data;
            switch (role) {
                case 'DISTRIBUTOR':
                    data = await UserService.getAllDistributors();
                    break;
                case 'RETAILER':
                    data = await UserService.getAllRetailers();
                    break;
                case 'CONSUMER':
                    data = await UserService.getAllConsumers();
                    break;
                default:
                    data = await UserService.getUsersByRole(role);
            }
            setUsers(data.data || []);
        } catch (err) {
            setError(`Failed to load ${title.toLowerCase()}`);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [role, title]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
                    <p className="mt-4 text-gray-600">Loading {title.toLowerCase()}...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">{title} Directory</h1>
                        <button
                            onClick={loadUsers}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Refresh
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {users.length === 0 ? (
                            <div className="col-span-full text-center py-12">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No {title.toLowerCase()} found</h3>
                            </div>
                        ) : (
                            users.map((user) => (
                                <div key={user.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
                                    <div className="p-6">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <span className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 font-bold text-xl">
                                                    {user.email.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="ml-4">
                                                <h3 className="text-lg font-medium text-gray-900">{user.email}</h3>
                                                <p className="text-sm text-gray-500">{user.role}</p>
                                            </div>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Status</span>
                                                <span className={`font-medium ${user.status === 'ACTIVE' ? 'text-green-600' : 'text-yellow-600'}`}>
                                                    {user.status || 'Active'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm mt-2">
                                                <span className="text-gray-500">Member Since</span>
                                                <span className="text-gray-900">
                                                    {new Date().toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserList;
