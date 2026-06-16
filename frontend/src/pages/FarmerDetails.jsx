import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FarmerService from '../services/FarmerService';

const FarmerDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [farmer, setFarmer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFarmer = async () => {
            try {
                const data = await FarmerService.getFarmerById(id);
                setFarmer(data.data);
            } catch (err) {
                setError('Failed to load farmer details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchFarmer();
        }
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center text-red-600">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Error</h2>
                <p>{error}</p>
                <button onClick={() => navigate(-1)} className="mt-4 text-indigo-600 hover:text-indigo-500">Go Back</button>
            </div>
        </div>
    );

    if (!farmer) return <div>Farmer not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <button onClick={() => navigate(-1)} className="flex items-center text-indigo-600 hover:text-indigo-500 transition-colors">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Directory
                    </button>
                </div>

                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="bg-indigo-600 px-6 py-8">
                        <div className="flex items-center">
                            <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center text-indigo-600 text-3xl font-bold">
                                {farmer.user.email.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-6 text-white">
                                <h1 className="text-3xl font-bold">{farmer.farmName || 'Farm Name Not Set'}</h1>
                                <div className="flex items-center mt-2 text-indigo-100">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {farmer.farmLocation}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Farm Details</h2>
                                <dl className="space-y-4">
                                    <div className="flex border-b border-gray-200 pb-2">
                                        <dt className="w-1/3 text-gray-500 font-medium">Crop Type</dt>
                                        <dd className="w-2/3 text-gray-900">{farmer.cropType}</dd>
                                    </div>
                                    <div className="flex border-b border-gray-200 pb-2">
                                        <dt className="w-1/3 text-gray-500 font-medium">Varieties</dt>
                                        <dd className="w-2/3 text-gray-900">{farmer.cropVarieties || 'N/A'}</dd>
                                    </div>
                                    <div className="flex border-b border-gray-200 pb-2">
                                        <dt className="w-1/3 text-gray-500 font-medium">Farm Size</dt>
                                        <dd className="w-2/3 text-gray-900">{farmer.farmSizeAcres} acres</dd>
                                    </div>
                                    <div className="flex border-b border-gray-200 pb-2">
                                        <dt className="w-1/3 text-gray-500 font-medium">Farming Method</dt>
                                        <dd className="w-2/3 text-gray-900">{farmer.farmingMethod}</dd>
                                    </div>
                                    <div className="flex border-b border-gray-200 pb-2">
                                        <dt className="w-1/3 text-gray-500 font-medium">Certification</dt>
                                        <dd className="w-2/3 text-gray-900">{farmer.certification || 'None'}</dd>
                                    </div>
                                </dl>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Verification Status</h2>
                                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-gray-500">Status</span>
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold 
                                ${farmer.verificationStatus === 'VERIFIED' ? 'bg-green-100 text-green-800' :
                                                farmer.verificationStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                            {farmer.verificationStatus}
                                        </span>
                                    </div>
                                    {farmer.verifiedAt && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-500">Verified On</span>
                                            <span className="text-gray-900">{new Date(farmer.verifiedAt).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                    <div className="mt-6">
                                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">About Farmer</h3>
                                        <p className="text-gray-600 text-sm">
                                            Experienced farmer with {farmer.experienceYears} years of experience in {farmer.cropType} cultivation.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FarmerDetails;
