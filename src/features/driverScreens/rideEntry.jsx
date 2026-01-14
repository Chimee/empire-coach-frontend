import { useGetJobPickupDetailsQuery } from '../../app/driverApi/driverApi';
import RideDetails from './rideDeatails'; // Fixed typo if applicable
import RideStatusScreen from './RideStatusScreen';
import UploadDocument from './UploadDocument';
import { useParams } from 'react-router';

const RideEntry = () => {
    const { id } = useParams();
    const { data: jobDetails, isLoading, isError } = 
        useGetJobPickupDetailsQuery({ id }, { skip: !id });
    const rideStatus = jobDetails?.data?.jobData?.request_status;
    if (isLoading) return <div>Loading ride details...</div>;
    if (isError || !rideStatus) return <div>Unable to load ride information.</div>;
    switch (rideStatus) {
        case "approved":
        case "delivered":
            return <RideDetails />;
        
        case "ride_started":
        case "in_transit":
            return <RideStatusScreen />;

        default:
            return <div>Unknown status: {rideStatus}</div>;
    }
};

export default RideEntry;