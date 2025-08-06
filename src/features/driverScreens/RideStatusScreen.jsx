
import React ,{useState} from 'react'
import './style.css'
import Button from '../../components/shared/buttons/button'
import { DriverLocationSvg } from '../../svgFiles/DriverLocationSvg'
import { DriverDropLocationSvg } from '../../svgFiles/DriverDropLocationSvg'
import { useGetJobPickupDetailsQuery, useUpdateRideDetailsMutation } from '../../app/driverApi/driverApi'
import { useParams, useNavigate } from 'react-router'
import toast from "react-hot-toast";


const RideStatusScreen = () => {
    const [show, setShow] = React.useState(false);
    const navigate = useNavigate();  
    const [updateLocation, { isLoading: isUpdating }] = useUpdateRideDetailsMutation()
    const[updatedLocation,setUpdateLocation] = useState(false)
    const { id, driverId } = useParams();
    const { data: jobDetails } = useGetJobPickupDetailsQuery({ id }, { skip: !id });
    console.log(jobDetails, "jobDetails");

    const handleUpdateLocation = async () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            return;
        }

        if (window.location.protocol !== "https:" && window.location.hostname !== "localhost") {
            toast.error("Location access requires HTTPS");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                console.log("Current Location:", latitude, longitude);
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
                    const res = await updateLocation(
                        formData
                    ).unwrap();

                    toast.success(res.data.message);
                    setUpdateLocation(true)
                    
                    console.log(res);
                } catch (error) {
                    console.error(error?.data?.message, error);
                    toast.error(error?.data?.message || "Update ride details failed");
                }
            },
            (error) => {
                console.error("Geolocation error:", error);
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        toast.error("Permission denied for location access");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        toast.error("Location information is unavailable");
                        break;
                    case error.TIMEOUT:
                        toast.error("Location request timed out");
                        break;
                    default:
                        toast.error("An unknown error occurred while fetching location");
                }
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };


    return (
        <div className='mobile_wrapper position-relative d-flex flex-column'>
            <div className='flex-grow-1'>

                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6396957.383016897!2d-99.66486626180465!3d38.47577194024099!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb9fe5f285e3d%3A0x8b5109a227086f55!2sCalifornia%2C%20USA!5e0!3m2!1sen!2sin!4v1753956070095!5m2!1sen!2sin"
                    width="600" height="100%" style={{ border: 0 }} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>
            <div className='aboveMap'>
                <div className='job_view position-relative pt-2'>
                    <div className='d-flex justify-content-center'> <span className='arrow_down' onClick={() => setShow(!show)}></span></div>
                    <div className='driverJob'>
                        <p>Job #{jobDetails?.data?.jobData.id}</p>
                        <span className='en-route'>En-Route</span>
                        <p>{jobDetails?.data?.jobData.vehicle_year} {jobDetails?.data?.jobData.vehicle_make} {jobDetails?.data?.jobData.vehicle_model} ({jobDetails?.data?.jobData.fuel_type})</p>
                        <div className='d-flex'>
                            <ul className='p-0 m-0 flex-grow-1 border-end'>
                                <li className='pickupLoc position-relative align-items-center pb-3'>
                                    <DriverLocationSvg className="shrink-0 bg-white z-3" />{jobDetails?.data?.jobData.pickup_location}
                                </li>
                                <li className='d-flex gap-2 align-items-center'>
                                    <DriverDropLocationSvg className="flex-shrink-0 bg-white z-3" />{jobDetails?.data?.jobData.dropoff_location}
                                </li>

                            </ul>
                            <ul className='pl-1 mb-0 text-black'>
                                <li className='text-center'><strong>Apr <br /> 09/2025</strong></li>
                                <li className='text-center'>3:30PM</li>
                            </ul>
                        </div>
                    </div>
                    {show &&
                        <div className='text-center pb-3 d-flex flex-column gap-3 mt-3'>
                            <Button label='Update Location' className='rounded w-100 bordered'
                                onClick={() => handleUpdateLocation()} />
                            <Button label='Upload Trip Documents' className='rounded w-100 bordered'
                            onClick={()=>navigate(`/upload-documents/jobId/${id}/driver/${driverId}`)} />                        
                            <Button label='Start Delivery Check-Out' className='rounded w-100' disabled = {!updatedLocation} 
                            onClick={()=>navigate(`/end-pickup/jobId/${id}/driver/${driverId}`)}/>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default RideStatusScreen