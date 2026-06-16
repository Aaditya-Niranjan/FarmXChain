import React, { useState, useEffect } from 'react';
import CropService from '../services/CropService';

const CropList = ({ crops: initialCrops, showVerification = true, onBuy }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const isBuyer = ['RETAILER', 'DISTRIBUTOR', 'CONSUMER'].includes(user?.role);
  const [crops, setCrops] = useState(initialCrops || []);
  const [verificationStatus, setVerificationStatus] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialCrops) {
      setCrops(initialCrops);
    }
  }, [initialCrops]);

  const verifyBlockchain = async (cropId) => {
    try {
      setLoading(true);
      const response = await CropService.verifyBlockchainRecord(cropId);
      setVerificationStatus(prev => ({
        ...prev,
        [cropId]: response.data
      }));
    } catch (error) {
      console.error('Error verifying blockchain:', error);
      setVerificationStatus(prev => ({
        ...prev,
        [cropId]: false
      }));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (crops.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No crops found</h3>
        <p className="mt-1 text-sm text-gray-500">Add your first crop to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {crops.map((crop) => (
        <div key={crop.id} className="bg-white rounded-xl shadow-lg run-in-animation overflow-hidden flex flex-col h-full border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          {/* Image Section */}
          <div className="h-48 w-full bg-gray-200 relative">
            {crop.imageUrl ? (
              <img
                src={crop.imageUrl}
                alt={crop.cropName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/600x400?text=No+Image';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-green-50 text-green-200">
                <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
            )}

            {/* Blockchain Badge */}
            {crop.blockchainHash && (
              <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md flex items-center">
                <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                On Chain
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-5 flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-gray-900 leading-tight">{crop.cropName}</h3>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-md font-semibold shrink-0">
                {crop.quantityKg} kg
              </span>
            </div>
            {crop.pricePerKg && (
              <div className="mb-3">
                <span className="text-2xl font-bold text-green-600">₹{crop.pricePerKg}</span>
                <span className="text-gray-500 text-sm"> / kg</span>
              </div>
            )}

            {/* Farmer Info Section */}
            {crop.farmer && (
              <div className="mb-4 p-2 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center text-sm font-semibold text-green-700 mb-1">
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <div className="flex flex-col">
                    <span className="font-semibold text-green-700">
                      {crop.farmer.user?.name || 'Unknown Farmer'}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-gray-400 leading-none">
                      {crop.farmer.user?.role || 'FARMER'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col space-y-1 text-xs text-gray-500">
                  <div className="flex items-center">
                    <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    {crop.farmer.farmName}
                  </div>
                  <div className="flex items-center text-blue-600">
                    <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {crop.farmer.user?.email}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2 text-sm text-gray-600 mb-4 flex-1">
              <div className="flex items-center">
                <svg className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Harvested: <span className="font-medium text-gray-800">{formatDate(crop.harvestDate)}</span></span>
              </div>
              <div className="flex items-center">
                <svg className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {crop.originLocation && crop.originLocation.includes(',') ? (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${crop.originLocation}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline flex items-center transition-colors"
                  >
                    <span className="truncate">{crop.originLocation}</span>
                    <svg className="h-3 w-3 ml-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ) : (
                  <span className="truncate">{crop.originLocation || 'Unknown Location'}</span>
                )}
              </div>
            </div>

            {/* Actions Section */}
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
              <div className="flex justify-between items-center">
                {/* Spacer or empty div to push button to right if needed, or just let it float */}
                <div />

                {showVerification && crop.blockchainHash && (
                  <button
                    onClick={() => verifyBlockchain(crop.id)}
                    disabled={loading}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium focus:outline-none disabled:opacity-50"
                  >
                    {loading ? 'Verifying...' : 'Verify Chain'}
                  </button>
                )}

                {isBuyer && (
                  <button
                    onClick={() => onBuy && onBuy(crop)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-md flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Buy Now
                  </button>
                )}
              </div>

              {verificationStatus[crop.id] !== undefined && (
                <div className={`mt-2 p-2 rounded text-xs font-semibold text-center ${verificationStatus[crop.id] ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                  {verificationStatus[crop.id] ? '✓ Blockchain Verified' : '✗ Verification Failed'}
                </div>
              )}

              {crop.blockchainTxHash && (
                <div className="mt-2 text-[10px] text-gray-400 font-mono truncate cursor-help" title={crop.blockchainTxHash}>
                  Tx: {crop.blockchainTxHash}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CropList;
