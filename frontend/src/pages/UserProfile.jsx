import React, { useState, useEffect } from 'react';
import UserService from '../services/UserService';
import AuthService from '../services/AuthService';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const currentUser = AuthService.getCurrentUser();
                // Ideally we fetch fresh data from backend, but if endpoint fails we fallback to local storage
                try {
                    const data = await UserService.getUserProfile();
                    setUser(data.data);
                } catch (apiError) {
                    console.warn("API profile fetch failed, using local user data", apiError);
                    setUser(currentUser);
                }
            } catch (err) {
                setError('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-600">
                {error}
            </div>
        );
    }

    if (!user) {
        return <div className="min-h-screen flex items-center justify-center">No user data found.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6 bg-indigo-600">
                        <h3 className="text-lg leading-6 font-medium text-white">User Profile</h3>
                        <p className="mt-1 max-w-2xl text-sm text-indigo-100">Personal details and account information.</p>
                    </div>
                    <div className="border-t border-gray-200">
                        <dl>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">User ID</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.id}</dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Email address</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.email}</dd>
                            </div>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Role</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                        {user.role}
                                    </span>
                                </dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Account Status</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        {user.status || 'Active'}
                                    </span>
                                </dd>
                            </div>
                            <div className="bg-gray-50 px-4 py-8 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 items-center">
                                <dt className="text-sm font-black text-gray-500 uppercase tracking-widest">Wallet Balance</dt>
                                <dd className="mt-1 sm:mt-0 sm:col-span-2">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                        <div className="text-3xl font-black text-green-600">₹{user.balance?.toLocaleString() || '0'}</div>
                                        <div className="flex-1 max-w-xs flex gap-2">
                                            <input
                                                type="number"
                                                placeholder="Amount"
                                                id="topUpAmount"
                                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                            />
                                            <button
                                                onClick={async () => {
                                                    const amount = document.getElementById('topUpAmount').value;
                                                    if (!amount || amount <= 0) return alert('Enter a valid amount');
                                                    try {
                                                        const res = await UserService.topUpWallet(amount);
                                                        setUser(res.data);
                                                        document.getElementById('topUpAmount').value = '';
                                                        alert('Balance updated successfully!');
                                                    } catch (err) {
                                                        alert('Failed to update balance: ' + err);
                                                    }
                                                }}
                                                className="px-6 py-2 bg-green-600 text-white rounded-xl font-bold shadow-lg shadow-green-100 hover:bg-green-700 transition-all active:scale-95 whitespace-nowrap"
                                            >
                                                Add Money
                                            </button>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-wider">Note: This is a simulation wallet for blockchain supply chain demonstrations.</p>
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
