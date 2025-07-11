import React from 'react'
import PageHead from '../../components/shared/pageHead/PageHead'
import Breadcrumb from '../../components/shared/breadcrumb/Breadcrumb'
import { Row, Col } from 'react-bootstrap'
import { CarSvg } from '../../svgFiles/CarSvg'
import './job.css'
import Button from '../../components/shared/buttons/button'
import { PendingCarSvg } from '../../svgFiles/PendingCarSvg'
import { useParams } from 'react-router'
import { useGetJobDetailsQuery } from '../../app/customerApi/customerApi'
import { formatDateToMDY, formatTimeTo12Hour } from '../../helpers/Utils'
const JobDetails = () => {
    const { id } = useParams();
    console.log(id, "id from params");
    
    const { data: jobDetails, isLoading } = useGetJobDetailsQuery({id});
    console.log(jobDetails,"data-jobDetails");
    
    const breadcrumbItems = [
        { name: 'Jobs', path: '/jobs' },
        { name: 'Job-441022022' },
    ];
    return (
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
                                <span className='fn-tag mt-4'>Submitted</span>
                            </div>
                            <div className='d-flex gap-2'>
                                <Button label={'Re-schedule'} className={'btn-square rounded'} />
                                <Button label={'Cancle'} className={'btn-square cancel rounded'} />
                            </div>
                        </div>
                    </Col>
                </Row>

            </Col>
            <Col lg={3}>
                <h6 className='small-heading'>Driver</h6>
                <div className='no-driver'>
                    <CarSvg />
                    <h5>{(jobDetails?.data?.driverName === "No Driver Assigned Yet" || jobDetails?.data?.driverName === null) ? "No Driver Assigned Yet" : jobDetails?.data?.driverName}</h5>
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
                                    <li>VIN : {jobDetails?.data?.vin_number}</li>
                                    <li>Fuel Type: {jobDetails?.data?.fuel_type}</li>
                                    <li>PO Number:{jobDetails?.data?.po_number}</li>
                                </ul>
                            </Col>
                            <Col lg={6}>
                                <h6 className='small-heading'>Service options</h6>
                                <ul className='p-0 job-list-bullets'>
                                    {jobDetails?.data?.deliver_washed === true && <li>Deliver Washed</li>}
                                   {jobDetails?.data?.send_driver_contact_info === true && <li>Send driver contact info</li>}
                                </ul>
                            </Col>
                        </Row>
                        <Row className='pt-3'>
                            <Col lg={6}>
                                <h6 className='small-heading'>Pickup Details</h6>
                                <ul className='p-0 job-list-bullets'>
                                    <li> {jobDetails?.data?.pickup_location}</li>
                                    <li>{formatDateToMDY(jobDetails?.data?.pickup_date)}  {formatTimeTo12Hour(jobDetails?.data?.pickup_time)}</li>
                                    <li>Contact : {jobDetails?.data?.pickup_POC_name}</li>
                                    <li>Phone : {jobDetails?.data?.pickup_POC_phone}</li>
                                    <li>Notes : {jobDetails?.data?.pickup_additional_note}</li>
                                </ul>
                            </Col>
                            <Col lg={6}>
                                <h6 className='small-heading'>Drop-off Details</h6>
                               <ul className='p-0 job-list-bullets'>
                                    <li> {jobDetails?.data?.dropoff_location}</li>
                                    <li>{formatDateToMDY(jobDetails?.data?.dropoff_date)}  {formatTimeTo12Hour(jobDetails?.data?.dropoff_time)}</li>
                                    <li>Contact : {jobDetails?.data?.dropoff_POC_name}</li>
                                    <li>Phone : {jobDetails?.data?.dropoff_POC_phone}</li>
                                    <li>Notes : {jobDetails?.data?.dropoff_additional_note}</li>
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
                            <li className='d-flex gap-3 align-items-center'>
                                <span className='d-flex justify-content-center rounded-5 align-items-center shrink-0 timeline-count'>1</span>
                                <div className='timeline_status'>
                                    <span className='d-block'>Request Submitted</span>
                                    <span>04/14/2025, 3:30PM</span>
                                </div>
                            </li>
                            <li className='d-flex gap-3 align-items-center'>
                                <span className='d-flex justify-content-center rounded-5 align-items-center shrink-0 timeline-count'>2</span>
                                <div className='timeline_status'>
                                    <span className='d-block'>Job Approval</span>
                                    <span>Pending</span>
                                </div>
                            </li>
                            <li className='d-flex gap-3 align-items-center'>
                                <span className='d-flex justify-content-center rounded-5 align-items-center shrink-0 timeline-count'>3</span>
                                <div className='timeline_status'>
                                    <span className='d-block'>Driver Assignment</span>
                                    <span>Assigned to Dave</span>
                                </div>
                            </li>
                            <li className='d-flex gap-3 align-items-center'>
                                <span className='d-flex justify-content-center rounded-5 align-items-center shrink-0 timeline-count'>4</span>
                                <div className='timeline_status'>
                                    <span className='d-block'>Pickup</span>
                                    <span>Apr 16/2025, 3:30PM</span>
                                </div>
                            </li>
                        </ul>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default JobDetails