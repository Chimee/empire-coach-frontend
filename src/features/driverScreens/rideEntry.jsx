import { useGetJobPickupDetailsQuery, useStartRideMutation } from '../../app/driverApi/driverApi'
import RideDeatails from './rideDeatails';
import RideStatusScreen from './RideStatusScreen';
import UploadDocument from './UploadDocument';
import { useParams } from 'react-router';


const RideEntry = () => {
    const { id, driverId } = useParams();
    const { data: jobDetails, isLoading } =
        useGetJobPickupDetailsQuery({ id }, { skip: !id });
    // const { data: rideDetails } = useGetRideDetailsQuery({ id });
    const rideStatus =jobDetails?.data?.jobData.request_status 

    if (!rideStatus) return null;

    if (rideStatus === "approved") {
        return <RideDeatails />;
    }

    if (rideStatus === "ride_started" || rideStatus === "in_transit") {
        return <RideStatusScreen />;
    }

    if (rideStatus === "delivered") {
        return <UploadDocument />;
    }

    return null;
};

export default RideEntry;

