import React, { useState, useEffect } from 'react'
import PageHead from '../../components/shared/pageHead/PageHead'
import Breadcrumb from '../../components/shared/breadcrumb/Breadcrumb'
import { Row, Col } from 'react-bootstrap'
import { CarSvg } from '../../svgFiles/CarSvg'
import './job.css'
import Button from '../../components/shared/buttons/button'
import { useParams, useLocation } from 'react-router'
import { useGetJobDetailsQuery } from '../../app/customerApi/customerApi'
import { formatDateToMDY, formatTimeTo12Hour, formatDateTimeInTimezone } from '../../helpers/Utils'
import CancelConfirmationModal from '../../components/shared/modalContent/CancelJobModal'
import ReScheduleDate from '../../components/shared/modalContent/ReschceduleDate'
import { getClassAndTitleByStatus } from '../../helpers/Utils'
import { LuClock } from "react-icons/lu";
import { useGetRideDetailsQuery } from '../../app/adminApi/adminApi'
import { useGetUpdateLocationLogsQuery } from "../../app/globalApi"
import TickSvg from '../../images/tickSvg.svg'
import DriverMapscreen from '../driverScreens/DriverMapscreen'
import { getLocationName } from '../../helpers/Utils'
import CommonModal from '../../components/shared/modalLayout/CommonModal'

