import React, { useState, useEffect } from 'react';
import DistributorService from '../services/DistributorService';

const EarningsHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await DistributorService.getAssignedOrders();
            if (response.success) {
                setOrders(response.data || []);
            } else {
                setError(response.message || 'Failed to fetch earnings data');
            }
        } catch (err) {
            console.error('Error fetching earnings:', err);
            setError('Failed to load earnings history');
        } finally {
            setLoading(false);
        }
    };

    const deliveredOrders = orders.filter(o => o.status === 'DELIVERED' && o.deliveryFee);
    const totalEarnings = deliveredOrders.reduce((sum, o) => sum + parseFloat(o.deliveryFee || 0), 0);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
                <div className="text-center">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-green-500 mx-auto"></div>
                        <div className="absolute inset-0 rounded-full h-24 w-24 border-r-4 border-l-4 border-green-300 animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                    </div>
                    <p className="mt-8 text-green-400 font-bold text-lg tracking-wide animate-pulse">Loading Earnings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="h-14 w-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20">
                                    <span className="text-3xl">💰</span>
                                </div>
                                <div>
                                    <h1 className="text-3xl lg:text-5xl font-black text-white tracking-tight">
                                        Earnings <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">History</span>
                                    </h1>
                                    <p className="text-neutral-400 text-sm font-medium mt-0.5">Track your delivery fees and income</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={fetchOrders}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-green-500/20 transition-all transform hover:scale-105 flex items-center gap-2"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Refresh
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 backdrop-blur-sm text-red-400 px-6 py-4 rounded-2xl mb-8 flex items-center shadow-xl">
                        <svg className="h-6 w-6 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="font-semibold">{error}</span>
                    </div>
                )}

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-8 shadow-2xl hover:shadow-green-500/20 transform transition-all hover:scale-105">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl">
                                <svg className="h-10 w-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-green-100/60 text-xs font-bold uppercase tracking-wider mb-2">Total Earnings</p>
                        <p className="text-5xl font-black text-white tabular-nums">
                            ₹{totalEarnings.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-4 bg-blue-500/10 rounded-2xl">
                                <span className="text-3xl">✅</span>
                            </div>
                        </div>
                        <p className="text-neutral-400 text-xs font-bold uppercase tracking-wider mb-2">Completed Deliveries</p>
                        <p className="text-5xl font-black text-white">{deliveredOrders.length}</p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-4 bg-purple-500/10 rounded-2xl">
                                <span className="text-3xl">📊</span>
                            </div>
                        </div>
                        <p className="text-neutral-400 text-xs font-bold uppercase tracking-wider mb-2">Avg. Fee Per Delivery</p>
                        <p className="text-5xl font-black text-white">
                            ₹{deliveredOrders.length > 0 ? (totalEarnings / deliveredOrders.length).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                        </p>
                    </div>
                </div>

                {/* Earnings Table */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-5">
                        <h2 className="text-2xl font-bold text-white">Your Earnings</h2>
                        <p className="text-green-100 text-sm mt-1">Detailed breakdown of all delivery fees</p>
                    </div>

                    <div className="p-6">
                        {deliveredOrders.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-white/10">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-neutral-400 uppercase tracking-wider">Order ID</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-neutral-400 uppercase tracking-wider">Crop</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-neutral-400 uppercase tracking-wider">Order Total</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-neutral-400 uppercase tracking-wider">Your Fee (7%)</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-neutral-400 uppercase tracking-wider">Delivered On</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-neutral-400 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {deliveredOrders
                                            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                                            .map((order) => (
                                                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="text-sm font-mono font-bold text-green-400">#{order.id.toString().padStart(6, '0')}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm font-semibold text-white">{order.cropName}</div>
                                                        <div className="text-xs text-neutral-500">{order.quantity} {order.unit}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="text-sm font-semibold text-neutral-300">₹{parseFloat(order.totalPrice || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-green-500/20 text-green-400 border border-green-500/30">
                                                            <svg className="h-4 w-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                                                            </svg>
                                                            ₹{parseFloat(order.deliveryFee || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                                                        {new Date(order.updatedAt).toLocaleDateString('en-IN', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="inline-flex px-3 py-1.5 text-xs font-bold rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                                                            ✓ Paid
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <svg className="mx-auto h-24 w-24 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="mt-6 text-2xl font-bold text-white">No Earnings Yet</h3>
                                <p className="mt-3 text-neutral-400 max-w-md mx-auto">Complete deliveries to start earning delivery fees. Your payment history will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EarningsHistory;
