import React, { useEffect, useState } from 'react'
import PageHead from '../../components/shared/pageHead/PageHead'
import Breadcrumb from '../../components/shared/breadcrumb/Breadcrumb'
import { Row, Col } from 'react-bootstrap'
import { CarSvg } from '../../svgFiles/CarSvg'
import './job.css'
import Button from '../../components/shared/buttons/button'
import { PendingCarSvg } from '../../svgFiles/PendingCarSvg'
import { useParams, useLocation } from 'react-router'
import { useGetAdminJobDetailsQuery, useCancelJobsAdminMutation, useApproveJobsByAdminMutation, useDeclineJobCancelReqAdminMutation, useSendLinkAdminMutation, useGetRideDetailsQuery } from '../../app/adminApi/adminApi'
import { formatDateToMDY, formatTimeTo12Hour } from '../../helpers/Utils'
import toast from "react-hot-toast";
import CancelConfirmationModal from '../../components/shared/modalContent/CancelJobModal'
import AssignDriverModal from '../../components/shared/modalContent/AssignDriverPopup'
import {
    useGetAllTripDocumentsQuery
} from '../../app/driverApi/driverApi';
import { getClassAndTitleByStatus } from '../../helpers/Utils'
import { useGetUpdateLocationLogsQuery } from "../../app/globalApi"
import TickSvg from '../../images/tickSvg.svg'
import DriverMapscreen from '../driverScreens/DriverMapscreen'
import { getLocationName } from '../../helpers/Utils'
import EditAddressModal from "../../components/shared/modalContent/EditAddressModal"
import { FaPencilAlt } from 'react-icons/fa';
import { LoadScript } from "@react-google-maps/api";

