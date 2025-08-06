import React ,{useState}from 'react'
import './style.css'
import { DriverLocationSvg } from '../../svgFiles/DriverLocationSvg'
import { DriverDropLocationSvg } from '../../svgFiles/DriverDropLocationSvg'
import { useParams, useLocation, useNavigate } from 'react-router'
import toast from "react-hot-toast";
import { useGetJobPickupDetailsQuery,useStartRideMutation} from '../../app/driverApi/driverApi'

import Button from '../../components/shared/buttons/button'
const RideDeatails = () => {
const { id, driverId } = useParams();
const navigate = useNavigate()
debugger;
    const { data: jobDetails} = useGetJobPickupDetailsQuery({ id }, {skip: !id});
    const[starRide ,{isLoading}] = useStartRideMutation();
    console.log(jobDetails);


   const handleCheckout = async () => {
    try {
        const res = await starRide({ jobId: id, driverId });
        console.log(res)
        if (res?.data) {
            navigate(`/start-pickup/jobId/${id}/driver/${driverId}`);
        }
    } catch (error) {
        console.error("Error starting ride", error);
    }
};
    return (
        <div className='mobile_wrapper position-relative d-flex flex-column'>
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6396957.383016897!2d-99.66486626180465!3d38.47577194024099!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb9fe5f285e3d%3A0x8b5109a227086f55!2sCalifornia%2C%20USA!5e0!3m2!1sen!2sin!4v1753956070095!5m2!1sen!2sin"
                width="600" height="170" style={{ border: 0 }} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            <div className='loaction flex-grow-1'>
                <ul className='p-0 pt-3'>
                    <li className='d-flex gap-2 pickupLoc position-relative pb-3'>
                        <DriverLocationSvg className="shrink-0" />
                        <div className='loc-details d-flex flex-column gap-2'>
                            <h6>Pickup Details</h6>
                            <span className='d-block'>{jobDetails?.data?.jobData.pickup_date}</span>
                            <span className='d-block'>{jobDetails?.data?.jobData.pickup_location}</span>
                            <span className='d-block'>Contact : {jobDetails?.data?.jobData.pickup_POC_name}</span>
                            <span className='d-block'>Phone : {jobDetails?.data?.jobData.pickup_POC_phone}</span>
                            <span className='d-block'>Notes :{jobDetails?.data?.jobData.pickup_additional_note}</span>
                        </div>
                    </li>
                    <li className='d-flex gap-2'>
                        <DriverDropLocationSvg className="flex-shrink-0 bg-white z-3" />
                        <div className='loc-details d-flex flex-column gap-2'>

                            <h6>Drop-off details</h6>
                            <span className='d-block'>{jobDetails?.data?.jobData.dropoff_location}</span>
                            <span className='d-block'>{jobDetails?.data?.jobData.dropoff_date}</span>
                            <span className='d-block'>Phone :{jobDetails?.data?.jobData.dropoff_POC_phone}</span>
                            <span className='d-block'>Note : {jobDetails?.data?.jobData.dropoff_additional_note}</span>
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
                    {jobDetails?.data?.jobData?.deliver_washed && (
                   <p className='mob-body d-block m-0'>Deliver Wash</p>
                    )}
                </div>
            </div>
            {!jobDetails?.data?.jobData.isLinkExpired && (
                <div className='text-center px-3 pb-3'>
                {jobDetails?.data?.jobData.request_status === "delivered" ? (
                    <Button label='Upload Trip Documents' className='rounded w-100'
                    onClick = {()=>navigate(`/upload-documents/jobId/${id}/driver/${driverId}`)}/>    
                ): <Button label='Start Check-in' className='rounded w-100'
                onClick={()=>handleCheckout()} /> }
                </div>
                )}
        </div>
    )
}

export default RideDeatails