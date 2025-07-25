import React ,{useState}from 'react'
import PageHead from '../../components/shared/pageHead/PageHead'
import Breadcrumb from '../../components/shared/breadcrumb/Breadcrumb'
import { Row, Col } from 'react-bootstrap'
import { CarSvg } from '../../svgFiles/CarSvg'
import './job.css'
import Button from '../../components/shared/buttons/button'
import { PendingCarSvg } from '../../svgFiles/PendingCarSvg'
import { useParams ,useLocation} from 'react-router'
import { useGetJobDetailsQuery ,useCancelRescheduleJobMutation,useRescheduleJobDateMutation} from '../../app/customerApi/customerApi'
import { formatDateToMDY, formatTimeTo12Hour } from '../../helpers/Utils'
import toast from "react-hot-toast";
import CancelConfirmationModal from '../../components/shared/modalContent/CancelJobModal'
import ReScheduleDate from '../../components/shared/modalContent/ReschceduleDate'
import { LuClock } from "react-icons/lu";
const JobDetails = () => {
    const { id } = useParams();
    console.log(id, "id from params");
     const location = useLocation();
         const status = location.state?.status;
    
    const { data: jobDetails, isLoading } = useGetJobDetailsQuery({id});
    console.log(jobDetails,"data-jobDetails");
    const[cancelConfirmation,setCancelConfirmation] = useState(false);
    const[reScheduleConfirmation,setRescheduleConfirmation] = useState(false);
    const[cancelrescheduleJobs ,{isLoading :isCancelling}] = useCancelRescheduleJobMutation();
    const[rescheduleDate ,{isLoading:isRescheduling}] = useRescheduleJobDateMutation();
    
    const breadcrumbItems = [
        { name: 'Jobs', path: '/jobs' },
        { name: 'Job-441022022' },
    ];

    const handleCancelResConfirm = async({reason,type})=>{
       
        try{
           await cancelrescheduleJobs({ jobId : id, reason, type}).unwrap();
            toast.success( type == "cancel" ?"Job cancelled successfully" : "job rescheduled successfully");
            type === "cancel"
           ? setCancelConfirmation(false)
           : setRescheduleConfirmation(false);
        }
          catch(err){
          toast.error(err?.data?.message ||type == "cancel" ? "Cancellation failed" : "rescheduled failed");
           type === "cancel"
           ? setCancelConfirmation(false)
            : setRescheduleConfirmation(false);
           
        }
    };

       const handleRescheduleDate = async(pickup_date,pickup_time,dropoff_date,dropoff_time,time_relaxation,reason = null)=>{
        debugger;
        const jobId = id
                try{
                   await rescheduleDate({jobId,pickup_date,pickup_time,dropoff_date,dropoff_time,time_relaxation,reason}).unwrap();
                    toast.success("Job reschedule successfully");
                     setRescheduleConfirmation(false);
                }
                catch(err){
                     toast.error(err?.data?.message || "Reschedule failed");
                       setRescheduleConfirmation(false);
                          console.log(err)
                }
  };
 
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
                                <span className='fn-tag mt-4'>{jobDetails?.data?.jobData.request_status}</span>
                            </div>
                            <div className='d-flex gap-2'>
                               {jobDetails?.data?.jobData.request_status === "awaiting_for_cancellation" ? (
                            <span className="d-flex align-items-center gap-1 text-warning fw-bold align-self-center">
                            <LuClock className="me-1" /> Awaiting Cancellation
                       </span>
                          ) : (
                            <>
                           
                            <Button label={jobDetails?.data?.jobData.request_status === "awaiting_reschedule_date" ? "select reschedule date/time" : "reschedule-date"} className={'btn-square rounded'} 
                            onClick = {()=> setRescheduleConfirmation(true)}/>
                             <Button
                            label={'Cancel'}
                            className={'btn-square cancel rounded'}
                               onClick={() => setCancelConfirmation(true)}
                                   />
                                   </>
                                    )}
                            </div>
                        </div>
                    </Col>
                </Row>

            </Col>
            <Col lg={3}>
                <h6 className='small-heading'>Driver</h6>
                <div className='no-driver'>
                    <CarSvg />
                    <h5>{(jobDetails?.data?.jobData.driverName === "No Driver Assigned Yet" || jobDetails?.data?.jobData.driverName === null) ? "No Driver Assigned Yet" : jobDetails?.data?.driverName}</h5>
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
                            <li className='d-flex gap-3 align-items-center'>
                                <span className='d-flex justify-content-center rounded-5 align-items-center shrink-0 timeline-count'>1</span>
                                <div className='timeline_status'>
                                    <span className='d-block'>{jobDetails?.data.jobLogs[0].request_status}</span>

                                    <span>{jobDetails?.data.jobLogs[0].createdAt}</span>
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
         <CancelConfirmationModal
        show={cancelConfirmation}
        setShow={setCancelConfirmation}
        handleClose={() => setCancelConfirmation(false)}
        onConfirm={handleCancelResConfirm}
        message="you want to cancel this job?"
        type="cancel"
      />
      <ReScheduleDate
      show ={reScheduleConfirmation}
      setShow={setRescheduleConfirmation}
      handleClose ={()=>setRescheduleConfirmation(false)}
      onConfirm ={handleRescheduleDate}
      message = ""
      onFutureConfirm ={handleCancelResConfirm}
      type = "reschedule"
      reqstatus = {jobDetails?.data?.jobData.request_status}
      />
      </>
        
    )
}

export default JobDetails