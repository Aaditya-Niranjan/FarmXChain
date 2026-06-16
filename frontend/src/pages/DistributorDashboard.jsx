import React, { useState, useEffect } from 'react';
import DistributorService from '../services/DistributorService';

const DistributorDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [activeTab, setActiveTab] = useState('assigned');

    // Modal states
    const [showCreateShipment, setShowCreateShipment] = useState(false);
    const [showUpdateStatus, setShowUpdateStatus] = useState(false);
    const [showDelivery, setShowDelivery] = useState(false);
    const [showLogs, setShowLogs] = useState(false);

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedShipment, setSelectedShipment] = useState(null);
    const [shipmentLogs, setShipmentLogs] = useState([]);

    // Form states
    const [shipmentForm, setShipmentForm] = useState({
        orderId: '',
        origin: '',
        destination: '',
        transportMode: 'TRUCK'
    });

    const [statusForm, setStatusForm] = useState({
        status: 'IN_TRANSIT',
        currentLocation: '',
        temperature: '',
        humidity: '',
        notes: ''
    });

    const [deliveryForm, setDeliveryForm] = useState({
        shipmentId: '',
        deliveryNotes: ''
    });

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        filterOrders();
    }, [activeTab, orders]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError('');

            // Check if user has token
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication required. Please log in again.');
                setLoading(false);
                return;
            }

            // Check if user has correct role
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                if (user.role !== 'DISTRIBUTOR') {
                    setError(`Access denied. This page is only for distributors. Your role: ${user.role}`);
                    setLoading(false);
                    return;
                }
            }

            const response = await DistributorService.getAssignedOrders();
            if (response.success) {
                setOrders(response.data || []);
            } else {
                setError(response.message || 'Failed to fetch orders');
            }
        } catch (err) {
            console.error('Full error:', err);

            // Handle different types of errors
            if (err.response) {
                // Server responded with error status
                const status = err.response.status;
                const message = err.response.data?.message || err.response.data?.error;

                if (status === 401) {
                    setError('Authentication failed. Please log in again.');
                } else if (status === 403) {
                    setError('Access forbidden. You do not have distributor permissions.');
                } else if (status === 404) {
                    setError('Distributor endpoint not found. Please ensure backend is running.');
                } else if (message) {
                    setError(`Error: ${message}`);
                } else {
                    setError(`Server error (${status}). Please try again later.`);
                }
            } else if (err.request) {
                // Request made but no response
                setError('Cannot connect to server. Please ensure backend is running on http://localhost:8080');
            } else {
                // Other errors
                setError(err.message || 'An unexpected error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    const filterOrders = () => {
        let filtered = [];
        switch (activeTab) {
            case 'assigned':
                filtered = orders.filter(o => o.status === 'ASSIGNED');
                break;
            case 'in-transit':
                filtered = orders.filter(o => o.status === 'IN_TRANSIT');
                break;
            case 'delivered':
                filtered = orders.filter(o => o.status === 'DELIVERED');
                break;
            case 'all':
            default:
                filtered = orders;
        }
        setFilteredOrders(filtered);
    };

    const handleCreateShipment = async (e) => {
        e.preventDefault();
        try {
            setError('');
            const response = await DistributorService.createShipment(shipmentForm);
            if (response.success) {
                setSuccess('Shipment created successfully!');
                setShowCreateShipment(false);
                fetchOrders();
                setTimeout(() => setSuccess(''), 3000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create shipment');
        }
    };

    const handleUpdateStatus = async (e) => {
        e.preventDefault();
        try {
            setError('');
            const response = await DistributorService.updateShipmentStatus(
                selectedShipment.id,
                statusForm
            );
            if (response.success) {
                setSuccess('Shipment status updated successfully!');
                setShowUpdateStatus(false);
                fetchOrders();
                setTimeout(() => setSuccess(''), 3000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update shipment status');
        }
    };

    const handleConfirmDelivery = async (e) => {
        e.preventDefault();
        try {
            setError('');
            const response = await DistributorService.confirmDelivery(deliveryForm);
            if (response.success) {
                setSuccess(`Delivery confirmed! Custody Hash: ${response.data.custodyHash}`);
                setShowDelivery(false);
                fetchOrders();
                setTimeout(() => setSuccess(''), 5000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to confirm delivery');
        }
    };

    const openCreateShipmentModal = (order) => {
        console.log('=== CREATE SHIPMENT DEBUG ===');
        console.log('Full order object:', order);
        console.log('Order ID:', order.id);
        console.log('Farm Name:', order.farmName);
        console.log('Delivery Address:', order.deliveryAddress);
        console.log('============================');

        setSelectedOrder(order);
        setShipmentForm({
            orderId: order.id,
            origin: order.farmName || '',
            destination: order.deliveryAddress || 'NO ADDRESS IN ORDER', // Debug message
            transportMode: 'TRUCK'
        });
        setShowCreateShipment(true);
    };

    const openUpdateStatusModal = async (order) => {
        try {
            const shipmentResponse = await DistributorService.getShipmentByOrderId(order.id);
            if (shipmentResponse.success) {
                setSelectedShipment(shipmentResponse.data);
                setStatusForm({
                    status: 'IN_TRANSIT',
                    currentLocation: shipmentResponse.data.currentLocation || '',
                    temperature: '',
                    humidity: '',
                    notes: ''
                });
                setShowUpdateStatus(true);
            }
        } catch (err) {
            setError('Failed to fetch shipment details');
        }
    };

    const openDeliveryModal = async (order) => {
        try {
            const shipmentResponse = await DistributorService.getShipmentByOrderId(order.id);
            if (shipmentResponse.success) {
                setDeliveryForm({
                    shipmentId: shipmentResponse.data.id,
                    deliveryNotes: ''
                });
                setShowDelivery(true);
            }
        } catch (err) {
            setError('Failed to fetch shipment details');
        }
    };

    const openLogsModal = async (order) => {
        try {
            const shipmentResponse = await DistributorService.getShipmentByOrderId(order.id);
            if (shipmentResponse.success) {
                const logsResponse = await DistributorService.getShipmentLogs(shipmentResponse.data.id);
                if (logsResponse.success) {
                    setShipmentLogs(logsResponse.data || []);
                    setShowLogs(true);
                }
            }
        } catch (err) {
            setError('Failed to fetch shipment logs');
        }
    };

    const getStatusBadge = (status) => {
        const variants = {
            'ASSIGNED': 'bg-blue-100 text-blue-800',
            'IN_TRANSIT': 'bg-yellow-100 text-yellow-800',
            'DELIVERED': 'bg-green-100 text-green-800',
            'COMPLETED': 'bg-purple-100 text-purple-800'
        };
        return (
            <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${variants[status] || 'bg-gray-100 text-gray-800'}`}>
                {status}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600 text-lg">Loading shipments...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Distributor Dashboard</h1>
                        <p className="mt-1 text-sm text-gray-500">Manage your shipments and deliveries</p>
                    </div>
                    <button
                        onClick={fetchOrders}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg transition-all transform hover:scale-105"
                    >
                        <svg className="h-5 w-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                    </button>
                </div>

                {/* Alerts */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg shadow-md animate-fade-in">
                        <div className="flex items-center">
                            <svg className="h-5 w-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm text-red-700 font-medium">{error}</p>
                            <button onClick={() => setError('')} className="ml-auto text-red-500 hover:text-red-700">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-lg shadow-md animate-fade-in">
                        <div className="flex items-center">
                            <svg className="h-5 w-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm text-green-700 font-medium">{success}</p>
                            <button onClick={() => setSuccess('')} className="ml-auto text-green-500 hover:text-green-700">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                    {[
                        { title: 'Assigned', value: orders.filter(o => o.status === 'ASSIGNED').length, color: 'from-blue-500 to-blue-600', icon: '📦' },
                        { title: 'In Transit', value: orders.filter(o => o.status === 'IN_TRANSIT').length, color: 'from-yellow-500 to-yellow-600', icon: '🚚' },
                        { title: 'Delivered', value: orders.filter(o => o.status === 'DELIVERED').length, color: 'from-green-500 to-green-600', icon: '✅' },
                        { title: 'Total Orders', value: orders.length, color: 'from-purple-500 to-purple-600', icon: '📊' }
                    ].map((stat, idx) => (
                        <div key={idx} className="bg-white overflow-hidden shadow-xl rounded-xl border border-gray-100 hover:shadow-2xl transform transition-all duration-300 hover:scale-105">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className={`p-4 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                                        <span className="text-3xl">{stat.icon}</span>
                                    </div>
                                    <div className="ml-6">
                                        <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{stat.title}</p>
                                        <p className="text-4xl font-bold text-gray-900 mt-1">{stat.value}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>


                <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100">
                    {/* Tabs */}
                    <div className="border-b border-gray-200 bg-gray-50">
                        <div className="flex overflow-x-auto">
                            {[
                                { key: 'assigned', label: 'Assigned', count: orders.filter(o => o.status === 'ASSIGNED').length },
                                { key: 'in-transit', label: 'In Transit', count: orders.filter(o => o.status === 'IN_TRANSIT').length },
                                { key: 'delivered', label: 'Delivered', count: orders.filter(o => o.status === 'DELIVERED').length },
                                { key: 'all', label: 'All Orders', count: orders.length }
                            ].map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`px-6 py-4 text-sm font-semibold whitespace-nowrap transition-all ${activeTab === tab.key
                                        ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                        }`}
                                >
                                    {tab.label} <span className="ml-2 px-2 py-1 bg-gray-200 rounded-full text-xs">{tab.count}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {['Order ID', 'Crop', 'Quantity', 'Buyer', 'Delivery Address', 'Status', 'Actions'].map((header) => (
                                        <th key={header} className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center">
                                            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                            </svg>
                                            <h3 className="mt-4 text-lg font-medium text-gray-900">No orders found</h3>
                                            <p className="mt-1 text-sm text-gray-500">There are no shipments in this category.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map(order => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">#{order.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{order.cropName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.quantity} kg</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.buyerName}</td>
                                            <td className="px-6 py-4 whitespace-normal text-sm text-gray-500 max-w-xs truncate" title={order.deliveryAddress}>
                                                {order.deliveryAddress || <span className="text-red-400 italic">Not provided</span>}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(order.status)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                                {order.status === 'ASSIGNED' && (
                                                    <button
                                                        onClick={() => openCreateShipmentModal(order)}
                                                        className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow transition-all transform hover:scale-105"
                                                    >
                                                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                        </svg>
                                                        Create Shipment
                                                    </button>
                                                )}
                                                {order.status === 'IN_TRANSIT' && (
                                                    <>
                                                        <button
                                                            onClick={() => openUpdateStatusModal(order)}
                                                            className="inline-flex items-center px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white text-xs font-semibold rounded-lg shadow transition-all"
                                                        >
                                                            Update
                                                        </button>
                                                        <button
                                                            onClick={() => openDeliveryModal(order)}
                                                            className="inline-flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg shadow transition-all"
                                                        >
                                                            Deliver
                                                        </button>
                                                    </>
                                                )}
                                                {(order.status === 'IN_TRANSIT' || order.status === 'DELIVERED') && (
                                                    <button
                                                        onClick={() => openLogsModal(order)}
                                                        className="inline-flex items-center px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg shadow transition-all"
                                                    >
                                                        Logs
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div >

            {/* Create Shipment Modal */}
            {
                showCreateShipment && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all animate-fade-in">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-2xl">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-white">Create Shipment</h3>
                                    <button onClick={() => setShowCreateShipment(false)} className="text-white hover:text-gray-200">
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <form onSubmit={handleCreateShipment} className="px-6 py-4 space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Origin</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                        value={shipmentForm.origin}
                                        onChange={(e) => setShipmentForm({ ...shipmentForm, origin: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Destination (Buyer's Delivery Address)
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                        value={shipmentForm.destination}
                                        onChange={(e) => setShipmentForm({ ...shipmentForm, destination: e.target.value })}
                                        required
                                        placeholder="Buyer's delivery address"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Transport Mode</label>
                                    <select
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                        value={shipmentForm.transportMode}
                                        onChange={(e) => setShipmentForm({ ...shipmentForm, transportMode: e.target.value })}
                                    >
                                        <option value="TRUCK">🚚 Truck</option>
                                        <option value="TRAIN">🚂 Train</option>
                                        <option value="SHIP">🚢 Ship</option>
                                        <option value="AIR">✈️ Air</option>
                                        <option value="OTHER">📦 Other</option>
                                    </select>
                                </div>
                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateShipment(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg shadow-lg transition transform hover:scale-105"
                                    >
                                        Create Shipment
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* Update Status Modal */}
            {
                showUpdateStatus && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all animate-fade-in">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-t-2xl">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-white">Update Shipment Status</h3>
                                    <button onClick={() => setShowUpdateStatus(false)} className="text-white hover:text-gray-200">
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <form onSubmit={handleUpdateStatus} className="px-6 py-4 space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Current Location</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition"
                                        value={statusForm.currentLocation}
                                        onChange={(e) => setStatusForm({ ...statusForm, currentLocation: e.target.value })}
                                        required
                                        placeholder="e.g., Highway 101, Near City XYZ"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Temperature (°C)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition"
                                            value={statusForm.temperature}
                                            onChange={(e) => setStatusForm({ ...statusForm, temperature: e.target.value })}
                                            placeholder="25.5"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Humidity (%)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition"
                                            value={statusForm.humidity}
                                            onChange={(e) => setStatusForm({ ...statusForm, humidity: e.target.value })}
                                            placeholder="60.0"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
                                    <textarea
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition"
                                        rows="3"
                                        value={statusForm.notes}
                                        onChange={(e) => setStatusForm({ ...statusForm, notes: e.target.value })}
                                        placeholder="Optional notes about the shipment..."
                                    />
                                </div>
                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowUpdateStatus(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 rounded-lg shadow-lg transition transform hover:scale-105"
                                    >
                                        Update Status
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* Confirm Delivery Modal */}
            {
                showDelivery && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all animate-fade-in">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-500 to-green-600 rounded-t-2xl">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-white">Confirm Delivery</h3>
                                    <button onClick={() => setShowDelivery(false)} className="text-white hover:text-gray-200">
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <form onSubmit={handleConfirmDelivery} className="px-6 py-4 space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Delivery Notes</label>
                                    <textarea
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                                        rows="3"
                                        value={deliveryForm.deliveryNotes}
                                        onChange={(e) => setDeliveryForm({ ...deliveryForm, deliveryNotes: e.target.value })}
                                        placeholder="Optional: Add any delivery notes..."
                                    />
                                </div>
                                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                                    <div className="flex">
                                        <svg className="h-5 w-5 text-yellow-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        <p className="text-sm text-yellow-700">
                                            Once confirmed, the order will be marked DELIVERED and a custody transfer hash will be generated.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowDelivery(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-lg shadow-lg transition transform hover:scale-105"
                                    >
                                        Confirm Delivery
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* Shipment Logs Modal */}
            {
                showLogs && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full transform transition-all animate-fade-in">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-500 to-purple-600 rounded-t-2xl">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-white">Shipment Logs</h3>
                                    <button onClick={() => setShowLogs(false)} className="text-white hover:text-gray-200">
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="px-6 py-4 max-h-96 overflow-y-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50 sticky top-0">
                                        <tr>
                                            {['Timestamp', 'Action', 'Location', 'Notes'].map((header) => (
                                                <th key={header} className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {shipmentLogs.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                                    No logs available
                                                </td>
                                            </tr>
                                        ) : (
                                            shipmentLogs.map(log => (
                                                <tr key={log.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {new Date(log.createdAt).toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="inline-flex px-3 py-1 text-xs font-bold rounded-full bg-purple-100 text-purple-800">
                                                            {log.action}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">{log.location || '-'}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">{log.notes || '-'}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default DistributorDashboard;
