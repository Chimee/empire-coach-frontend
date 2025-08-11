import React, { useEffect, useState } from 'react';
import {
    GoogleMap,
    LoadScript,
    Marker,
    DirectionsService,
    DirectionsRenderer,
} from '@react-google-maps/api';



const defaultCenter = {
    lat: 28.6139,
    lng: 77.2090,
};

const DriverMapscreen = ({ pickupCoords, dropoffCoords, currentLocation,height }) => {
    console.log(height,"height--->");
    const containerStyle = {
    width: '100%',
    height: `${height}` || '100%',
};
    const [directionsResponse, setDirectionsResponse] = useState(null);

    const center = currentLocation || pickupCoords || defaultCenter;

    useEffect(() => {
        if (pickupCoords && dropoffCoords) {
            setDirectionsResponse(null);
        }
    }, [pickupCoords, dropoffCoords]);

    return (
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAP_API_KEY}>
            <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
                {/* Markers */}
                {/* Pickup marker - label "P" */}
                {pickupCoords && <Marker position={pickupCoords} label="P" title="Pickup Location" />}

                {/* Dropoff marker - label "O" (optional) */}
                {dropoffCoords && <Marker position={dropoffCoords} label="O" title="Dropoff Location" />}

                {/* Driver's current location marker - label "D" */}
                {currentLocation && <Marker position={currentLocation} label="D" title="Driver's Current Location" />}

                {/* Directions Service to fetch route */}
                {pickupCoords && dropoffCoords && !directionsResponse && (
                    <DirectionsService
                        options={{
                            destination: dropoffCoords,
                            origin: pickupCoords,
                            travelMode: 'DRIVING',
                        }}
                        callback={(result, status) => {
                            if (status === 'OK') {
                                setDirectionsResponse(result);
                            } else {
                                console.error('Directions request failed due to ' + status);
                            }
                        }}
                    />
                )}

                {/* Directions Renderer to draw route */}
                {directionsResponse && (
                    <DirectionsRenderer
                        options={{
                            directions: directionsResponse,
                            suppressMarkers: true, // Hide default markers (you already render them)
                        }}
                    />
                )}
            </GoogleMap>
        </LoadScript>
    );
};

export default DriverMapscreen;
