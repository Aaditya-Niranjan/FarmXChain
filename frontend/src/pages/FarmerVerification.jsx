import React, { useState, useEffect } from 'react';
import AdminService from '../services/AdminService';

const FarmerVerification = () => {
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadVerifications();
  }, []);

  const loadVerifications = async () => {
    try {
      const data = await AdminService.getPendingFarmers();
      setVerifications(data.data || []);
    } catch (err) {
      setError('Failed to load farmer verifications');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (farmerId, action) => {
    try {
      setError('');
      setSuccess('');

      if (action === 'verify') {
        await AdminService.verifyFarmer(farmerId);
        setSuccess('Farmer verified successfully');
      } else if (action === 'reject') {
        const rejectionReason = prompt('Please provide a reason for rejection:');
        if (rejectionReason) {
          await AdminService.rejectFarmer(farmerId, rejectionReason);
          setSuccess('Farmer rejected successfully');
        }
      }

      // Reload verifications to reflect changes
      loadVerifications();
    } catch (err) {
      setError(err.message || 'Action failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
          <p className="mt-4 text-gray-600">Loading farmer verifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Farmer Verification</h1>
            <button
              onClick={loadVerifications}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Refresh
            </button>
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

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {verifications.length === 0 ? (
                <li className="px-6 py-4 text-center text-gray-500">
                  No pending farmer verifications
                </li>
              ) : (
                verifications.map((farmer) => (
                  <li key={farmer.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{farmer.user.email}</p>
                            <div className="mt-1 grid grid-cols-2 gap-4">
                              <div>
                                <dt className="text-xs font-medium text-gray-500">Farm Location</dt>
                                <dd className="text-sm text-gray-900">{farmer.farmLocation}</dd>
                              </div>
                              <div>
                                <dt className="text-xs font-medium text-gray-500">Crop Type</dt>
                                <dd className="text-sm text-gray-900">{farmer.cropType}</dd>
                              </div>
                              <div>
                                <dt className="text-xs font-medium text-gray-500">Farm Size</dt>
                                <dd className="text-sm text-gray-900">{farmer.farmSize} acres</dd>
                              </div>
                              <div>
                                <dt className="text-xs font-medium text-gray-500">Bank Account</dt>
                                <dd className="text-sm text-gray-900">{farmer.bankAccount || 'Not provided'}</dd>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleAction(farmer.id, 'verify')}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium"
                        >
                          Verify
                        </button>
                        <button
                          onClick={() => handleAction(farmer.id, 'reject')}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-medium"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerVerification;
