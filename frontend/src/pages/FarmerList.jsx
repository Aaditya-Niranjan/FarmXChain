import React, { useState, useEffect, useCallback } from 'react';
import FarmerService from '../services/FarmerService';

const FarmerList = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('');

  const loadFarmers = useCallback(async () => {
    try {
      setLoading(true);
      const data = selectedCrop
        ? await FarmerService.getFarmersByCrop(selectedCrop)
        : await FarmerService.getAllFarmers();
      setFarmers(data.data || []);
    } catch (err) {
      setError('Failed to load farmers');
    } finally {
      setLoading(false);
    }
  }, [selectedCrop]);

  useEffect(() => {
    loadFarmers();
  }, [loadFarmers]);

  const handleCropChange = (e) => {
    setSelectedCrop(e.target.value);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
          <p className="mt-4 text-gray-600">Loading farmers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Farmers Directory</h1>
            <div className="flex items-center space-x-4">
              <select
                value={selectedCrop}
                onChange={handleCropChange}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">All Crops</option>
                <option value="WHEAT">Wheat</option>
                <option value="RICE">Rice</option>
                <option value="CORN">Corn</option>
                <option value="SOYBEAN">Soybean</option>
                <option value="COTTON">Cotton</option>
                <option value="SUGARCANE">Sugarcane</option>
                <option value="POTATO">Potato</option>
                <option value="TOMATO">Tomato</option>
                <option value="ONION">Onion</option>
                <option value="OTHER">Other</option>
              </select>
              <button
                onClick={loadFarmers}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Refresh
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {farmers.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No farmers found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {selectedCrop ? `No farmers found for ${selectedCrop}` : 'No farmers available'}
                </p>
              </div>
            ) : (
              farmers.map((farmer) => (
                <div key={farmer.id} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{farmer.user.email}</h3>
                        <p className="text-sm text-gray-500">{farmer.farmLocation}</p>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Crop Type</dt>
                        <dd className="mt-1 text-sm text-gray-900">{farmer.cropType}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Farm Size</dt>
                        <dd className="mt-1 text-sm text-gray-900">{farmer.farmSizeAcres} acres</dd>
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Verified
                      </span>
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

export default FarmerList;
