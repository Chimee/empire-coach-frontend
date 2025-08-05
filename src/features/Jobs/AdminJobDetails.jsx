import React, { useEffect, useState } from 'react'
import PageHead from '../../components/shared/pageHead/PageHead'
import Breadcrumb from '../../components/shared/breadcrumb/Breadcrumb'
import { Row, Col } from 'react-bootstrap'
import { CarSvg } from '../../svgFiles/CarSvg'
import './job.css'
import Button from '../../components/shared/buttons/button'
import { PendingCarSvg } from '../../svgFiles/PendingCarSvg'
import { useParams, useLocation } from 'react-router'
import { useGetAdminJobDetailsQuery, useCancelJobsAdminMutation, useApproveJobsByAdminMutation, useDeclineJobCancelReqAdminMutation } from '../../app/adminApi/adminApi'
import { formatDateToMDY, formatTimeTo12Hour } from '../../helpers/Utils'
import toast from "react-hot-toast";
import CancelConfirmationModal from '../../components/shared/modalContent/CancelJobModal'
import AssignDriverModal from '../../components/shared/modalContent/AssignDriverPopup'
import { getClassAndTitleByStatus } from '../../helpers/Utils'
const AdminJobDetails = () => {
    const { id } = useParams();
    const { data: jobDetails } = useGetAdminJobDetailsQuery({ id }, {skip: !id});
    debugger;
    const {state} = useLocation();
    console.log(state)
    console.log(jobDetails, "jobDetails");

    const [cancelJobAdmin, { isLoading: isCancelling }] = useCancelJobsAdminMutation();
    const [declineCanceljobReq, { isLoading: isDeclining }] = useDeclineJobCancelReqAdminMutation();
    const [cancelConfirmationPopup, setCancelConfirmation] = useState(false);
    const [assignDriverPopup, setAssignDriverPopup] = useState(false)
    const [approveJob, { isLoading: isApproving }] = useApproveJobsByAdminMutation();



    const breadcrumbItems = [
        { name: 'Jobs', path: '/admin-jobs' },
        { name: 'Job-441022022' },
    ];
    //cancel job by admin
    const handleCancelApproveJob = async () => {
        try {
            await cancelJobAdmin({ jobId: id }).unwrap();
        }
        catch (err) {
            toast.error(err?.data?.message || "Cancellation failed")

        }
    };

    const handleCancelJob = async () => {
        try {
            debugger;
            await declineCanceljobReq({ jobId: id }).unwrap();
        }
        catch (err) {
            toast.error(err?.data?.message || "Decline Cancellation request failed")
        }
    }

    //approve job by admin
    const handleApproveJob = async () => {
        try {
            await approveJob({ jobId: id }).unwrap();
            if (jobDetails?.data?.jobData?.request_status === 'submitted') {
                setAssignDriverPopup(true);
            }
        } catch (err) {
            toast.error(err?.data?.message || "Job approval failed");
        }
    };
    const statusMeta = getClassAndTitleByStatus(jobDetails?.data?.jobData?.request_status);

    return (
        <>
            <Row>
                <Col lg={12}>

                    <div className='d-flex gap-3 justify-content-between align-items-center'>
                        <div className='job_info'>
                            <Breadcrumb items={breadcrumbItems} />
                            <PageHead
                                title={'Jobs'}
                                description={'Created on Apr 14/2025, 3:30PM'}
                            />
                            <span className={`${statusMeta?.className} fn-badge mt-4 text-capitalize`}>{jobDetails?.data?.jobData?.request_status}</span>
                            {["awaiting_for_cancellation", "cancelled"].includes(jobDetails?.data?.jobData?.request_status) && (
                                <p className='fn-tag mt-4'>Cancel Reason: {jobDetails?.data?.jobData?.request_status}</p>
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

                            <Row>
                                <Col lg={6}>
                                    <h6 className='small-heading'>Vehicle Details</h6>
                                    <ul className='p-0 job-list-bullets'>
                                        <li>2022 Ford Transit</li>
                                        <li>VIN : {jobDetails?.data?.jobData?.vin_number}</li>
                                        <li>Fuel Type: {jobDetails?.data?.jobData?.fuel_type}</li>
                                        <li>PO Number:{jobDetails?.data?.jobData?.po_number}</li>
                                    </ul>
                                </Col>
                                <Col lg={6}>
                                    <h6 className='small-heading'>Service options</h6>
                                    <ul className='p-0 job-list-bullets'>
                                        {jobDetails?.data?.jobData?.deliver_washed === true && <li>Deliver Washed</li>}
                                        {jobDetails?.data?.jobData?.send_driver_contact_info === true && <li>Send driver contact info</li>}
                                    </ul>
                                </Col>
                            </Row>
                            <Row className='pt-3'>
                                <Col lg={6}>
                                    <h6 className='small-heading'>Pickup Details</h6>
                                    <ul className='p-0 job-list-bullets'>
                                        <li> {jobDetails?.data?.jobData?.pickup_location}</li>
                                        <li>{formatDateToMDY(jobDetails?.data?.jobData?.pickup_date)}  {formatTimeTo12Hour(jobDetails?.data?.jobData?.pickup_time)}</li>
                                        <li>Contact : {jobDetails?.data?.jobData?.pickup_POC_name}</li>
                                        <li>Phone : {jobDetails?.data?.jobData?.pickup_POC_phone}</li>
                                        <li>Notes : {jobDetails?.data?.jobData?.pickup_additional_note}</li>
                                    </ul>
                                </Col>
                                <Col lg={6}>
                                    <h6 className='small-heading'>Drop-off Details</h6>
                                    <ul className='p-0 job-list-bullets'>
                                        <li> {jobDetails?.data?.jobData?.dropoff_location}</li>
                                        <li>{formatDateToMDY(jobDetails?.data?.jobData?.dropoff_date)}  {formatTimeTo12Hour(jobDetails?.data?.jobData?.dropoff_time)}</li>
                                        <li>Contact : {jobDetails?.data?.jobData?.dropoff_POC_name}</li>
                                        <li>Phone : {jobDetails?.data?.jobData?.dropoff_POC_phone}</li>
                                        <li>Notes : {jobDetails?.data?.jobData?.dropoff_additional_note}</li>
                                    </ul>
                                </Col>
                            </Row>
                            <Col lg={12} className='mt-3'>
                                <h6 className='small-heading'>Location Tracking</h6>
                            </Col>
                        </Col>
                        <Col lg={3}>
                            <h6 className='small-heading'>Job Status</h6>
                            <div className='d-flex gap-2 align-items-center mt-3 mb-4'>
                                <PendingCarSvg />
                                <div className='job_status'>
                                    <h6 className='mb-1'>Pending</h6>
                                    <span>Last Updated:04/14/2025, 3:30PM</span>
                                </div>
                            </div>
                            <h6 className='timeline-title'>Timeline</h6>
                            <ul className='p-0 timeline d-flex flex-column gap-3 mt-3'>
                                {jobDetails?.data?.jobLogs?.length > 0 ? (
                                    jobDetails.data.jobLogs.map((logs, index) => (
                                        <li key={index} className='d-flex gap-3 align-items-center'>
                                            <span className='d-flex justify-content-center rounded-5 align-items-center shrink-0 timeline-count'>
                                                {index + 1}
                                            </span>
                                            <div className='timeline_status'>
                                                <span className='d-block text-capitalize'>{logs?.request_status}</span>
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
                 {(state.status !== "cancelled" && state.status !== "awaiting_reschedule_date") && (
                    <>
                    <h6 className='small-heading'>Driver</h6>
                    <div className='no-driver'>
                        <CarSvg />
                        <h5 className='mb-4'>{(jobDetails?.data?.jobData?.driver_name === "Driver not assigned" || jobDetails?.data?.jobData?.driver_name === null) ? "Driver not assigned" : jobDetails?.data?.driver_name}</h5>
                        {
                            (!jobDetails?.data?.jobData?.driver_name || jobDetails?.data?.jobData?.driver_name === "Driver not assigned") ? (
                                <Button label="Assign Driver" className="rounded w-75" onClick={() => setAssignDriverPopup(true)} />
                            ) : (
                                <Button label="Send Link" className="rounded" />
                            )
                        }
                    </div>
                    </>)}
                </Col>

            </Row>

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