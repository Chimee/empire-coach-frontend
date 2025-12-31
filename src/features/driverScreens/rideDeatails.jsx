import React, { useState, useEffect } from 'react'
import './style.css'
import { DriverLocationSvg } from '../../svgFiles/DriverLocationSvg'
import { DriverDropLocationSvg } from '../../svgFiles/DriverDropLocationSvg'
import { useParams, useLocation, useNavigate } from 'react-router'
import toast from "react-hot-toast";
import { useGetJobPickupDetailsQuery, useStartRideMutation } from '../../app/driverApi/driverApi'
import { formatDateToMDY, formatTimeTo12Hour } from '../../helpers/Utils'

import Button from '../../components/shared/buttons/button'
import DriverMapscreen from './DriverMapscreen'
const RideDeatails = () => {
    const { id, driverId } = useParams();
    const navigate = useNavigate()

    const { data: jobDetails } = useGetJobPickupDetailsQuery({ id }, { skip: !id });
    const [starRide, { isLoading }] = useStartRideMutation();
    const [currentLocation, setCurrentLocation] = useState(null);

    

    const pickup = jobDetails?.data?.jobData;
    const pickupCoords = pickup ? { lat: pickup.pickup_latitude, lng: pickup.pickup_longitude } : null;
    const dropoffCoords = pickup ? { lat: pickup.dropoff_latitude, lng: pickup.dropoff_longitude } : null;
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCurrentLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error("Geolocation error:", error);
                }
            );
        }
    }, []);

    const handleCheckout = async () => {
        try {
            const res = await starRide({ jobId: id, driverId });
            if (res) {
                navigate(`/start-pickup/jobId/${id}/driver/${driverId}`);
            }
        } catch (error) {
            console.error("Error starting ride", error);
        }
    };
    return (
        <div className='mobile_wrapper position-relative d-flex flex-column'>
            <DriverMapscreen
                pickupCoords={pickupCoords}
                dropoffCoords={dropoffCoords}
                currentLocation={currentLocation}
                height="100%"
            />
            <div className='loaction flex-grow-1'>
                <ul className='p-0 pt-3'>
                    <li className='d-flex gap-2 pickupLoc position-relative pb-3'>
                        <DriverLocationSvg className="shrink-0" />
                        <div className='loc-details d-flex flex-column gap-2'>
                            <h6>Pickup Details</h6>
                            <span className='d-block'>{jobDetails?.data?.jobData.pickup_business_name}</span>
                            <span className='d-block'>{jobDetails?.data?.jobData.pickup_location}</span>
                            <span className='d-block'>{formatDateToMDY(jobDetails?.data?.jobData?.pickup_date)} {formatTimeTo12Hour(jobDetails?.data?.jobData?.pickup_time)}</span>
                            <span className='d-block'>Contact : {jobDetails?.data?.jobData.pickup_POC_name}</span>
                            <span className='d-block'>Phone : {jobDetails?.data?.jobData.raw_pickup_POC_phone}</span>
                            <span className='d-block'>Notes :{jobDetails?.data?.jobData.pickup_additional_note}</span>
                        </div>
                    </li>
                    <li className='d-flex gap-2'>
                        <DriverDropLocationSvg className="flex-shrink-0 bg-white z-3" />
                        <div className='loc-details d-flex flex-column gap-2'>
                            <h6>Drop-off details</h6>
                            <span className='d-block'>{jobDetails?.data?.jobData.dropoff_business_name}</span>
                            <span className='d-block'>{jobDetails?.data?.jobData.dropoff_location}</span>
                            {jobDetails?.data?.jobData.dropoff_date && (
                                <span className='d-block'>{formatDateToMDY(jobDetails?.data?.jobData?.dropoff_date)} {formatTimeTo12Hour(jobDetails?.data?.jobData?.dropoff_time)}</span>
                            )}
                            <span className='d-block'>Phone :{jobDetails?.data?.jobData.raw_dropoff_POC_phone}</span>
                            <span className='d-block'>Notes : {jobDetails?.data?.jobData.dropoff_additional_note}</span>
                        </div>
                    </li>
                </ul>
                <div className='d-flex gap-2 flex-column'>
                    <h2 className='mob-heading mb-0'>Vehicle Details</h2>
                    <p className='mob-body d-block m-0'> {jobDetails?.data?.jobData.vehicle_year} {jobDetails?.data?.jobData.vehicle_make} {jobDetails?.data?.jobData.vehicle_model}</p>
                    <p className='mob-body d-block m-0'>VIN : {jobDetails?.data?.jobData.vin_number}</p>
                    <p className='mob-body d-block m-0'>Fuel Type: {jobDetails?.data?.jobData.fuel_type}</p>
                </div>
                <div className='d-flex gap-2 flex-column mt-3'>
                    <h2 className='mob-heading mb-0'>Service Option</h2>
                    <ul className='p-0 job-list-bullets'>
                        {jobDetails?.data?.jobData.deliver_washed === true && <li>Deliver washed</li>}
                        {jobDetails?.data?.jobData.deliver_full === true && <li>Deliver full</li>}
                        {jobDetails?.data?.jobData?.send_driver_contact_info === true && <li>Send driver contact info</li>}
                    </ul>
                </div>
            </div>
            {!jobDetails?.data?.jobData?.isLinkExpired && (
                <div className='text-center px-3 pb-3'>
                    {jobDetails?.data?.jobData.request_status === "delivered" ? (
                        <Button
                            label='Upload Trip Documents'
                            className='rounded w-100 bordered'
                            onClick={() => navigate(
                                `/upload-documents/jobId/${id}/driver/${driverId}`,
                                { state: { request_status: jobDetails?.data?.jobData?.request_status } }
                            )}
                        />
                    ) : <Button label='Start Check-in' className='rounded w-100'
                        onClick={() => handleCheckout()} />}
                </div>
            )}
        </div>
    )
}

export default RideDeatails