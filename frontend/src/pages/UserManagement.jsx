import React, { useState, useEffect } from 'react';
import AdminService from '../services/AdminService';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentTab, setCurrentTab] = useState('ALL');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await AdminService.getAllUsers();
      setUsers(data.data || []);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredUsers = () => {
    if (currentTab === 'ALL') return users;
    return users.filter(user => user.role === currentTab);
  };

  const getRoleCounts = () => {
    const counts = { ALL: users.length, FARMER: 0, DISTRIBUTOR: 0, RETAILER: 0, CONSUMER: 0, ADMIN: 0 };
    users.forEach(user => {
      if (counts[user.role] !== undefined) counts[user.role]++;
    });
    return counts;
  };

  const counts = getRoleCounts();
  const tabs = [
    { id: 'ALL', label: 'All Users' },
    { id: 'FARMER', label: 'Farmers' },
    { id: 'DISTRIBUTOR', label: 'Distributors' },
    { id: 'RETAILER', label: 'Retailers' },
    { id: 'CONSUMER', label: 'Consumers' }
  ];

  const handleAction = async (userId, action) => {
    try {
      setError('');
      setSuccess('');

      switch (action) {
        case 'verify':
          await AdminService.verifyUser(userId);
          setSuccess('User verified successfully');
          break;
        case 'reject':
          await AdminService.rejectUser(userId);
          setSuccess('User rejected successfully');
          break;
        case 'suspend':
          await AdminService.suspendUser(userId);
          setSuccess('User has been BLOCKED successfully');
          break;
        case 'activate':
          await AdminService.activateUser(userId);
          setSuccess('User has been UNBLOCKED successfully');
          break;
        default:
          return;
      }

      // Reload users to reflect changes
      loadUsers();
    } catch (err) {
      setError(err.message || 'Action failed');
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      VERIFIED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      SUSPENDED: 'bg-red-200 text-red-900 border border-red-300', // Explicit Blocked style
      ACTIVE: 'bg-blue-100 text-blue-800'
    };

    const label = status === 'SUSPENDED' ? 'BLOCKED' : status;

    return (
      <span className={`inline-flex px-3 py-1 text-xs font-black rounded-full shadow-sm ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {label}
      </span>
    );
  };

  const getRoleBadge = (role) => {
    const roleClasses = {
      ADMIN: 'bg-purple-100 text-purple-800',
      FARMER: 'bg-green-100 text-green-800',
      DISTRIBUTOR: 'bg-blue-100 text-blue-800',
      RETAILER: 'bg-orange-100 text-orange-800',
      CONSUMER: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${roleClasses[role] || 'bg-gray-100 text-gray-800'}`}>
        {role}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <button
              onClick={loadUsers}
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

          <div className="mb-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id)}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                    ${currentTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                  `}
                >
                  {tab.label}
                  <span className={`ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium ${currentTab === tab.id ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-900'}`}>
                    {counts[tab.id]}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    getFilteredUsers().map((user) => (
                      <tr key={user.id} className={user.status === 'SUSPENDED' ? 'bg-gray-50 opacity-60' : 'hover:bg-gray-50 transition-colors'}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {user.name || 'N/A'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.email}
                              </div>
                              <div className="mt-1">
                                {getRoleBadge(user.role)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {user.phoneNumber || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {user.address ? (
                              <>
                                {user.address}
                                {user.city && `, ${user.city}`}
                                {user.state && `, ${user.state}`}
                                {user.postalCode && ` ${user.postalCode}`}
                              </>
                            ) : (
                              'N/A'
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(user.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            {user.status === 'PENDING' && (
                              <>
                                <button
                                  onClick={() => handleAction(user.id, 'verify')}
                                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleAction(user.id, 'reject')}
                                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-medium"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {user.status === 'ACTIVE' && user.role !== 'ADMIN' && (
                              <button
                                onClick={() => handleAction(user.id, 'suspend')}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-medium shadow-sm transition-colors"
                              >
                                Block User
                              </button>
                            )}
                            {user.status === 'SUSPENDED' && (
                              <button
                                onClick={() => handleAction(user.id, 'activate')}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium"
                              >
                                Unblock / Reactivate
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
