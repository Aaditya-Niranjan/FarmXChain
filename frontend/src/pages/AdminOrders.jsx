import React, { useState, useEffect } from 'react';
import AdminService from '../services/AdminService';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [distributors, setDistributors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [filter, setFilter] = useState('');
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedDistributor, setSelectedDistributor] = useState('');

    useEffect(() => {
        loadOrders();
        loadDistributors();
    }, []);

    const loadDistributors = async () => {
        try {
            const data = await AdminService.getDistributors();
            setDistributors(data.data || []);
        } catch (err) {
            console.error('Failed to load distributors:', err);
        }
    };

    const loadOrders = async () => {
        try {
            setLoading(true);
            const data = await AdminService.getPlatformOrders();
            setOrders(data.data || []);
        } catch (err) {
            setError('Failed to load transaction history.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusClasses = {
            PENDING: 'bg-yellow-100 text-yellow-800',
            ACCEPTED: 'bg-blue-100 text-blue-800',
            ASSIGNED: 'bg-cyan-100 text-cyan-800',
            IN_TRANSIT: 'bg-purple-100 text-purple-800',
            SHIPPED: 'bg-purple-100 text-purple-800',
            DELIVERED: 'bg-teal-100 text-teal-800',
            COMPLETED: 'bg-green-100 text-green-800',
            CANCELLED: 'bg-red-100 text-red-800',
            REJECTED: 'bg-red-100 text-red-800'
        };

        return (
            <span className={`inline-flex px-2 py-1 text-xs font-bold rounded-full ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
                {status}
            </span>
        );
    };

    const handleAssignDistributor = async () => {
        if (!selectedOrder || !selectedDistributor) {
            setError('Please select a distributor');
            return;
        }

        try {
            setError('');
            await AdminService.assignOrderToDistributor(selectedOrder.id, selectedDistributor);
            setSuccess(`Order #${selectedOrder.id} assigned to distributor successfully!`);
            setShowAssignModal(false);
            setSelectedOrder(null);
            setSelectedDistributor('');
            loadOrders();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.message || 'Failed to assign distributor');
        }
    };

    const openAssignModal = (order) => {
        setSelectedOrder(order);
        setShowAssignModal(true);
        setError('');
    };

    const filteredOrders = orders.filter(order =>
        order.id.toString().includes(filter) ||
        order.farmerId?.toString().includes(filter) ||
        order.buyerName?.toLowerCase().includes(filter.toLowerCase()) ||
        order.cropName?.toLowerCase().includes(filter.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading comprehensive transaction history...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Platform Transactions</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Complete history of all sales between Farmers and Buyers (Distributors, Retailers, Consumers).
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0 flex gap-4">
                        <input
                            type="text"
                            placeholder="Search ID, Buyer, Crop..."
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <button
                            onClick={loadOrders}
                            className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors"
                        >
                            Refresh Data
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-green-700">{success}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Order ID
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Seller (Farmer)
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Buyer
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Crop Details
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Total Revenue
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions found</h3>
                                            <p className="mt-1 text-sm text-gray-500">No orders match your search criteria.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                                                #{order.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-8 w-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-xs">
                                                        F
                                                    </div>
                                                    <div className="ml-3">
                                                        <div className="text-sm font-medium text-gray-900">{order.farmName || 'Unknown Farm'}</div>
                                                        <div className="text-xs text-gray-500">ID: {order.farmerId}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs 
                                ${order.buyerRole === 'DISTRIBUTOR' ? 'bg-blue-100 text-blue-600' :
                                                            order.buyerRole === 'RETAILER' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'}`}>
                                                        {order.buyerRole ? order.buyerRole.charAt(0) : 'U'}
                                                    </div>
                                                    <div className="ml-3">
                                                        <div className="text-sm font-medium text-gray-900">{order.buyerName}</div>
                                                        <div className="text-xs text-gray-500">{order.buyerRole}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 font-medium">{order.cropName}</div>
                                                <div className="text-sm text-gray-500">{order.quantity} kg</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                                                ₹{order.totalPrice?.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                {getStatusBadge(order.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                {order.status === 'ACCEPTED' && !order.distributorId && (
                                                    <button
                                                        onClick={() => openAssignModal(order)}
                                                        className="inline-flex items-center px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded shadow transition-colors"
                                                    >
                                                        Assign Distributor
                                                    </button>
                                                )}
                                                {order.distributorId && (
                                                    <span className="text-xs text-gray-500">
                                                        Assigned to {order.distributorName}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Assign Distributor Modal */}
                {showAssignModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Assign Distributor to Order #{selectedOrder?.id}
                                </h3>
                            </div>
                            <div className="px-6 py-4">
                                <p className="text-sm text-gray-600 mb-4">
                                    Select a distributor to handle the logistics for this order.
                                </p>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Distributor
                                    </label>
                                    <select
                                        value={selectedDistributor}
                                        onChange={(e) => setSelectedDistributor(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="">Select a distributor...</option>
                                        {distributors.map(dist => (
                                            <option key={dist.id} value={dist.id}>
                                                {dist.name} (ID: {dist.id})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {selectedOrder && (
                                    <div className="bg-gray-50 rounded-md p-3 text-sm">
                                        <p><span className="font-medium">Crop:</span> {selectedOrder.cropName}</p>
                                        <p><span className="font-medium">Quantity:</span> {selectedOrder.quantity} kg</p>
                                        <p><span className="font-medium">Buyer:</span> {selectedOrder.buyerName}</p>
                                    </div>
                                )}
                            </div>
                            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
                                <button
                                    onClick={() => {
                                        setShowAssignModal(false);
                                        setSelectedOrder(null);
                                        setSelectedDistributor('');
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAssignDistributor}
                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                                >
                                    Assign
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOrders;
