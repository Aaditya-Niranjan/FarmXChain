import React, { useState, useEffect } from 'react';
import CropService from '../services/CropService';
import OrderService from '../services/OrderService';
import AuthService from '../services/AuthService';
import CropList from '../components/CropList';

const Marketplace = () => {
    const [crops, setCrops] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [orderModal, setOrderModal] = useState({ show: false, crop: null });
    const [orderQuantity, setOrderQuantity] = useState('');
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [orderLoading, setOrderLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        loadCrops();
    }, []);

    const loadCrops = async () => {
        try {
            setLoading(true);
            const response = await CropService.getAllCrops();
            const sortedCrops = (response.data || []).sort((a, b) => b.id - a.id);
            setCrops(sortedCrops);
        } catch (err) {
            setError('Failed to load marketplace crops');
            console.error('Error loading crops:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleBuyClick = (crop) => {
        setOrderModal({ show: true, crop });
        setOrderQuantity(1); // Default to 1 kg instead of full quantity
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        const quantity = Number(orderQuantity);
        if (!quantity || quantity <= 0) {
            setError('Please enter a valid quantity');
            return;
        }

        if (quantity > orderModal.crop.quantityKg) {
            setError(`Only ${orderModal.crop.quantityKg} kg available`);
            return;
        }

        try {
            setOrderLoading(true);
            setError('');
            await OrderService.placeOrder({
                cropId: orderModal.crop.id,
                quantity: quantity,
                deliveryAddress: deliveryAddress
            });

            // Refresh user profile/balance after purchase
            await AuthService.getProfile();

            setSuccessMsg('Successfully purchased! Redirecting to your orders...');
            setTimeout(() => {
                setOrderModal({ show: false, crop: null });
                setSuccessMsg('');
                window.location.href = '/orders';
            }, 2000);
        } catch (err) {
            console.error('Order Error:', err);
            setError(err.message || 'Failed to complete purchase. Please try again.');
        } finally {
            setOrderLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
                            <p className="mt-1 text-sm text-gray-600">
                                Explore certified crops from verifiable farmers.
                            </p>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-green-500 mx-auto"></div>
                            <p className="mt-4 text-gray-600 font-medium">Loading marketplace...</p>
                        </div>
                    ) : (
                        <CropList crops={crops} showVerification={true} onBuy={handleBuyClick} />
                    )}
                </div>
            </div>

            {/* Order Modal */}
            {orderModal.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl transform transition-all">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Confirm Purchase</h2>
                        <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-100">
                            <p className="text-sm text-gray-600">Crop: <span className="font-bold text-gray-900">{orderModal.crop.cropName}</span></p>
                            <p className="text-sm text-gray-600">Farmer: <span className="font-bold text-gray-900">{orderModal.crop.farmer?.user?.name}</span></p>
                            <p className="text-sm text-gray-600">Price: <span className="font-bold text-gray-900">
                                {orderModal.crop.pricePerKg ? `₹${orderModal.crop.pricePerKg}/kg` : 'Price not set'}
                            </span></p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl font-medium">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handlePlaceOrder}>
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity (kg)</label>
                                <input
                                    type="number"
                                    max={orderModal.crop.quantityKg}
                                    min="1"
                                    value={orderQuantity}
                                    onChange={(e) => setOrderQuantity(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    required
                                />
                                <p className="mt-2 text-xs text-gray-500 text-right">Available: {orderModal.crop.quantityKg} kg</p>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Delivery Address <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={deliveryAddress}
                                    onChange={(e) => setDeliveryAddress(e.target.value)}
                                    placeholder="Enter complete delivery address (Street, City, State, Postal Code)"
                                    rows="3"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                                    required
                                />
                                <p className="mt-2 text-xs text-gray-500">
                                    📍 Enter the complete address where you want the crop delivered
                                </p>
                            </div>

                            <div className="mb-6">
                                <p className="text-sm text-gray-600">Total Price:</p>
                                <p className="text-3xl font-extrabold text-green-600">
                                    {orderModal.crop.pricePerKg ?
                                        `₹${((Number(orderQuantity) || 0) * (Number(orderModal.crop.pricePerKg) || 0)).toFixed(2)}` :
                                        'N/A'}
                                </p>
                                {AuthService.getCurrentUser() && orderModal.crop.pricePerKg && (Number(AuthService.getCurrentUser().balance) < (Number(orderQuantity) * Number(orderModal.crop.pricePerKg))) && (
                                    <p className="text-xs text-red-500 font-bold mt-2">
                                        ⚠️ Insufficient Wallet Balance (₹{Number(AuthService.getCurrentUser().balance).toLocaleString()})
                                    </p>
                                )}
                            </div>

                            {successMsg ? (
                                <div className="p-4 bg-green-100 text-green-700 rounded-xl mb-6 font-medium animate-pulse">
                                    {successMsg}
                                </div>
                            ) : (
                                <div className="flex space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setOrderModal({ show: false, crop: null })}
                                        className="flex-1 px-4 py-1.5 border border-neutral-300 rounded-xl font-bold text-neutral-600 hover:bg-neutral-50 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={
                                            orderLoading ||
                                            !orderQuantity ||
                                            !deliveryAddress ||
                                            deliveryAddress.trim().length < 10 ||
                                            Number(orderQuantity) <= 0 ||
                                            Number(orderQuantity) > Number(orderModal.crop.quantityKg) ||
                                            (AuthService.getCurrentUser() && Number(AuthService.getCurrentUser().balance) < (Number(orderQuantity) * Number(orderModal.crop.pricePerKg)))
                                        }
                                        className="flex-1 px-4 py-1.5 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-100 disabled:opacity-50 disabled:shadow-none"
                                    >
                                        {orderLoading ? 'Processing...' : 'Confirm Order'}
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Marketplace;
