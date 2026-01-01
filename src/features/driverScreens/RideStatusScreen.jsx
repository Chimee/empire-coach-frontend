import React, { useState } from 'react';
import './style.css';
import Button from '../../components/shared/buttons/button';
import { DriverLocationSvg } from '../../svgFiles/DriverLocationSvg';
import { DriverDropLocationSvg } from '../../svgFiles/DriverDropLocationSvg';
import { useGetJobPickupDetailsQuery, useUpdateRideDetailsMutation } from '../../app/driverApi/driverApi';
import { useParams, useNavigate } from 'react-router';
import { useGetRideDetailsQuery } from '../../app/adminApi/adminApi';
import toast from "react-hot-toast";
import DriverMapscreen from './DriverMapscreen';

const RideStatusScreen = () => {
    const [show, setShow] = useState(false);
    const [updatedLocation, setUpdateLocation] = useState(false);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [locationMessage, setLocationMessage] = useState("");
    const [locationAttempts, setLocationAttempts] = useState(0);

    const navigate = useNavigate();
    const { id, driverId } = useParams();

    const [updateLocation, { isLoading: isUpdating }] =
        useUpdateRideDetailsMutation();

    const { data: jobDetails } =
        useGetJobPickupDetailsQuery({ id }, { skip: !id });

    const { data: fetchRideDetails } =
        useGetRideDetailsQuery({ id }, { skip: !id });

    const rideData = fetchRideDetails?.data || {};
    const backendCurrentLocation =
        rideData?.current_latitude && rideData?.current_longitude
            ? { lat: rideData.current_latitude, lng: rideData.current_longitude }
            : null;

    const pickup = jobDetails?.data?.jobData;
    const pickupCoords = pickup
        ? { lat: pickup.pickup_latitude, lng: pickup.pickup_longitude }
        : null;

    const dropoffCoords = pickup
        ? { lat: pickup.dropoff_latitude, lng: pickup.dropoff_longitude }
        : null;

    const handleUpdateLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation not supported");
            return;
        }

        setLocationMessage("");

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                setCurrentLocation({ lat: latitude, lng: longitude });
                setLocationAttempts(0);

                const formData = new FormData();
                formData.append("jobId", id);
                formData.append("driverId", driverId);
                formData.append("current_latitude", latitude);
                formData.append("current_longitude", longitude);
                formData.append("ride_status", "ride_started");

                try {
                    await updateLocation(formData).unwrap();
                    toast.success("Location updated successfully");
                    setUpdateLocation(true);
                } catch (err) {
                    toast.error("Failed to update location");
                }
            },
            (error) => {
                setLocationAttempts(prev => prev + 1);
                if (locationAttempts < 1) {
                    setLocationMessage(
                        "Fetching your location…\nPlease tap “Update Location” again."
                    );
                    return;
                }

                if (error.code === error.PERMISSION_DENIED) {
                    setLocationMessage(
                        "Location access is blocked.\n\n" +
                        "iPhone steps:\n" +
                        "Settings → Privacy & Security → Location Services\n" +
                        "→ Safari Websites → Allow While Using App\n" +
                        "→ Turn ON Precise Location\n\n" +
                        "Then refresh this page."
                    );
                } else if (error.code === error.POSITION_UNAVAILABLE) {
                    setLocationMessage(
                        "GPS signal not available.\n" +
                        "Please turn on location services\n" +
                        "and move to an open area."
                    );
                } else if (error.code === error.TIMEOUT) {
                    setLocationMessage(
                        "Location request timed out.\nPlease try again."
                    );
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    };

    return (
        <div className='mobile_wrapper position-relative d-flex flex-column'>
            <div className='flex-grow-1'>
                <DriverMapscreen
                    pickupCoords={pickupCoords}
                    dropoffCoords={dropoffCoords}
                    currentLocation={currentLocation || backendCurrentLocation}
                    height="100%"
                />
            </div>

            <div className='aboveMap'>
                <div className='job_view position-relative pt-2'>
                    <div className='d-flex justify-content-center'>
                        <span
                            className='arrow_down'
                            onClick={() => setShow(!show)}
                        />
                    </div>

                    <div className='driverJob'>
                        <p>Job #{pickup?.id}</p>
                        <span className='en-route'>En-Route</span>
                        <p>
                            {pickup?.vehicle_year} {pickup?.vehicle_make}{' '}
                            {pickup?.vehicle_model} ({pickup?.fuel_type})
                        </p>
                    </div>

                    {show && (
                        <div className='text-center pb-3 d-flex flex-column gap-3 mt-3'>

                            {locationMessage && (
                                <div className="location-info-card">
                                    <span className="info-icon">ℹ️</span>
                                    <div className="info-content">
                                        {locationMessage.split("\n").map((l, i) => (
                                            <div key={i}>{l}</div>
                                        ))}
                                    </div>
                                    <span
                                        className="info-close"
                                        onClick={() => setLocationMessage("")}
                                    >
                                        ×
                                    </span>
                                </div>
                            )}

                            <Button
                                label={isUpdating ? "Updating..." : "Update Location"}
                                className='rounded w-100 bordered'
                                disabled={isUpdating}
                                onClick={handleUpdateLocation}
                            />

                            <Button
                                label='Upload Trip Documents'
                                className='rounded w-100 bordered'
                                onClick={() =>
                                    navigate(
                                        `/upload-documents/jobId/${id}/driver/${driverId}`,
                                        { state: { request_status: pickup?.request_status } }
                                    )
                                }
                            />

                            {!updatedLocation && (
                                <p className="text-warning small text-center">
                                    Update your location to start delivery
                                </p>
                            )}

                            <Button
                                label='Start Delivery Check-Out'
                                className='rounded w-100'
                                disabled={!updatedLocation}
                                onClick={() =>
                                    navigate(`/end-pickup/jobId/${id}/driver/${driverId}`)
                                }
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RideStatusScreen;
