import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import LogisticsService from '../services/LogisticsService';

const Tracking = () => {
    const { orderId } = useParams();
    const user = JSON.parse(localStorage.getItem('user'));
    const isFarmer = user?.role === 'FARMER';
    const [shipment, setShipment] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [updateForm, setUpdateForm] = useState({
        location: '',
        temperature: 20,
        humidity: 60,
        status: 'IN_TRANSIT'
    });
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        loadShipment();
    }, [orderId]);

    const loadShipment = async () => {
        try {
            setLoading(true);
            const response = await LogisticsService.getShipmentByOrder(orderId);
            setShipment(response.data);
            if (response.data) {
                setUpdateForm({
                    location: response.data.currentLocation || '',
                    temperature: response.data.temperature || 20,
                    humidity: response.data.humidity || 60,
                    status: response.data.status
                });
            }
        } catch (err) {
            setError('Shipment tracking information not found.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            setUpdating(true);
            await LogisticsService.updateShipment(shipment.id, updateForm);
            await loadShipment();
        } catch (err) {
            setError('Failed to update shipment');
        } finally {
            setUpdating(false);
        }
    };

    const getStepStatus = (step) => {
        const statuses = ['IN_TRANSIT', 'DELAYED', 'DELIVERED'];
        const currentIdx = statuses.indexOf(shipment.status);
        const stepIdx = statuses.indexOf(step);
        if (shipment.status === 'DELIVERED') return 'completed';
        if (stepIdx < currentIdx) return 'completed';
        if (stepIdx === currentIdx) return 'active';
        return 'pending';
    };

    if (loading) return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
            <div className="relative">
                <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-green-500"></div>
                <div className="absolute inset-0 rounded-full h-24 w-24 border-r-4 border-l-4 border-green-300 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            <p className="mt-8 text-green-400 font-bold text-lg tracking-wide animate-pulse">Loading Tracking Data...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                {/* Header Section - Enhanced */}
                <div className="mb-8 lg:mb-12">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20">
                                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-3xl lg:text-5xl font-black text-white tracking-tight">
                                        Live <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">Tracking</span>
                                    </h1>
                                    <p className="text-neutral-400 text-sm font-medium mt-0.5">Real-time shipment monitoring</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-3">
                                <p className="text-neutral-500 text-xs font-semibold uppercase tracking-wider mb-1">Order ID</p>
                                <p className="text-white font-mono font-bold text-lg">#{orderId.toString().padStart(6, '0')}</p>
                            </div>
                            {shipment && (
                                <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-sm border border-green-500/20 rounded-2xl px-6 py-3">
                                    <p className="text-green-400/70 text-xs font-semibold uppercase tracking-wider mb-1">Status</p>
                                    <p className="text-green-400 font-bold text-lg">{shipment.status.replace('_', ' ')}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 backdrop-blur-sm text-red-400 px-6 py-4 rounded-2xl mb-8 flex items-center shadow-xl">
                        <svg className="h-6 w-6 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="font-semibold">{error}</span>
                    </div>
                )}

                {shipment && (
                    <div className="space-y-6 lg:space-y-8">
                        {/* Progress Timeline - Enhanced */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 lg:p-10">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl lg:text-2xl font-bold text-white">Journey Progress</h2>
                                <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 backdrop-blur-sm rounded-full border border-green-500/20">
                                    <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
                                    <span className="text-xs text-green-400 font-bold uppercase tracking-wide">Live</span>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="relative">
                                <div className="hidden lg:flex justify-between items-center max-w-4xl mx-auto mb-12">
                                    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-white/10 rounded-full">
                                        <div
                                            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-1000 rounded-full shadow-lg shadow-green-500/30"
                                            style={{ width: shipment.status === 'DELIVERED' ? '100%' : shipment.status === 'IN_TRANSIT' ? '50%' : '50%' }}
                                        ></div>
                                    </div>

                                    {[
                                        { id: 'ORIGIN', label: 'Origin', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', status: 'completed' },
                                        { id: 'TRANSIT', label: 'In Transit', icon: 'M13 10V3L4 14h7v7l9-11h-7z', status: getStepStatus('IN_TRANSIT') === 'completed' || getStepStatus('IN_TRANSIT') === 'active' ? 'active' : 'pending' },
                                        { id: 'DELIVERED', label: 'Delivered', icon: 'M5 13l4 4L19 7', status: getStepStatus('DELIVERED') }
                                    ].map((step, idx) => (
                                        <div key={idx} className="relative z-10 flex flex-col items-center">
                                            <div className={`h-20 w-20 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-2xl ${step.status === 'completed' ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-green-500/30' :
                                                    step.status === 'active' ? 'bg-white text-neutral-900 scale-110 shadow-white/20' :
                                                        'bg-neutral-800/80 text-neutral-500 border border-white/10'
                                                }`}>
                                                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={step.icon} />
                                                </svg>
                                            </div>
                                            <p className={`mt-4 text-sm font-bold uppercase tracking-wide ${step.status === 'active' ? 'text-white' : step.status === 'completed' ? 'text-green-400' : 'text-neutral-500'
                                                }`}>{step.label}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Mobile Timeline */}
                                <div className="lg:hidden space-y-4">
                                    {[
                                        { label: 'Origin', status: 'completed' },
                                        { label: 'In Transit', status: getStepStatus('IN_TRANSIT') === 'completed' || getStepStatus('IN_TRANSIT') === 'active' ? 'active' : 'pending' },
                                        { label: 'Delivered', status: getStepStatus('DELIVERED') }
                                    ].map((step, idx) => (
                                        <div key={idx} className="flex items-center gap-4">
                                            <div className={`h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 ${step.status === 'completed' ? 'bg-gradient-to-br from-green-500 to-emerald-600' :
                                                    step.status === 'active' ? 'bg-white' : 'bg-neutral-800'
                                                }`}>
                                                <div className={`h-3 w-3 rounded-full ${step.status === 'completed' ? 'bg-white' :
                                                        step.status === 'active' ? 'bg-neutral-900' : 'bg-neutral-600'
                                                    }`}></div>
                                            </div>
                                            <p className={`text-sm font-bold ${step.status === 'active' ? 'text-white' : step.status === 'completed' ? 'text-green-400' : 'text-neutral-500'
                                                }`}>{step.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Location & Blockchain Info */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10 pt-8 border-t border-white/10">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs text-neutral-500 font-semibold uppercase tracking-wider mb-2">Current Location</p>
                                        <p className="text-xl lg:text-2xl font-bold text-white flex items-center gap-3">
                                            <svg className="h-6 w-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                            </svg>
                                            {shipment.currentLocation}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-neutral-500 font-semibold uppercase tracking-wider mb-2">Last Updated</p>
                                        <p className="text-neutral-300 font-medium">{new Date(shipment.lastUpdated).toLocaleString()}</p>
                                    </div>
                                </div>
                                {shipment.blockchainTxHash && (
                                    <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-6">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                                            <p className="text-xs text-green-400 font-bold uppercase tracking-wider">Blockchain Verified</p>
                                        </div>
                                        <p className="text-xs text-neutral-500 font-mono break-all leading-relaxed">{shipment.blockchainTxHash}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Environmental Metrics - Enhanced Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="group relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-3xl p-8 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300">
                                <div className="absolute -top-20 -right-20 h-60 w-60 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
                                <div className="relative">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl">
                                            <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-blue-100/60 text-xs font-bold uppercase tracking-wider mb-2">Temperature</p>
                                            <p className="text-6xl font-black text-white tabular-nums">
                                                {shipment.temperature}
                                                <span className="text-3xl text-blue-200 ml-1">°C</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-white rounded-full transition-all duration-1000 shadow-lg shadow-white/50"
                                                style={{ width: `${Math.min((shipment.temperature / 40) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-blue-100/40 mt-3 font-medium">Optimal range: 2-8°C</p>
                                    </div>
                                </div>
                            </div>

                            <div className="group relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 rounded-3xl p-8 shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
                                <div className="absolute -bottom-20 -left-20 h-60 w-60 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
                                <div className="relative">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl">
                                            <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                            </svg>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-purple-100/60 text-xs font-bold uppercase tracking-wider mb-2">Humidity</p>
                                            <p className="text-6xl font-black text-white tabular-nums">
                                                {shipment.humidity}
                                                <span className="text-3xl text-purple-200 ml-1">%</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-white rounded-full transition-all duration-1000 shadow-lg shadow-white/50"
                                                style={{ width: `${shipment.humidity}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-purple-100/40 mt-3 font-medium">Optimal range: 45-65%</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Shipment History - Enhanced */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 lg:p-10">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-12 w-12 bg-white/10 rounded-xl flex items-center justify-center">
                                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl lg:text-2xl font-bold text-white">Shipment History</h2>
                            </div>

                            <div className="space-y-6">
                                {shipment.logs && shipment.logs.length > 0 ? (
                                    shipment.logs.map((log, idx) => (
                                        <div key={idx} className="relative pl-8 border-l-2 border-white/10 pb-6 last:pb-0">
                                            <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-green-500 shadow-lg shadow-green-500/50"></div>
                                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white/5 rounded-2xl p-5 hover:bg-white/10 transition-colors">
                                                <div className="flex-1">
                                                    <div className="flex flex-wrap items-center gap-3 mb-3">
                                                        <span className="inline-flex px-4 py-1.5 bg-green-500/10 text-green-400 text-xs font-bold uppercase tracking-wider rounded-full border border-green-500/20">
                                                            {log.action.replace('_', ' ')}
                                                        </span>
                                                        {log.blockchainTxHash && (
                                                            <div className="relative group/verify inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
                                                                <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-500/50"></div>
                                                                <span className="text-xs text-blue-400 font-bold uppercase tracking-tight">Verified</span>
                                                                <div className="absolute hidden group-hover/verify:block bottom-full left-0 mb-2 p-3 bg-neutral-900 border border-white/10 rounded-xl text-xs font-mono text-neutral-400 max-w-xs break-all z-50 shadow-2xl">
                                                                    {log.blockchainTxHash}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className="text-white font-bold text-lg mb-1">{log.location || 'Location Unknown'}</p>
                                                    <p className="text-neutral-400 text-sm leading-relaxed">{log.notes}</p>
                                                </div>
                                                <div className="flex-shrink-0 text-right">
                                                    <p className="text-neutral-500 text-xs font-mono uppercase tracking-wide">
                                                        {new Date(log.createdAt).toLocaleString(undefined, {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-16 border-2 border-dashed border-white/10 rounded-3xl bg-white/5">
                                        <svg className="h-16 w-16 text-neutral-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <p className="text-neutral-500 font-semibold uppercase tracking-widest text-sm">Initializing shipment logs...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Tracking;
