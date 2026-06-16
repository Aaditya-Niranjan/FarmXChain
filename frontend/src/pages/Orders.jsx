import React, { useState, useEffect } from 'react';
import OrderService from '../services/OrderService';
import LogisticsService from '../services/LogisticsService';
import FarmerService from '../services/FarmerService';
import AuthService from '../services/AuthService';
import { Link } from 'react-router-dom';

const Orders = () => {
    const user = AuthService.getCurrentUser();
    const isFarmer = user?.role === 'FARMER';
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [statusUpdating, setStatusUpdating] = useState(null);
    const [activeTab, setActiveTab] = useState('ACTIVE'); // 'ACTIVE' or 'PAST'

    // Distributor assignment state
    const [distributors, setDistributors] = useState([]);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedDistributor, setSelectedDistributor] = useState('');

    useEffect(() => {
        loadOrders();
        if (isFarmer) {
            loadDistributors();
        }
    }, []);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const response = isFarmer ? await OrderService.getMySales() : await OrderService.getMyPurchases();
            setOrders(response.data || []);
        } catch (err) {
            setError('Failed to load orders');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const loadDistributors = async () => {
        try {
            const response = await FarmerService.getDistributors();
            setDistributors(response.data || []);
        } catch (err) {
            console.error('Failed to load distributors:', err);
        }
    };

    const handleAssignDistributor = async () => {
        console.log('handleAssignDistributor called');
        console.log('Selected Order:', selectedOrder);
        console.log('Selected Distributor:', selectedDistributor);

        if (!selectedDistributor || !selectedOrder) {
            console.error('Missing data:', { selectedDistributor, selectedOrder });
            setError('Please select a distributor');
            return;
        }

        try {
            setError('');
            setSuccess('');
            console.log('Calling assignOrderToDistributor with:', selectedOrder.id, selectedDistributor);

            const response = await FarmerService.assignOrderToDistributor(selectedOrder.id, selectedDistributor);
            console.log('Assignment response:', response);

            setSuccess('Distributor assigned successfully! Order is now ASSIGNED.');
            setShowAssignModal(false);
            setSelectedOrder(null);
            setSelectedDistributor('');
            await loadOrders();
        } catch (err) {
            console.error('Assignment error:', err);
            const errorMessage = err.message || err.error || JSON.stringify(err) || 'Failed to assign distributor';
            setError(errorMessage);
        }
    };

    const handleUpdateStatus = async (orderId, status) => {
        try {
            setError('');
            setSuccess('');
            setStatusUpdating(orderId);
            await OrderService.updateOrderStatus(orderId, status);
            await AuthService.getProfile(); // Refresh balance
            await loadOrders();
            const actionText = status === 'ACCEPTED' ? 'approved' : status === 'REJECTED' ? 'rejected' : 'finalized';
            setSuccess(`Order ${actionText} successfully`);
        } catch (err) {
            setError(err.message || err.error || 'Failed to update status');
            console.error(err);
        } finally {
            setStatusUpdating(null);
        }
    };

    const handleStartShipment = async (orderId) => {
        try {
            setError('');
            setSuccess('');
            setStatusUpdating(orderId);
            await LogisticsService.startShipment(orderId);
            await AuthService.getProfile(); // Refresh balance
            await loadOrders();
            setSuccess('Shipment initiated successfully');
        } catch (err) {
            setError(err.message || 'Failed to start shipment');
            console.error(err);
        } finally {
            setStatusUpdating(null);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800';
            case 'ACCEPTED': return 'bg-blue-100 text-blue-800';
            case 'ASSIGNED': return 'bg-cyan-100 text-cyan-800';
            case 'IN_TRANSIT': return 'bg-purple-100 text-purple-800';
            case 'REJECTED': return 'bg-red-100 text-red-800';
            case 'SHIPPED': return 'bg-indigo-100 text-indigo-800';
            case 'DELIVERED': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredOrders = orders.filter(order => {
        if (activeTab === 'ACTIVE') {
            return ['PENDING', 'ACCEPTED', 'ASSIGNED', 'IN_TRANSIT', 'SHIPPED', 'DELIVERED'].includes(order.status);
        } else {
            return ['COMPLETED', 'REJECTED', 'CANCELLED'].includes(order.status);
        }
    });

    return (
        <div className="min-h-screen bg-neutral-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-neutral-900 tracking-tight">
                            {isFarmer ? 'Sales Hub' : 'My Purchases'}
                        </h1>
                        <p className="text-neutral-500 mt-2 font-medium">
                            {isFarmer ? 'Manage your incoming orders and assign distributors.' : 'Track your crop purchases and deliveries.'}
                        </p>
                    </div>
                    <div className="flex items-center space-x-2 bg-white p-1.5 rounded-2xl shadow-sm border border-neutral-200">
                        <button
                            onClick={() => setActiveTab('ACTIVE')}
                            className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'ACTIVE' ? 'bg-green-600 text-white shadow-lg shadow-green-100 hover:scale-105' : 'text-neutral-500 hover:bg-neutral-50'}`}
                        >
                            Active
                        </button>
                        <button
                            onClick={() => setActiveTab('PAST')}
                            className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'PAST' ? 'bg-green-600 text-white shadow-lg shadow-green-100 hover:scale-105' : 'text-neutral-500 hover:bg-neutral-50'}`}
                        >
                            Past
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-2xl mb-8 flex items-center shadow-sm">
                        <svg className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="font-semibold">{error}</span>
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-6 py-4 rounded-2xl mb-8 flex items-center shadow-sm">
                        <svg className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="font-semibold">{success}</span>
                    </div>
                )}

                {loading ? (
                    <div className="flex flex-col justify-center items-center py-24">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
                        <p className="mt-4 text-neutral-500 font-bold animate-pulse">Synchronizing transactions...</p>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-xl border border-neutral-100">
                        <div className="bg-neutral-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="h-10 w-10 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-neutral-900">No {activeTab === 'ACTIVE' ? 'Active' : 'Past'} Orders</h3>
                        <p className="text-neutral-500 mt-2 max-w-xs mx-auto">
                            {activeTab === 'ACTIVE'
                                ? 'Your ongoing supply chain activities will appear here.'
                                : 'Completed and finalized orders will be archived here.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8">
                        {filteredOrders.map((order) => (
                            <div key={order.id} className="group bg-white rounded-[2rem] shadow-sm border border-neutral-100 overflow-hidden hover:shadow-2xl hover:border-green-100 transition-all duration-500">
                                <div className="p-8 flex flex-col lg:flex-row gap-8">
                                    {/* Order Visual Segment */}
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-14 w-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 font-black text-xl shadow-inner">
                                                #{order.id}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-2xl font-black text-neutral-900 leading-none">{order.cropName}</h3>
                                                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm ${getStatusColor(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <p className="text-neutral-400 text-sm mt-1 font-medium">Placed on {new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
                                            <div className="p-4 bg-neutral-50 rounded-2xl">
                                                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-1">Quantity</p>
                                                <p className="text-lg font-bold text-neutral-800">{order.quantity} <span className="text-xs text-neutral-400">kg</span></p>
                                            </div>
                                            <div className="p-4 bg-neutral-50 rounded-2xl">
                                                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-1">{isFarmer ? 'Buyer' : 'Farmer'}</p>
                                                <p className="text-lg font-bold text-neutral-800 truncate">{isFarmer ? order.buyerName : order.farmName}</p>
                                            </div>
                                            <div className="p-4 bg-green-50/50 rounded-2xl border border-green-50/50">
                                                <p className="text-[10px] text-green-600/60 font-bold uppercase tracking-widest mb-1">Revenue</p>
                                                <p className="text-lg font-black text-green-700">₹{order.totalPrice}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Segment */}
                                    <div className="lg:w-72 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-neutral-100 pt-8 lg:pt-0 lg:pl-12">
                                        <div className="flex flex-col gap-3">
                                            {isFarmer && order.status === 'PENDING' && (
                                                <div className="flex flex-col gap-3 w-full">
                                                    <button
                                                        onClick={() => handleUpdateStatus(order.id, 'ACCEPTED')}
                                                        disabled={statusUpdating === order.id}
                                                        className="w-full px-8 py-4 bg-green-600 text-white rounded-2xl font-black text-sm tracking-wide shadow-lg shadow-green-100 transition-all hover:bg-green-700 hover:-translate-y-1 active:scale-95 disabled:opacity-50"
                                                    >
                                                        APPROVE ORDER
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus(order.id, 'REJECTED')}
                                                        disabled={statusUpdating === order.id}
                                                        className="w-full px-8 py-4 bg-white text-red-600 border-2 border-red-50 rounded-2xl font-black text-sm tracking-wide transition-all hover:bg-red-50 active:scale-95 disabled:opacity-50"
                                                    >
                                                        REJECT
                                                    </button>
                                                </div>
                                            )}

                                            {isFarmer && order.status === 'ACCEPTED' && (
                                                <button
                                                    onClick={() => {
                                                        setSelectedOrder(order);
                                                        setShowAssignModal(true);
                                                    }}
                                                    className="w-full px-8 py-5 bg-purple-600 text-white rounded-2xl font-black text-sm tracking-wide shadow-xl shadow-purple-100 transition-all hover:bg-purple-700 hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    ASSIGN DISTRIBUTOR
                                                </button>
                                            )}

                                            {isFarmer && (order.status === 'ASSIGNED' || order.status === 'IN_TRANSIT') && (
                                                <div className="w-full px-8 py-5 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border-2 border-purple-200">
                                                    <p className="text-xs text-purple-600 font-bold uppercase tracking-widest mb-1">Assigned Distributor</p>
                                                    <p className="text-lg font-bold text-purple-900">{order.distributorName || 'Distributor'}</p>
                                                    <p className="text-xs text-purple-500 mt-2">Shipment is being handled</p>
                                                </div>
                                            )}

                                            {(order.status === 'IN_TRANSIT' || order.status === 'SHIPPED' || order.status === 'DELIVERED') && (
                                                <div className="flex flex-col gap-3">
                                                    {!isFarmer && order.status === 'DELIVERED' && (
                                                        <button
                                                            onClick={() => handleUpdateStatus(order.id, 'COMPLETED')}
                                                            disabled={statusUpdating === order.id}
                                                            className="w-full px-8 py-5 bg-green-600 text-white rounded-2xl font-black text-sm tracking-wide shadow-xl shadow-green-100 transition-all hover:bg-green-700 hover:-translate-y-1 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                            CONFIRM RECEIPT
                                                        </button>
                                                    )}
                                                    <Link
                                                        to={`/tracking/${order.id}`}
                                                        className="w-full px-8 py-5 bg-neutral-900 text-white rounded-2xl font-black text-sm tracking-wide shadow-xl shadow-neutral-200 transition-all hover:bg-black hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 text-center"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        TRACK SHIPMENT
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {order.blockchainTxHash && (
                                    <div className="bg-neutral-900 p-4 mx-8 mb-8 rounded-2xl flex items-center justify-between group-hover:bg-green-950 transition-colors duration-500">
                                        <div className="flex items-center gap-3">
                                            <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]"></div>
                                            <p className="text-[10px] text-green-400 font-black uppercase tracking-[0.2em]">Blockchain Secured Transaction</p>
                                        </div>
                                        <p className="text-[10px] text-neutral-500 font-mono truncate max-w-[200px] lg:max-w-md">{order.blockchainTxHash}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Assign Distributor Modal */}
                {showAssignModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full transform transition-all">
                            <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-t-3xl">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-2xl font-bold text-white">Assign Distributor</h3>
                                    <button onClick={() => setShowAssignModal(false)} className="text-white hover:text-gray-200">
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="px-8 py-6 space-y-4">
                                <div className="bg-gray-50 p-4 rounded-2xl">
                                    <p className="text-xs text-gray-500 font-bold uppercase mb-1">Order Details</p>
                                    <p className="text-lg font-bold text-gray-900">{selectedOrder?.cropName}</p>
                                    <p className="text-sm text-gray-600">Quantity: {selectedOrder?.quantity} kg</p>
                                    <p className="text-sm text-gray-600">Buyer: {selectedOrder?.buyerName}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Select Distributor</label>
                                    <select
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition font-medium"
                                        value={selectedDistributor}
                                        onChange={(e) => setSelectedDistributor(e.target.value)}
                                    >
                                        <option value="">Choose a distributor...</option>
                                        {distributors.map(dist => (
                                            <option key={dist.id} value={dist.id}>
                                                {dist.name} - {dist.email}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                                    <p className="text-sm text-yellow-700">
                                        Once assigned, the distributor will be able to create and manage shipment for this order.
                                    </p>
                                </div>

                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        onClick={() => setShowAssignModal(false)}
                                        className="px-6 py-3 text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAssignDistributor}
                                        disabled={!selectedDistributor}
                                        className="px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-xl shadow-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                    >
                                        Assign Distributor
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
