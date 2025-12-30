import React, { useState, useEffect } from 'react';
import './style.css';
import Button from '../../components/shared/buttons/button';
import { DriverLocationSvg } from '../../svgFiles/DriverLocationSvg';
import { DriverDropLocationSvg } from '../../svgFiles/DriverDropLocationSvg';
import {
    useGetJobPickupDetailsQuery,
    useUpdateRideDetailsMutation
} from '../../app/driverApi/driverApi';
import { useParams, useNavigate } from 'react-router';
import { useGetRideDetailsQuery } from '../../app/adminApi/adminApi';
import toast from "react-hot-toast";
import DriverMapscreen from './DriverMapscreen';

const RideStatusScreen = () => {
    const [show, setShow] = useState(false);
    const [updatedLocation, setUpdatedLocation] = useState(false);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [locationError, setLocationError] = useState(null);

    const navigate = useNavigate();
    const { id, driverId } = useParams();

    const [updateLocation, { isLoading }] = useUpdateRideDetailsMutation();
    const { data: jobDetails } = useGetJobPickupDetailsQuery({ id }, { skip: !id });
    const { data: fetchRideDetails } = useGetRideDetailsQuery({ id }, { skip: !id });

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

    // 🔴 Check HTTPS on load
    useEffect(() => {
        if (window.location.protocol !== "https:" && window.location.hostname !== "localhost") {
            setLocationError("Location access requires HTTPS. Please open this link in a secure (HTTPS) browser.");
        }
    }, []);

    const handleUpdateLocation = async () => {
        setLocationError(null);

        if (!navigator.geolocation) {
            setLocationError("Your device does not support location services.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                const location = { lat: latitude, lng: longitude };
                setCurrentLocation(location);

                const formData = new FormData();
                formData.append("jobId", id);
                formData.append("driverId", driverId);
                formData.append("current_latitude", latitude);
                formData.append("current_longitude", longitude);
                formData.append("ride_status", "ride_started");

                try {
                    const res = await updateLocation(formData).unwrap();
                    toast.success(res?.data?.message || "Location updated");
                    setUpdatedLocation(true);
                } catch (error) {
                    toast.error(error?.data?.message || "Update ride details failed");
                }
            },
            (error) => {
                let msg = "Unable to fetch location.";
                if (error.code === error.PERMISSION_DENIED) {
                    msg = "Location permission denied. Please allow location access to continue the trip.";
                } else if (error.code === error.POSITION_UNAVAILABLE) {
                    msg = "Location information is unavailable.";
                } else if (error.code === error.TIMEOUT) {
                    msg = "Location request timed out. Try again.";
                }

                setLocationError(msg);
                toast.error(msg);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    return (
        <div className='mobile_wrapper position-relative d-flex flex-column'>
            {locationError && (
                <div className="location-error-banner text-center p-3">
                    <strong>⚠ Location Required</strong>
                    <p className="mb-0">{locationError}</p>
                    <small>Please enable GPS & allow location permission.</small>
                </div>
            )}

            <div className='flex-grow-1'>
                <DriverMapscreen
                    pickupCoords={pickupCoords}
                    dropoffCoords={dropoffCoords}
                    currentLocation={currentLocation || backendCurrentLocation || null}
                    height="100%"
                />
            </div>

            <div className='aboveMap'>
                <div className='job_view position-relative pt-2'>
                    <div className='d-flex justify-content-center'>
                        <span
                            className='arrow_down'
                            onClick={() => setShow(!show)}
                        ></span>
                    </div>

                    <div className='driverJob'>
                        <p>Job #{pickup?.id}</p>
                        <span className='en-route'>En-Route</span>
                        <p>
                            {pickup?.vehicle_year} {pickup?.vehicle_make} {pickup?.vehicle_model}
                        </p>

                        <div className='d-flex'>
                            <ul className='p-0 m-0 flex-grow-1 border-end'>
                                <li className='pickupLoc d-flex gap-2 align-items-center pb-3'>
                                    <DriverLocationSvg />
                                    {pickup?.pickup_location}
                                </li>
                                <li className='d-flex gap-2 align-items-center'>
                                    <DriverDropLocationSvg />
                                    {pickup?.dropoff_location}
                                </li>
                            </ul>
                        </div>
                    </div>

                    {show && (
                        <div className='text-center pb-3 d-flex flex-column gap-3 mt-3'>
                            <Button
                                label={isLoading ? 'Updating...' : 'Update Location'}
                                className='rounded w-100 bordered'
                                onClick={handleUpdateLocation}
                                disabled={isLoading}
                            />

                            <Button
                                label='Upload Trip Documents'
                                className='rounded w-100 bordered'
                                onClick={() =>
                                    navigate(`/upload-documents/jobId/${id}/driver/${driverId}`)
                                }
                            />

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
