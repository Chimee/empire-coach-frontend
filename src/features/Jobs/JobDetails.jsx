import React, { useState } from 'react'
import PageHead from '../../components/shared/pageHead/PageHead'
import Breadcrumb from '../../components/shared/breadcrumb/Breadcrumb'
import { Row, Col } from 'react-bootstrap'
import { CarSvg } from '../../svgFiles/CarSvg'
import './job.css'
import Button from '../../components/shared/buttons/button'
import { useParams, useLocation } from 'react-router'
import { useGetJobDetailsQuery } from '../../app/customerApi/customerApi'
import { formatDateToMDY, formatTimeTo12Hour } from '../../helpers/Utils'
import CancelConfirmationModal from '../../components/shared/modalContent/CancelJobModal'
import ReScheduleDate from '../../components/shared/modalContent/ReschceduleDate'
import { getClassAndTitleByStatus } from '../../helpers/Utils'
import { LuClock } from "react-icons/lu";
const JobDetails = () => {
    const { id } = useParams();
    
    
    const { data: jobDetails, isLoading } = useGetJobDetailsQuery({ id });
    console.log(jobDetails,"jobDetails");
    const statusMeta = getClassAndTitleByStatus(jobDetails?.data?.jobData?.request_status);
    
    const [cancelConfirmation, setCancelConfirmation] = useState(false);
    const [reScheduleConfirmation, setRescheduleConfirmation] = useState(false);

    const breadcrumbItems = [
        { name: 'Jobs', path: '/jobs' },

        { name: 'Job-441022022' },
    ];

    return (
        <>
            <Row>
                <Col lg={9}>
                    <Row>
                        <Col lg={12} xl={10}>
                            <div className='d-flex gap-3 justify-content-between align-items-center'>
                                <div className='job_info'>
                                    <Breadcrumb items={breadcrumbItems} />
                                    <PageHead
                                        title={'Jobs'}
                                        description={'Created on Apr 14/2025, 3:30PM'}

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
                    </Row>
 
                </Col>
                <Col lg={3}>
                    <h6 className='small-heading'>Driver</h6>
                    <div className='no-driver'>
                        <CarSvg />
                        <h5 className='mb-4'>{(jobDetails?.data?.jobData?.driverName === "Driver not assigned" || jobDetails?.data?.jobData?.driverName === null) ? "Driver not assigned" : jobDetails?.data?.driverName}</h5>
                    </div>
                </Col>
                <Col lg={12} className='mt-5'>
                    <h6 className='small-heading'>Job Details</h6>
                    <Row className='mt-5'>
                        <Col lg={9}>

                            <Row>
                                <Col lg={6}>
                                    <h6 className='small-heading'>Vehicle Details</h6>
                                    <ul className='p-0 job-list-bullets'>
                                        <li>2022 Ford Transit</li>
                                        <li>VIN : {jobDetails?.data?.jobData.vin_number}</li>
                                        <li>Fuel Type: {jobDetails?.data?.jobData.fuel_type}</li>
                                        <li>PO Number:{jobDetails?.data?.jobData.po_number}</li>
                                    </ul>
                                </Col>
                                <Col lg={6}>
                                    <h6 className='small-heading'>Service options</h6>
                                    <ul className='p-0 job-list-bullets'>
                                        {jobDetails?.data?.jobData.deliver_washed === true && <li>Deliver Washed</li>}
                                        {jobDetails?.data?.jobData.send_driver_contact_info === true && <li>Send driver contact info</li>}
                                    </ul>
                                </Col>
                            </Row>
                            <Row className='pt-3'>
                                <Col lg={6}>
                                    <h6 className='small-heading'>Pickup Details</h6>
                                    <ul className='p-0 job-list-bullets'>
                                        <li> {jobDetails?.data?.jobData.pickup_location}</li>
                                        <li>{formatDateToMDY(jobDetails?.data?.jobData.pickup_date)}  {formatTimeTo12Hour(jobDetails?.data?.jobData.pickup_time)}</li>
                                        <li>Contact : {jobDetails?.data?.jobData.pickup_POC_name}</li>
                                        <li>Phone : {jobDetails?.data?.jobData.pickup_POC_phone}</li>
                                        <li>Notes : {jobDetails?.data?.jobData.pickup_additional_note}</li>
                                    </ul>
                                </Col>
                                <Col lg={6}>
                                    <h6 className='small-heading'>Drop-off Details</h6>
                                    <ul className='p-0 job-list-bullets'>
                                        <li> {jobDetails?.data?.jobData.dropoff_location}</li>
                                        <li>{formatDateToMDY(jobDetails?.data?.jobData.dropoff_date)}  {formatTimeTo12Hour(jobDetails?.data?.jobData.dropoff_time)}</li>
                                        <li>Contact : {jobDetails?.data?.jobData.dropoff_POC_name}</li>
                                        <li>Phone : {jobDetails?.data?.jobData.dropoff_POC_phone}</li>
                                        <li>Notes : {jobDetails?.data?.jobData.dropoff_additional_note}</li>
                                    </ul>
                                </Col>
                            </Row>
                            <Col lg={12} className='mt-3'>
                                <h6 className='small-heading'>Location Tracking</h6>
                            </Col>
                        </Col>
                        <Col lg={3}>


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
            </Row>
            { cancelConfirmation && (
            <CancelConfirmationModal
                show={cancelConfirmation}
                setShow={setCancelConfirmation}
                jobId = {id}
                user = "customer"
                type="cancel"
            />
            )}
            {reScheduleConfirmation && (
            <ReScheduleDate
                show={reScheduleConfirmation}
                setShow={setRescheduleConfirmation}
                type="reschedule"
                reqstatus={jobDetails?.data?.jobData.request_status}
                jobId = {id}
            />
            )}
        </>

    )
}

export default JobDetails