const AdminJobDetails = () => {
    const { id } = useParams();
    const { data: jobDetails } = useGetAdminJobDetailsQuery({ id }, { skip: !id });
  
    console.log(jobDetails);
    const { state } = useLocation();
    const [sentLink, setSentLink] = useState(false)

    const [cancelJobAdmin, { isLoading: isCancelling }] = useCancelJobsAdminMutation();
    const [declineCanceljobReq, { isLoading: isDeclining }] = useDeclineJobCancelReqAdminMutation();
    const [sendLink, { isLoading: isSending }] = useSendLinkAdminMutation()
    const [cancelConfirmationPopup, setCancelConfirmation] = useState(false);
    const [assignDriverPopup, setAssignDriverPopup] = useState(false)
    const [approveJob, { isLoading: isApproving }] = useApproveJobsByAdminMutation();
    const jobData = jobDetails?.data?.jobData;
    const driverId = jobData?.driver_id;
    const { data: fetchTripDocuments } = useGetAllTripDocumentsQuery({ id, driverId: driverId }, { skip: !id || !driverId });
    const { data: getLocationUpdates } = useGetUpdateLocationLogsQuery(
        { id, driverId },
        { skip: !id || !driverId }
    );

    const [editAddressModal, setEditAddressModal] = useState(false);
    const [selectedAddressData, setSelectedAddressData] = useState(null);
    console.log(selectedAddressData, "selectedAddressData");

    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [selectedAddressType, setSelectedAddressType] = useState('pickup');
    const [locationNames, setLocationNames] = useState([]);

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

    const { data: fetchRideDetails } = useGetRideDetailsQuery({ id }, { skip: !id });

    const vehicle_photo = fetchRideDetails?.data?.delivery_photos

    const breadcrumbItems = [
        { name: 'Jobs', path: '/admin-jobs' },
        { name: `${jobDetails?.data?.jobData?.id}` },
    ];
    //cancel job by admin
    const handleCancelApproveJob = async () => {
        try {
            await cancelJobAdmin({ jobId: id }).unwrap();
        }
        catch (err) {
            toast.error(err?.data?.message || "Cancellation failed", "err")
        }
    };

    const handleCancelJob = async () => {
        try {
            await declineCanceljobReq({ jobId: id }).unwrap();
        }
        catch (err) {
            toast.error(err?.data?.message || "Decline Cancellation request failed", 'err')
        }
    }

    const handleSendLink = async () => {
        try {
            const res = await sendLink({ jobId: id, driverId: jobDetails?.data?.jobData?.driver_id });
            setSentLink(true);
        }
        catch (err) {
            toast.error(err?.data?.message || "send link to driver failed", 'err')
        }
    };

    //approve job by admin
    const handleApproveJob = async () => {
        try {
            await approveJob({ jobId: id }).unwrap();
            // if (jobDetails?.data?.jobData?.request_status === 'submitted') {
            //     setAssignDriverPopup(true);
            // }
        } catch (err) {
            toast.error(err?.data?.message || "Job approval failed", 'err');
        }
    };
    const statusMeta = getClassAndTitleByStatus(jobDetails?.data?.jobData?.request_status);
    const pickupCoords = { lat: jobDetails?.data?.jobData?.pickup_latitude, lng: jobDetails?.data?.jobData?.pickup_longitude } || null;
    const dropoffCoords = { lat: jobDetails?.data?.jobData?.dropoff_latitude, lng: jobDetails?.data?.jobData?.dropoff_longitude } || null;
    return (
        <>
            <Row>
                <Col lg={12}>
                    <div className='d-flex gap-3 justify-content-between align-items-center'>
                        <div className='job_info'>
                            <Breadcrumb items={breadcrumbItems} />
                            <PageHead
                                title="Jobs"
                                description={`Created On: ${formatDateToMDY(jobDetails?.data?.jobData?.createdAt)}`}
                            />
                            <span className={`${statusMeta?.className} fn-badge mt-4 text-capitalize`}>{jobDetails?.data?.jobData?.request_status}</span>
                            {["awaiting_for_cancellation", "cancelled"].includes(jobDetails?.data?.jobData?.request_status) && (
                                <p className='fn-tag mt-4'>Cancel Reason: {jobDetails?.data?.jobData?.cancellation_reason}</p>
                            )}
                        </div>
                        <div className='d-flex gap-2'>
                            {jobDetails?.data?.jobData?.request_status === 'awaiting_for_cancellation' ? (
                                <>
                                    <Button label={'Decline'} className={'btn-square cancel rounded'}
                                        onClick={() => handleCancelJob()}
                                    />
                                    <Button disabled={isCancelling} label={isCancelling ? 'Approving' : "Approve"} className={'btn-square rounded'}
                                        onClick={() => handleCancelApproveJob()} />

                                </>
                            ) : jobDetails?.data?.jobData?.request_status === 'submitted' ? (
                                <>
                                    <Button
                                        label={"Cancel"}
                                        className={'btn-square rounded bordered '}
                                        onClick={() => setCancelConfirmation(true)}
                                    />
                                    <Button
                                        label={isApproving ? "Approving" : "Approve"}
                                        disabled={isApproving}
                                        className={'btn-square rounded'}
                                        onClick={() => handleApproveJob()}
                                    />
                                </>
                            ) : jobDetails?.data?.jobData?.request_status === 'awaiting_reschedule_date' ? (
                                <>
                                    <Button
                                        label="Cancel"
                                        className={'btn-square rounded bordered '}
                                        onClick={() => setCancelConfirmation(true)}
                                    />

                                </>)
                                : jobDetails?.data?.jobData?.request_status === 'rescheduled' ? (
                                    <>
                                        <Button
                                            label="Cancel"
                                            className={'btn-square rounded bordered '}
                                            onClick={() => setCancelConfirmation(true)}
                                        />
                                        <Button
                                            label={isApproving ? "Approving" : "Approve"}
                                            disabled={isApproving}
                                            className={'btn-square rounded'}
                                            onClick={() => handleApproveJob()}
                                        />
                                    </>
                                ) : jobDetails?.data?.jobData?.request_status === 'approved' ? (
                                    <>
                                        <Button
                                            label="Cancel"
                                            className={'btn-square rounded bordered '}
                                            onClick={() => setCancelConfirmation(true)}
                                        />
                                    </>
                                ) :
                                    null}
                        </div>
                    </div>


                </Col>
                <Col lg={9} className='mt-5'>
                    <h6 className='small-heading'>Job Details</h6>
                    <Row className='mt-5'>
                        <Col lg={9}>
                            <h6 className='small-heading'>{jobDetails?.data?.jobData?.company_name}</h6>
                            <p className="text-muted small  mb-4">
                                Requested by: {jobDetails?.data?.jobData?.customer_name}
                            </p>

                            <Row>
                                <Col lg={6}>
                                    <h6 className='small-heading'>Vehicle Details</h6>
                                    <ul className='p-0 job-list-bullets'>
                                        <li>{jobDetails?.data?.jobData.vehicle_year} {jobDetails?.data?.jobData.vehicle_make} {jobDetails?.data?.jobData.vehicle_model}</li>
                                        <li>VIN : {jobDetails?.data?.jobData?.vin_number}</li>
                                        <li>Fuel Type: {jobDetails?.data?.jobData?.fuel_type}</li>
                                        {jobDetails?.data?.jobData?.po_number && (
                                            <li>PO Number: {jobDetails?.data?.jobData?.po_number}</li>
                                        )}
                                    </ul>
                                </Col>
                                <Col lg={6}>
                                    <h6 className='small-heading mt-0'>Service options</h6>
                                    <ul className='p-0 job-list-bullets'>
                                        {jobDetails?.data?.jobData.deliver_washed === true && <li>Deliver washed</li>}
                                        {jobDetails?.data?.jobData.deliver_full === true && <li>Deliver full</li>}
                                        {jobDetails?.data?.jobData?.send_driver_contact_info === true && <li>Send driver contact info</li>}
                                    </ul>
                                </Col>
                            </Row>
                            <Row className='pt-3'>
                                <Col lg={6}>
                                    <h6 className='small-heading'>Pickup Details</h6>
                                    <ul className='p-0 job-list-bullets'>
                                        <li>
                                         {jobDetails?.data?.jobData?.pickup_business_name}
                                        </li>
                                        <li>
                                            {jobDetails?.data?.jobData?.pickup_location}
                                            <FaPencilAlt
                                                className="ms-2 cursor-pointer"
                                                onClick={() => {
                                                    setSelectedAddressId(jobDetails?.data?.jobData?.id);
                                                    setSelectedAddressData({
                                                        address: jobDetails?.data?.jobData?.pickup_location,
                                                        label: jobDetails?.data?.jobData?.pickup_business_name || jobDetails?.data?.jobData?.pickup_location,
                                                        pickup_latitude: jobDetails?.data?.jobData?.pickup_latitude,
                                                        pickup_longitude: jobDetails?.data?.jobData?.pickup_longitude,
                                                        dropoff_latitude: jobDetails?.data?.jobData?.dropoff_latitude,
                                                        dropoff_longitude: jobDetails?.data?.jobData?.dropoff_longitude
                                                    });
                                                    setSelectedAddressType("pickup");
                                                    setEditAddressModal(true);
                                                }}
                                            />
                                        </li>
                                        <li>
                                            {formatDateToMDY(jobDetails?.data?.jobData?.pickup_date)} {formatTimeTo12Hour(jobDetails?.data?.jobData?.pickup_time)}
                                        </li>
                                        <li>Contact: {jobDetails?.data?.jobData?.pickup_POC_name}</li>
                                        <li>Phone: {jobDetails?.data?.jobData?.pickup_POC_phone}</li>
                                        <li>Notes: {jobDetails?.data?.jobData?.pickup_additional_note}</li>
                                    </ul>
                                </Col>
                                <Col lg={6}>
                                    <h6 className='small-heading'>Drop-off Details</h6>
                                    <ul className='p-0 job-list-bullets'>
                                        <li>
                                         {jobDetails?.data?.jobData?.dropoff_business_name}
                                        </li>
                                        <li>
                                            {jobDetails?.data?.jobData?.dropoff_location}
                                            <FaPencilAlt
                                                className="ms-2 cursor-pointer"
                                                onClick={() => {
                                                    setSelectedAddressId(jobDetails?.data?.jobData?.id);
                                                    setSelectedAddressData({
                                                        address: jobDetails?.data?.jobData?.dropoff_location,
                                                        label: jobDetails?.data?.jobData?.dropoff_business_name || jobDetails?.data?.jobData?.dropoff_location,
                                                        pickup_latitude: jobDetails?.data?.jobData?.pickup_latitude,
                                                        pickup_longitude: jobDetails?.data?.jobData?.pickup_longitude,
                                                        dropoff_latitude: jobDetails?.data?.jobData?.dropoff_latitude,
                                                        dropoff_longitude: jobDetails?.data?.jobData?.dropoff_longitude
                                                    });
                                                    setSelectedAddressType("dropoff");
                                                    setEditAddressModal(true);
                                                }}
                                            />
                                        </li>
                                        <li>
                                            {formatDateToMDY(jobDetails?.data?.jobData?.dropoff_date)} {formatTimeTo12Hour(jobDetails?.data?.jobData?.dropoff_time)}
                                        </li>
                                        <li>Contact: {jobDetails?.data?.jobData?.dropoff_POC_name}</li>
                                        <li>Phone: {jobDetails?.data?.jobData?.dropoff_POC_phone}</li>
                                        <li>Notes: {jobDetails?.data?.jobData?.dropoff_additional_note}</li>
                                    </ul>
                                </Col>

                            </Row>
                            <Col lg={12} className='mt-3'>
                                {/* {console.log(pickupCoords,"pickupCoords")
                               } */}
                                <DriverMapscreen
                                    height="247px"
                                    pickupCoords={pickupCoords} dropoffCoords={dropoffCoords} />

                            </Col>
                            <Col lg={12} className='mt-3'>
                                <h6 className='small-heading'>Location Tracking</h6>

                                {Array.isArray(getLocationUpdates?.data) && getLocationUpdates.data.length > 0 ? (
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
                            <Row>
                                {vehicle_photo?.map((curelem, index) => {
                                    return (
                                        <Col lg={3} key={index}>
                                            <div className='rounded bg-body-secondary'>
                                                <img src={curelem} alt="picture" className='img-fluid' />
                                            </div>
                                        </Col>

                                    )
                                })}
                            </Row>
                            {/* Trip Documents */}
                            <h6 className='small-heading mt-4'>Trip Documents</h6>
                            <Row>
                                {fetchTripDocuments?.data?.map((doc, index) => {
                                    let otherReceipts = [];
                                    try {
                                        otherReceipts = doc.other_receipts ? JSON.parse(doc.other_receipts) : [];
                                    } catch (err) {
                                        console.error("Error parsing other_receipts:", err);
                                    }

                                    return (
                                        <Col lg={12} key={index} className="mb-3">
                                            {/* Daily Driver Log */}
                                            {doc.daily_driver_log && (
                                                <div className="mb-2">
                                                    <strong>Daily Driver Log:</strong><br />
                                                    <a href={doc.daily_driver_log} target="_blank" rel="noopener noreferrer" className="text-primary">
                                                        View Document
                                                    </a>
                                                </div>
                                            )}

                                            {/* Flight Confirmation */}
                                            {doc.flight_confirmation && (
                                                <div className="mb-2">
                                                    <strong>Flight Confirmation:</strong><br />
                                                    <a href={doc.flight_confirmation} target="_blank" rel="noopener noreferrer" className="text-primary">
                                                        View Document
                                                    </a>
                                                </div>
                                            )}

                                            {/* Fuel Receipt */}
                                            {doc.fuel_receipt && (
                                                <div className="mb-2">
                                                    <strong>Fuel Receipt:</strong><br />
                                                    <a href={doc.fuel_receipt} target="_blank" rel="noopener noreferrer" className="text-primary">
                                                        View Document
                                                    </a>
                                                </div>
                                            )}

                                            {/* Hotel Receipt */}
                                            {doc.hotel_receipt && (
                                                <div className="mb-2">
                                                    <strong>Hotel Receipt:</strong><br />
                                                    <a href={doc.hotel_receipt} target="_blank" rel="noopener noreferrer" className="text-primary">
                                                        View Document
                                                    </a>
                                                </div>
                                            )}

                                            {/* Additional Notes */}
                                            {doc.additional_notes && (
                                                <div className="mb-2">
                                                    <strong>Additional Notes:</strong><br />
                                                    <span>{doc.additional_notes}</span>
                                                </div>
                                            )}

                                            {/* Other Receipts */}
                                            {otherReceipts.length > 0 && (
                                                <div className="mb-2">
                                                    <strong>Other Receipts:</strong>
                                                    <ul className="mt-1">
                                                        {otherReceipts.map((item, i) => (
                                                            <li key={i}>
                                                                <a href={item.location} target="_blank" rel="noopener noreferrer" className="text-primary">
                                                                    View Document {i + 1}
                                                                </a>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </Col>
                                    );
                                })}
                            </Row>

                        </Col>
                        <Col lg={3}>
                            <h6 className='timeline-title'>Timeline</h6>
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
                                                    {logs?.User?.username && (
                                                        <span className='text-muted ms-2'>
                                                            by <strong>{logs.User.username}</strong>
                                                        </span>
                                                    )}
                                                </span>

                                                <span>{formatDateToMDY(logs?.createdAt)}</span>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <li className='text-center text-muted'>No timeline available</li>
                                )}

                            </ul>
                        </Col>
                    </Row>
                </Col>
                <Col lg={3}>
                    {(jobDetails?.data?.jobData?.request_status === "approved" ||
                        jobDetails?.data?.jobData?.request_status === "in-transit" ||
                        jobDetails?.data?.jobData?.request_status === "delivered") && (
                            <>
                                <h6 className="small-heading">Driver</h6>
                                {(!jobDetails?.data?.jobData?.driver_name ||
                                    jobDetails?.data?.jobData?.driver_name === "Driver not assigned") ?
                                    <div className="no-driver">
                                        <CarSvg />
                                        <h5 className="mb-4">
                                            Driver not assigned
                                        </h5>
                                    </div>
                                    : <div className="driver-driver d-flex gap-3 align-items-center mb-4">
                                        <img className='object-fit-cover rounded-5' src={jobDetails?.data?.jobData?.profile_Picture} alt="picture" width={40} height={40} />
                                        <h5 className="">
                                            {jobDetails?.data?.jobData?.driver_name}
                                        </h5>
                                    </div>
                                }

                                {(
                                    jobDetails?.data?.jobData?.request_status === "approved"
                                ) && (
                                        !jobDetails?.data?.jobData?.driver_name ||
                                            jobDetails?.data?.jobData?.driver_name === "Driver not assigned" ? (
                                            <Button
                                                label="Assign Driver"
                                                className="rounded w-75 m-auto"
                                                onClick={() => setAssignDriverPopup(true)}
                                            />
                                        ) : (
                                            <Button
                                                loading={isSending}
                                                label="Send Link"
                                                className="rounded w-75 m-auto"
                                                onClick={() => handleSendLink()}
                                            />
                                        )
                                    )}
                            </>
                        )}

                </Col>

            </Row>



            <EditAddressModal
                show={editAddressModal}
                setShow={setEditAddressModal}
                handleClose={() => setEditAddressModal(false)}
                addressId={selectedAddressId}
                addressData={selectedAddressData}
                message="you want to edit this address?"
                type={selectedAddressType}
                jobId={jobData?.id} />


            <CancelConfirmationModal
                show={cancelConfirmationPopup}
                setShow={setCancelConfirmation}
                jobId={id}
                user="admin"
                type=""
            />

            <AssignDriverModal
                show={assignDriverPopup}
                setShow={setAssignDriverPopup}
                jobId={id} />
        </>


    )
}

export default AdminJobDetails 