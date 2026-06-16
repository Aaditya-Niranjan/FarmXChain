import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon missing in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LocationMarker = ({ position, setPosition, setAddress }) => {
    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng);
            if (setAddress) {
                setAddress(`Lat: ${e.latlng.lat.toFixed(6)}, Lng: ${e.latlng.lng.toFixed(6)}`);
            }
        },
    });

    const eventHandlers = React.useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current;
                if (marker != null) {
                    const newPos = marker.getLatLng();
                    setPosition(newPos);
                    if (setAddress) {
                        setAddress(`Lat: ${newPos.lat.toFixed(6)}, Lng: ${newPos.lng.toFixed(6)}`);
                    }
                }
            },
        }),
        [setPosition, setAddress],
    );

    const markerRef = React.useRef(null);

    useEffect(() => {
        if (position) {
            map.flyTo(position, map.getZoom());
        }
    }, [position, map]);

    return position === null ? null : (
        <Marker
            position={position}
            draggable={true}
            eventHandlers={eventHandlers}
            ref={markerRef}
        >
            <Popup>Selected Location (Drag to refine)</Popup>
        </Marker>
    );
};

const LocationPicker = ({ onLocationSelect, initialLocation }) => {
    const [position, setPosition] = useState(null);

    // Default to a central location (e.g., India) if nothing selected
    const defaultCenter = [20.5937, 78.9629];

    const handleSetPosition = (pos) => {
        setPosition(pos);
        if (onLocationSelect) {
            onLocationSelect(`${pos.lat.toFixed(6)}, ${pos.lng.toFixed(6)}`);
        }
    };

    const handleLocateMe = (e) => {
        e.preventDefault(); // Prevent form submission
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    const newPos = { lat: latitude, lng: longitude };
                    handleSetPosition(newPos);
                },
                (err) => {
                    console.error("Error getting location:", err);
                    alert("Could not get your location. Please check browser permissions.");
                }
            );
        } else {
            alert("Geolocation is not supported by your browser");
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="h-64 w-full rounded-md overflow-hidden border border-gray-300 z-0 relative">
                <MapContainer
                    center={defaultCenter}
                    zoom={5}
                    scrollWheelZoom={true}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker position={position} setPosition={handleSetPosition} />
                </MapContainer>
            </div>
            <button
                onClick={handleLocateMe}
                className="self-start text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded border border-blue-300 flex items-center"
                type="button"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Locate Me
            </button>
            <p className="text-xs text-gray-500">Click on map or drag marker to pinpoint exact location.</p>
        </div>
    );
};

export default LocationPicker;
