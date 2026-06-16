import React, { useState, useEffect } from 'react';
import FarmerService from '../services/FarmerService';

const FarmerProfile = () => {
  const [profile, setProfile] = useState({
    
    farmName: '',
    farmLocation: '',
    cropType: '',
    farmSizeAcres: '',
    bankAccountNumber: '',
    bankIfscCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await FarmerService.getFarmerProfile();
      if (data.data) {
        setProfile(data.data);
      }
    } catch (err) {
      // Profile not found, that's okay for new farmers
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (profile.id) {
        await FarmerService.updateFarmerProfile(profile);
        setSuccess('Profile updated successfully!');
      } else {
        await FarmerService.createFarmerProfile(profile);
        setSuccess('Profile created successfully!');
      }
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Farmer Profile</h1>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                {profile.id ? 'Edit Profile' : 'Create Profile'}
              </button>
            )}
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              {success}
            </div>
          )}

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="farmName" className="block text-sm font-medium text-gray-700">
                        Farm Name
                      </label>
                      <input
                        type="text"
                        name="farmName"
                        id="farmName"
                        required
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md px-3 py-2 border"
                        value={profile.farmName}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <label htmlFor="farmLocation" className="block text-sm font-medium text-gray-700">
                        Farm Location
                      </label>
                      <input
                        type="text"
                        name="farmLocation"
                        id="farmLocation"
                        required
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md px-3 py-2 border"
                        value={profile.farmLocation}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <label htmlFor="cropType" className="block text-sm font-medium text-gray-700">
                        Crop Type
                      </label>
                      <select
                        name="cropType"
                        id="cropType"
                        required
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md px-3 py-2 border"
                        value={profile.cropType}
                        onChange={handleChange}
                      >
                        <option value="">Select Crop Type</option>
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
                    </div>

                    <div>
                      <label htmlFor="farmSizeAcres" className="block text-sm font-medium text-gray-700">
                        Farm Size (in acres)
                      </label>
                      <input
                        type="number"
                        name="farmSizeAcres"
                        id="farmSizeAcres"
                        required
                        min="0"
                        step="0.01"
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md px-3 py-2 border"
                        value={profile.farmSizeAcres}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <label htmlFor="bankAccountNumber" className="block text-sm font-medium text-gray-700">
                        Bank Account Number
                      </label>
                      <input
                        type="text"
                        name="bankAccountNumber"
                        id="bankAccountNumber"
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md px-3 py-2 border"
                        value={profile.bankAccountNumber}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <label htmlFor="bankIfscCode" className="block text-sm font-medium text-gray-700">
                        IFSC Code
                      </label>
                      <input
                        type="text"
                        name="bankIfscCode"
                        id="bankIfscCode"
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md px-3 py-2 border"
                        value={profile.bankIfscCode}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save Profile'}
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  {profile.id ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Farm Name</dt>
                        <dd className="mt-1 text-sm text-gray-900">{profile.farmName || 'Not set'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Farm Location</dt>
                        <dd className="mt-1 text-sm text-gray-900">{profile.farmLocation || 'Not set'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Crop Type</dt>
                        <dd className="mt-1 text-sm text-gray-900">{profile.cropType || 'Not set'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Farm Size</dt>
                        <dd className="mt-1 text-sm text-gray-900">{profile.farmSizeAcres ? `${profile.farmSizeAcres} acres` : 'Not set'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Bank Account</dt>
                        <dd className="mt-1 text-sm text-gray-900">{profile.bankAccountNumber || 'Not set'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">IFSC Code</dt>
                        <dd className="mt-1 text-sm text-gray-900">{profile.bankIfscCode || 'Not set'}</dd>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No profile found</h3>
                      <p className="mt-1 text-sm text-gray-500">Create your farmer profile to get started.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerProfile;
