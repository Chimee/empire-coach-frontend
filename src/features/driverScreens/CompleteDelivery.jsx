import React from 'react';
import './style.css';
import Button from '../../components/shared/buttons/button';
import tripSvgImage from '../../images/tripEnded.svg';
import { Image } from 'react-bootstrap';
import CorrectSvg from '../../svgFiles/CorrectSvg';
import { useNavigate, useParams } from 'react-router';
import { useGetJobPickupDetailsQuery } from '../../app/driverApi/driverApi';

const CompleteDelivery = () => {
    const navigate = useNavigate();
    const { id, driverId } = useParams();
    const { data: jobDetails, isLoading } =
        useGetJobPickupDetailsQuery({ id }, { skip: !id });

    const linkExpired = jobDetails?.data?.jobData?.isLinkExpired;
    return (
        <div className='mobile_wrapper position-relative d-flex flex-column px-3 pt-3 gap-4 justify-content-center tripStarts'>
            <Image
                src={tripSvgImage}
                alt="trip-complete"
                className="trip-picture"
            />

            <div className='picupForm text-center'>
                <h6 className='d-flex gap-2 align-items-center justify-content-center highlight'>
                    <CorrectSvg /> Trip Complete
                </h6>
                <p className='mt-2'>
                    {linkExpired
                        ? "This delivery job is now closed."
                        : "Thanks for completing your trip. You can upload remaining documents within 48 hours."}
                </p>

                {!linkExpired && (
                    <Button
                        label="Submit Delivery Report"
                        className="rounded w-100 mt-3"
                        onClick={() =>
                            navigate(`/upload-documents/jobId/${id}/driver/${driverId}`, {
                                state: { request_status: 'delivered' }
                            })
                        }
                    />
                )}

                <small className="text-muted d-block mt-2">
                    {linkExpired
                        ? ""
                        : "You can also upload documents later from your trip history."}
                </small>
            </div>
        </div>
    );
};

export default CompleteDelivery;
