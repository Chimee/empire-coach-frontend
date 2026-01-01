import React, { useState } from 'react';
import './style.css';
import Button from '../../components/shared/buttons/button';
import { DriverLocationSvg } from '../../svgFiles/DriverLocationSvg';
import { DriverDropLocationSvg } from '../../svgFiles/DriverDropLocationSvg';
import { useGetJobPickupDetailsQuery, useUpdateRideDetailsMutation } from '../../app/driverApi/driverApi';
import { useParams, useNavigate } from 'react-router';
import { useGetRideDetailsQuery } from '../../app/adminApi/adminApi'
import toast from "react-hot-toast";
import DriverMapscreen from './DriverMapscreen';


const RideStatusScreen = () => {
    const [show, setShow] = useState(false);
    const [updatedLocation, setUpdateLocation] = useState(false);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [locationMessage, setLocationMessage] = useState("");

    const navigate = useNavigate();

    const [updateLocation, { isLoading: isUpdating }] = useUpdateRideDetailsMutation();
    const { id, driverId } = useParams();
    const { data: jobDetails } = useGetJobPickupDetailsQuery({ id }, { skip: !id });
    const { data: fetchRideDetails } = useGetRideDetailsQuery({ id }, { skip: !id });


    const rideData = fetchRideDetails?.data || {};
    const backendCurrentLocation = rideData?.current_latitude && rideData?.current_longitude
        ? { lat: rideData.current_latitude, lng: rideData.current_longitude }
        : null;


    const pickup = jobDetails?.data?.jobData;
    const pickupCoords = pickup ? { lat: pickup.pickup_latitude, lng: pickup.pickup_longitude } : null;
    const dropoffCoords = pickup ? { lat: pickup.dropoff_latitude, lng: pickup.dropoff_longitude } : null;

    const handleUpdateLocation = async () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            return;
        }

        const isLocalhost =
            window.location.hostname === "localhost" ||
            window.location.hostname === "127.0.0.1";

        const isHttps = window.location.protocol === "https:";
        const isMobileDevice = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

        if (!isHttps && !isLocalhost && !isMobileDevice) {
            toast.error("Location access requires HTTPS");
            return;
        }


        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                const location = { lat: latitude, lng: longitude };
                setCurrentLocation(location);
                setLocationMessage("");

                const formData = new FormData();
                formData.append("jobId", id);
                formData.append("driverId", driverId);
                formData.append("checkin_mileage", null);
                formData.append("damage_notes", null);
                formData.append("current_latitude", latitude);
                formData.append("current_longitude", longitude);
                formData.append("ending_mileage", null);
                formData.append("delivery_notes", null);
                formData.append("ride_status", "ride_started");

                try {
                    const res = await updateLocation(formData).unwrap();
                    toast.success(res?.data?.message || "Location updated");
                    setUpdateLocation(true);
                } catch (error) {
                    toast.error(error?.data?.message || "Update ride details failed");
                }
            },

            (error) => {
                let message = "Unable to fetch location.";

                if (error.code === error.PERMISSION_DENIED) {
                    message =
                        "Location access is blocked.\n\n" +
                        "iPhone users:\n" +
                        "Settings → Privacy & Security → Location Services → Safari Websites → Allow While Using App\n" +
                        "Also make sure Precise Location is ON.\n\n" +
                        "Then refresh this page.";
                }
                else if (error.code === error.POSITION_UNAVAILABLE) {
                    message = "Location is unavailable. Please turn on GPS.";
                }
                else if (error.code === error.TIMEOUT) {
                    message = "Location request timed out. Please move to open area and try again.";
                }

                setLocationMessage(message);
            },

            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );

    };

    return (
        <div className='mobile_wrapper position-relative d-flex flex-column'>
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
                        <div className="d-flex justify-content-center mt-2">
                            <button
                                className="toggle-btn"
                                onClick={() => setShow(!show)}
                            >
                                {show ? "Hide Details ▲" : "Show Details ▼"}
                            </button>
                        </div>
                    </div>

                    <div className='driverJob'>
                        <p>Job #{pickup?.id}</p>
                        <span className='en-route'>En-Route</span>
                        <p>
                            {pickup?.vehicle_year} {pickup?.vehicle_make} {pickup?.vehicle_model} ({pickup?.fuel_type})
                        </p>

                        <div className='d-flex'>
                            <ul className='p-0 m-0 flex-grow-1 border-end'>
                                <li className='pickupLoc position-relative align-items-center pb-3 gap-2 d-flex'>
                                    <DriverLocationSvg className="shrink-0 bg-white z-3" />
                                    {pickup?.pickup_location}
                                </li>
                                <li className='d-flex gap-2 align-items-center'>
                                    <DriverDropLocationSvg className="flex-shrink-0 bg-white z-3" />
                                    {pickup?.dropoff_location}
                                </li>
                            </ul>
                            <ul className='pl-1 mb-0 text-black'>
                                <li className='text-center'>
                                    <strong>
                                        {new Date().toLocaleString('en-US', { month: 'short' })} <br />
                                        {new Date().getDate()}/{new Date().getFullYear()}
                                    </strong>
                                </li>
                                <li className='text-center'>
                                    {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                                </li>
                            </ul>
                        </div>
                    </div>

                    {show && (
                        <div className='text-center pb-3 d-flex flex-column gap-3 mt-3'>
                            {locationMessage && (
                                <div className="location-info-card">
                                    <div className="info-left">
                                        <span className="info-icon">ℹ️</span>
                                    </div>

                                    <div className="info-content">
                                        {locationMessage.split("\n").map((line, i) => (
                                            <div key={i}>{line}</div>
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
                                label='Update Location'
                                className='rounded w-100 bordered'
                                onClick={handleUpdateLocation}
                            />

                            <Button
                                label='Upload Trip Documents'
                                className='rounded w-100 bordered'
                                onClick={() => navigate(
                                    `/upload-documents/jobId/${id}/driver/${driverId}`,
                                    { state: { request_status: pickup?.request_status } }
                                )}
                            />

                            {!updatedLocation && (
                                <p className="text-danger small text-center mb-1">
                                    Please update your current location to start delivery
                                </p>
                            )}

                            <Button
                                label='Start Delivery Check-Out'
                                className='rounded w-100'
                                disabled={!updatedLocation}
                                onClick={() => navigate(`/end-pickup/jobId/${id}/driver/${driverId}`)}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RideStatusScreen;
