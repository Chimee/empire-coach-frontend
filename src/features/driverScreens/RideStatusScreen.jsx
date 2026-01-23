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
import { formatDateToMDY, formatTimeTo12Hour } from '../../helpers/Utils'


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

            <DriverMapscreen
                pickupCoords={pickupCoords}
                dropoffCoords={dropoffCoords}
                currentLocation={currentLocation || backendCurrentLocation || null}
                height="50vh"
            />
            <div className='aboveMap'>
                <div className='job_view position-relative pt-2'>
                    {/* Toggle Button - Always Visible */}
                    <div className='d-flex justify-content-center mb-3'>
                        <button
                            className="toggle-btn"
                            onClick={() => setShow(!show)}
                        >
                            {show ? "Hide Details ▲" : "Show Details ▼"}
                        </button>
                    </div>

                    {/* Compact header – always visible */}
                    <div className='driverJob mb-3'>
                        <p>Job #{pickup?.id}</p>
                        <span className='class-in-transit fn-badge mt-4 text-capitalize'>{(pickup?.request_status == 'in_transit' ? "In-Transit" :"In-Transit")}</span>
                    </div>

                    {/* SHOW DETAILS - Collapsible Section */}
                    {show && (
                        <div className='pb-3 px-2 d-flex flex-column gap-3'>
                            {/* Pickup & Drop-off */}
                            <div className='driverJob'>
                                <div className='d-flex location-wrapper'>
                                    <ul className='p-0 m-0 flex-grow-1 border-end'>
                                        <li className='d-flex gap-2 pb-3 pickupLoc'>
                                            <div className="">
                                                <DriverLocationSvg className="shrink-0" />
                                            </div>
                                            <div className='loc-details d-flex flex-column gap-1'>
                                                <h6>Pickup Details</h6>
                                                <span>{pickup?.pickup_business_name}</span>
                                                <span>{pickup?.pickup_location}</span>
                                                <span>
                                                    {formatDateToMDY(pickup?.pickup_date)}{" "}
                                                    {formatTimeTo12Hour(pickup?.pickup_time)}
                                                </span>
                                                <span>Contact: {pickup?.pickup_POC_name}</span>
                                                <span>Phone: {pickup?.raw_pickup_POC_phone}</span>
                                                {pickup?.pickup_additional_note && (
                                                    <span>Notes: {pickup?.pickup_additional_note}</span>
                                                )}
                                            </div>
                                        </li>

                                        <li className='d-flex gap-2'>
                                            <DriverDropLocationSvg className="shrink-0" />
                                            <div className='loc-details d-flex flex-column gap-1'>
                                                <h6>Drop-off Details</h6>
                                                <span>{pickup?.dropoff_business_name}</span>
                                                <span>{pickup?.dropoff_location}</span>
                                                {pickup?.dropoff_date && (
                                                    <span>
                                                        {formatDateToMDY(pickup?.dropoff_date)}{" "}
                                                        {formatTimeTo12Hour(pickup?.dropoff_time)}
                                                    </span>
                                                )}
                                                <span>Phone: {pickup?.raw_dropoff_POC_phone}</span>
                                                {pickup?.dropoff_additional_note && (
                                                    <span>Notes: {pickup?.dropoff_additional_note}</span>
                                                )}
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Vehicle + Services */}
                            <div className='d-flex gap-2'>
                                {/* Vehicle */}
                                <div className='driverJob flex-grow-1'>
                                    <h6 className='mb-2'>Vehicle</h6>
                                    <p className='mb-1 small'>
                                        {pickup?.vehicle_year} {pickup?.vehicle_make} {pickup?.vehicle_model}
                                    </p>
                                    <p className='mb-1 small'>VIN: {pickup?.vin_number}</p>
                                    <p className='mb-0 small'>Fuel: {pickup?.fuel_type}</p>
                                </div>

                                {/* Services */}
                                <div className='driverJob text-end' style={{ minWidth: '45%' }}>
                                    <h6 className='mb-2'>Services</h6>
                                    <ul className='mb-0 p-0 small list-unstyled text-end'>
                                        {pickup?.deliver_washed && <li>Washed</li>}
                                        {pickup?.deliver_full && <li>Full Tank</li>}
                                        {pickup?.send_driver_contact_info && <li>Share Contact</li>}
                                        {!pickup?.deliver_washed &&
                                            !pickup?.deliver_full &&
                                            !pickup?.send_driver_contact_info && (
                                                <li>None</li>
                                            )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons - Always Visible at Bottom */}
                    <div className='pb-3 px-2 d-flex flex-column gap-3 mt-3'>
                        {/* Location Message */}
                        {locationMessage && (
                            <div className="location-info-card">
                                <div className="info-content">
                                    {locationMessage.split("\n").map((line, i) => (
                                        <div key={i}>{line}</div>
                                    ))}
                                </div>
                                <span className="info-close" onClick={() => setLocationMessage("")}>×</span>
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
                            onClick={() =>
                                navigate(`/upload-documents/jobId/${id}/driver/${driverId}`, {
                                    state: { request_status: pickup?.request_status }
                                })
                            }
                        />

                        {!updatedLocation && (
                            <p className="text-danger small text-center mb-0">
                                Please update your current location to start delivery
                            </p>
                        )}

                        <Button
                            label='Start Delivery'
                            className='rounded w-100'
                            disabled={!updatedLocation}
                            onClick={() => navigate(`/end-pickup/jobId/${id}/driver/${driverId}`)}
                        />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default RideStatusScreen;