const JobDetails = () => {
    const { id } = useParams();

    const { data: jobDetails, isLoading } = useGetJobDetailsQuery({ id }, { skip: !id });
    const { state } = useLocation();
    const isCompleted = state?.completed
    const statusMeta = getClassAndTitleByStatus(jobDetails?.data?.jobData?.request_status);
    const { data: fetchRideDetails } = useGetRideDetailsQuery({ id }, { skip: !id });
    const checking_vehicle_photo = fetchRideDetails?.data?.vehicle_photo
    const delivery_vehicle_photo = fetchRideDetails?.data?.delivery_photos
    const [cancelConfirmation, setCancelConfirmation] = useState(false);
    const [reScheduleConfirmation, setRescheduleConfirmation] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const jobData = jobDetails?.data?.jobData;
    const driverId = jobData?.driver_id;
    const { data: getLocationUpdates } = useGetUpdateLocationLogsQuery(
        { id, driverId },
        { skip: !id || !driverId }
    );

    const [locationNames, setLocationNames] = useState([]);

    // Get user timezone from job data
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;


    useEffect(() => {
        async function fetchLocationNames() {
            if (!getLocationUpdates?.data) return;

            const names = await Promise.all(
                getLocationUpdates.data.map(async (log) => {
                    return await getLocationName(log.latitude, log.longitude);
                })
            );

            setLocationNames(names);
        }

        fetchLocationNames();
    }, [getLocationUpdates]);

    const pickupCoords = { lat: jobData?.pickup_latitude, lng: jobData?.pickup_longitude } || null;
    const dropoffCoords = { lat: jobData?.dropoff_latitude, lng: jobData?.dropoff_longitude } || null;

    const breadcrumbItems = [
        {
            name: isCompleted ? 'Completed jobs' : 'Jobs',
            path: isCompleted ? '/completed-jobs' : '/jobs',
        },
        { name: `${jobDetails?.data?.jobData?.id}` },
    ];

    return (
        <>
            <Row>
                <Col lg={12}>
                    <div className='d-flex gap-3 justify-content-between align-items-center'>
                        <div className='job_info'>
                            <Breadcrumb items={breadcrumbItems} />
                            <PageHead
                                title={'Jobs'}
                                description={`Created On: ${formatDateToMDY(jobDetails?.data?.jobData?.createdAt)}`}
                            />
                            {jobDetails?.data?.jobData?.request_status && (
                                <span className={`${statusMeta.className} fn-badge mt-4 text-capitalize`}>{jobDetails.data.jobData.request_status}</span>
                            )}
                        </div>
                        <div className='d-flex gap-2'>
                            {jobDetails?.data?.jobData?.request_status === 'awaiting_for_cancellation' ? (
                                <span className="d-flex align-items-center gap-1 text-warning fw-bold align-self-center">
                                    <LuClock className="me-1" /> Awaiting Cancellation
                                </span>
                            ) : jobDetails?.data?.jobData?.request_status === 'submitted' ? (
                                <>
                                    <Button
                                        label="Reschedule job"
                                        className={'btn-square rounded'}
                                        onClick={() => setRescheduleConfirmation(true)}
                                    />
                                    <Button
                                        label={"Cancel"}
                                        type='button'
                                        className={'btn-square rounded btn-cancel'}
                                        onClick={() => setCancelConfirmation(true)}
                                    />
                                </>
                            ) : jobDetails?.data?.jobData?.request_status === 'approved' ? (
                                <>
                                    <Button
                                        label="Reschedule job"
                                        className={'btn-square rounded'}
                                        onClick={() => setRescheduleConfirmation(true)}
                                    />
                                    <Button
                                        label="Cancel"
                                        className={'btn-square rounded'}
                                        onClick={() => setCancelConfirmation(true)}
                                    />
                                </>
                            ) : jobDetails?.data?.jobData?.request_status === 'awaiting_reschedule_date' ? (
                                <>
                                    <Button
                                        label="Select Reschedule Date/Time"
                                        className={'btn-square rounded'}
                                        onClick={() => setRescheduleConfirmation(true)}
                                    />
                                    <Button
                                        label="Cancel"
                                        className={'btn-square rounded'}
                                        onClick={() => setCancelConfirmation(true)}
                                    />
                                </>)
                                : jobDetails?.data?.jobData?.request_status === 'rescheduled' ? (
                                    <>
                                        <Button
                                            label="Reschedule job"
                                            className={'btn-square rounded'}
                                            onClick={() => setRescheduleConfirmation(true)}
                                        />
                                        <Button
                                            label="Cancel"
                                            className={'btn-square rounded'}
                                            onClick={() => setCancelConfirmation(true)}
                                        />
                                    </>
                                ) : null}
                        </div>
                    </div>
                </Col>

                <Col lg={9} className='mt-5'>
                    <h6 className='small-heading'>Job Details</h6>
                    <Row className='mt-5'>
                        <Col lg={12}>
                            <Row>
                                <Col lg={6}>
                                    <h6 className='small-heading'>Vehicle Details</h6>
                                    <ul className='p-0 job-list-bullets'>
                                        <li>{jobDetails?.data?.jobData.vehicle_year} {jobDetails?.data?.jobData.vehicle_make} {jobDetails?.data?.jobData.vehicle_model}</li>
                                        <li>VIN : {jobDetails?.data?.jobData.vin_number}</li>
                                        <li>Fuel Type: {jobDetails?.data?.jobData.fuel_type}</li>
                                        {jobDetails?.data?.jobData?.po_number && (
                                            <li>PO Number: {jobDetails?.data?.jobData?.po_number}</li>
                                        )}
                                    </ul>
                                </Col>
                                <Col lg={6}>
                                    <h6 className='small-heading'>Service options</h6>
                                    <ul className='p-0 job-list-bullets'>
                                        {jobDetails?.data?.jobData.deliver_washed === true && <li>Deliver washed</li>}
                                        {jobDetails?.data?.jobData.deliver_full === true && <li>Deliver full</li>}
                                        {jobDetails?.data?.jobData.send_driver_contact_info === true && <li>Send driver contact info</li>}
                                    </ul>
                                </Col>
                            </Row>
                            <Row className='pt-3'>
                                <Col lg={6}>
                                    <h6 className='small-heading'>Pickup Details</h6>
                                    <ul className='p-0 job-list-bullets'>
                                        <li>{jobDetails?.data?.jobData?.pickup_business_name}</li>
                                        <li>{jobDetails?.data?.jobData?.pickup_location}</li>
                                        <li>
                                            {jobData?.pickup_datetime_utc && userTimezone ?
                                                formatDateTimeInTimezone(jobData.pickup_datetime_utc, userTimezone) :
                                                `${formatDateToMDY(jobDetails?.data?.jobData?.pickup_date)} ${formatTimeTo12Hour(jobDetails?.data?.jobData?.pickup_time)}`
                                            }
                                        </li>
                                        <li>Time Relaxation: {jobDetails?.data?.jobData?.pickup_time_relaxation ? 'Yes' : 'No'}</li>
                                        <li>Contact: {jobDetails?.data?.jobData?.pickup_POC_name}</li>
                                        <li>Phone: {jobDetails?.data?.jobData?.raw_pickup_POC_phone}</li>
                                        {jobDetails?.data?.jobData?.pickup_additional_note?.trim() && (
                                            <li>Pickup Notes: {jobDetails?.data?.jobData?.pickup_additional_note}</li>
                                        )}
                                    </ul>
                                </Col>
                                <Col lg={6}>
                                    <h6 className='small-heading'>Drop-off Details</h6>
                                    <ul className='p-0 job-list-bullets'>
                                        <li>{jobDetails?.data?.jobData?.dropoff_business_name}</li>
                                        <li>{jobDetails?.data?.jobData?.dropoff_location}</li>
                                        <li>
                                            {jobData?.dropoff_datetime_utc && userTimezone ?
                                                formatDateTimeInTimezone(jobData.dropoff_datetime_utc, userTimezone) :
                                                `${formatDateToMDY(jobDetails?.data?.jobData?.dropoff_date)} ${formatTimeTo12Hour(jobDetails?.data?.jobData?.dropoff_time)}`
                                            }
                                        </li>
                                        <li>Time Relaxation: {jobDetails?.data?.jobData?.dropoff_time_relaxation ? 'Yes' : 'No'}</li>
                                        <li>Contact: {jobDetails?.data?.jobData?.dropoff_POC_name}</li>
                                        <li>Phone: {jobDetails?.data?.jobData?.raw_dropoff_POC_phone}</li>
                                        {jobDetails?.data?.jobData?.dropoff_additional_note?.trim() && (
                                            <li>Dropoff Notes: {jobDetails?.data?.jobData?.dropoff_additional_note}</li>
                                        )}
                                    </ul>
                                </Col>
                            </Row>
                            <Col lg={12} className='mt-3'>
                                <DriverMapscreen
                                    height="247px"
                                    pickupCoords={pickupCoords} dropoffCoords={dropoffCoords} />
                            </Col>
                            <Col lg={12} className='mt-3'>
                                <h6 className='small-heading'>Location Tracking</h6>

                                {getLocationUpdates?.data?.length > 0 ? (
                                    <ul className="p-0 timeline d-flex flex-column gap-3 mt-3 tripProgress">
                                        {getLocationUpdates.data.map((log, i) => (
                                            <li
                                                key={i}
                                                className="d-flex gap-3 align-items-center position-relative"
                                            >
                                                <img src={TickSvg} alt="tick" className="position-relative z-3" />
                                                <div className="timeline_status">
                                                    <span className="d-block text-capitalize">
                                                        {locationNames[i] || "Loading..."}
                                                    </span>
                                                    <span>{formatDateToMDY(log?.createdAt)}</span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="mt-3 text-muted">No location updates available.</p>
                                )}
                            </Col>

                            {/* Photos Section */}
                            <Row className='mt-4'>
                                {checking_vehicle_photo && checking_vehicle_photo.length > 0 && (
                                    <>
                                        <Col lg={12}>
                                            <h6 className='small-heading'>Check-in Photos</h6>
                                        </Col>
                                        {checking_vehicle_photo.map((curelem, index) => {
                                            return (
                                                <Col lg={2} key={index} className='mb-2'>
                                                    <div
                                                        className='rounded bg-body-secondary'
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={() => {
                                                            setSelectedImage(curelem);
                                                            setShowImageModal(true);
                                                        }}
                                                    >
                                                        <img
                                                            src={curelem}
                                                            alt="vehicle check-in"
                                                            className='img-fluid'
                                                            style={{ height: '100px', objectFit: 'cover', width: '100%' }}
                                                        />
                                                    </div>
                                                </Col>
                                            )
                                        })}
                                    </>
                                )}

                                {delivery_vehicle_photo && delivery_vehicle_photo.length > 0 && (
                                    <>
                                        <Col lg={12} className='mt-2'>
                                            <h6 className='small-heading'>Delivery Photos</h6>
                                        </Col>
                                        {delivery_vehicle_photo.map((curelem, index) => {
                                            return (
                                                <Col lg={2} key={index} className='mb-2'>
                                                    <div
                                                        className='rounded bg-body-secondary'
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={() => {
                                                            setSelectedImage(curelem);
                                                            setShowImageModal(true);
                                                        }}
                                                    >
                                                        <img
                                                            src={curelem}
                                                            alt="delivery"
                                                            className='img-fluid'
                                                            style={{ height: '100px', objectFit: 'cover', width: '100%' }}
                                                        />
                                                    </div>
                                                </Col>
                                            )
                                        })}
                                    </>
                                )}
                            </Row>
                        </Col>
                    </Row>
                </Col>

                {/* Right Sidebar - Driver and Timeline */}
                <Col lg={3} className='mt-5'>
                    {/* Driver Section */}
                    {(
                        jobDetails?.data?.jobData?.request_status === "approved" ||
                        jobDetails?.data?.jobData?.request_status === "in-transit" ||
                        jobDetails?.data?.jobData?.request_status === "delivered"
                    ) && (
                            <>
                                <h6 className='small-heading'>Driver</h6>
                                {!jobDetails?.data?.jobData?.driverName ? (
                                    <div className="no-driver">
                                        <CarSvg />
                                        <h5 className="mb-4">Driver not assigned</h5>
                                    </div>
                                ) : (
                                    <div className="driver-driver d-flex gap-3 align-items-center mb-4">
                                        <img
                                            className='object-fit-cover rounded-5'
                                            src={jobDetails?.data?.jobData?.profile_Picture}
                                            alt="user"
                                            width={40}
                                            height={40}
                                        />
                                        <h5>{jobDetails?.data?.jobData?.driverName}</h5>
                                    </div>
                                )}
                            </>
                        )}

                    {/* Timeline Section */}
                    <h6 className='timeline-title mt-5'>Timeline</h6>
                    <ul className='p-0 timeline d-flex flex-column gap-3 mt-3'>
                        {jobDetails?.data?.jobLogs?.length > 0 ? (
                            jobDetails.data.jobLogs.map((logs, index) => (
                                <li key={index} className='d-flex gap-3 align-items-center'>
                                    <span className='d-flex justify-content-center rounded-5 align-items-center flex-shrink-0 timeline-count'>
                                        {index + 1}
                                    </span>
                                    <div className='timeline_status'>
                                        <span className='d-block text-capitalize'>
                                            {logs?.request_status}
                                            {(logs?.User?.username || logs?.Driver?.name) && (
                                                <span className='text-muted ms-2'>
                                                    by <strong>{logs?.User?.username || logs?.Driver?.name}</strong>
                                                </span>
                                            )}
                                        </span>
                                        <span>
                                            {userTimezone ?
                                                formatDateTimeInTimezone(logs?.createdAt, userTimezone) :
                                                formatDateToMDY(logs?.createdAt)
                                            }
                                        </span>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li className='text-center text-muted'>No timeline available</li>
                        )}
                    </ul>
                </Col>
            </Row>

            {/* Modals */}
            {cancelConfirmation && (
                <CancelConfirmationModal
                    show={cancelConfirmation}
                    setShow={setCancelConfirmation}
                    jobId={id}
                    user="customer"
                    type="cancel"
                />
            )}
            {reScheduleConfirmation && (
                <ReScheduleDate
                    show={reScheduleConfirmation}
                    setShow={setRescheduleConfirmation}
                    type="reschedule"
                    reqstatus={jobDetails?.data?.jobData.request_status}
                    jobId={id}
                />
            )}

            <CommonModal
                show={showImageModal}
                setShow={setShowImageModal}
                title="Image Preview"
                className="image-preview-modal"
            >
                <div className='text-center'>
                    <img
                        src={selectedImage}
                        alt="Preview"
                        className='img-fluid w-100'
                        style={{ maxHeight: '70vh', objectFit: 'contain' }}
                    />
                </div>
            </CommonModal>
        </>
    )
}

export default JobDetails