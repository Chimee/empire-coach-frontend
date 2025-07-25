import React ,{useEffect,useState} from 'react'
import PageHead from '../../components/shared/pageHead/PageHead'
import Breadcrumb from '../../components/shared/breadcrumb/Breadcrumb'
import { Row, Col } from 'react-bootstrap'
import { CarSvg } from '../../svgFiles/CarSvg'
import './job.css'
import Button from '../../components/shared/buttons/button'
import { PendingCarSvg } from '../../svgFiles/PendingCarSvg'
import { useParams ,useLocation } from 'react-router'
import { useGetAdminJobDetailsQuery ,useCancelJobsAdminMutation,useApproveJobsByAdminMutation } from '../../app/adminApi/adminApi'
import { formatDateToMDY, formatTimeTo12Hour } from '../../helpers/Utils'
import toast from "react-hot-toast";
import CancelConfirmationModal from '../../components/shared/modalContent/CancelJobModal'
import AssignDriverModal from '../../components/shared/modalContent/AssignDriverPopup'


const AdminJobDetails = () => {
      const { id } = useParams();
       const location = useLocation();
       const status = location.state?.status;
       const { data: jobDetails, isLoading } = useGetAdminJobDetailsQuery({id});
       debugger;
        const [cancelJobAdmin, { isLoading: isCancelling }] = useCancelJobsAdminMutation();
        const[cancelConfirmationPopup,setCancelConfirmation] = useState(false);
        const[assignDriverPopup,setAssignDriverPopup] = useState(false)
        const[approveJob ,{isLoading:isApproving}] = useApproveJobsByAdminMutation();
      
       
    
        const breadcrumbItems = [
        { name: 'Jobs', path: '/admin-jobs' },
        { name: 'Job-441022022' },
      ];
             //cancel job by admin
               const handleCancelApproveJob = async()=>{      
                  try{
                   const res =  await cancelJobAdmin({ jobId: id }).unwrap();
                   if(res){
                        toast.success("cancel succeeded")
                   }
                  }
                  catch(err)
                   {
                  toast.error(err?.data?.message || "Cancellation failed")

                   }
       };
  //approve job by admin
      const handleApproveJob = async () => {
    try {
      const res = await approveJob({ jobId: id }).unwrap();
      toast.success(res?.message || "Job approved successfully");
      setAssignDriverPopup(true);
   } catch (err) {
     toast.error(err?.data?.message || "Job approval failed");
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
                                <span className='fn-tag mt-4'>{jobDetails?.data?.jobData?.request_status}</span>
                               {["awaiting_for_cancellation", "cancelled"].includes(jobDetails?.data?.jobData?.request_status) && (
                                  <p className='fn-tag mt-4'>Cancel Reason: {jobDetails?.data?.jobData?.request_status}</p>
                                )}
                            </div>
                                        <div className='d-flex gap-2'>
                            {jobDetails?.data?.jobData?.request_status === 'awaiting_for_cancellation' ? (
                          <>
                                      <Button label={'Decline'} className={'btn-square cancel rounded'}                        
                                      //onClick ={()=>handleCancelJob()} 
                                      />
                                      <Button label={'Approve'} className={'btn-square rounded'}
                                      onClick ={()=>handleCancelApproveJob()} />
                                
                                    </>
                                ) : jobDetails?.data?.jobData?.request_status == 'submitted' ? (
                            <>
                            <Button
                         label={"Approve"}
                         className={'btn-square rounded'}
                         onClick={() => handleApproveJob()} 
      />
                             <Button
                      label={"Cancel"}
                        className={'btn-square rounded'}
                       onClick={() => setCancelConfirmation(true)}
                           />
                  </>
             ): jobDetails?.data?.jobData?.request_status == 'awaiting_reschedule_date' ? (
       <>
      <Button
        label={"Select Reschedule Date/Time"}
         className={'btn-square rounded'}
        
      />
      <Button
        label="Cancel"
        className={'btn-square rounded'}
        onClick={() => setCancelConfirmation(true)}
      />
    </>)
    : jobDetails?.data?.jobData?.request_status == 'rescheduled' ? (
    <>
      <Button
        label="Reschedule job"
         className={'btn-square rounded'}
      />
      <Button
        label="Cancel"
        className={'btn-square rounded'}
        onClick={() => setCancelConfirmation(true)}
      />
    </>
     ) : jobDetails?.data?.jobData?.request_status == 'approved' ? (
     <>
      <Button
        label="Reschedule job"
         className={'btn-square rounded'}
        />
       <Button
        label="Cancel"
        className={'btn-square rounded'}
        onClick={() => setCancelConfirmation(true)}
       />
      </>
     ) :
     null}
              </div>
                        </div>
                    </Col>
                </Row>

            </Col>
            <Col lg={3}>
           
                <h6 className='small-heading'>Driver</h6>
                <div className='no-driver'>
                    <CarSvg />
                    <h5>{(jobDetails?.data?.jobData?.driverName === "No Driver Assigned Yet" || jobDetails?.data?.jobData?.driverName === null) ? "No Driver Assigned Yet" : jobDetails?.data?.driverName}</h5>
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
        
         <CancelConfirmationModal
        show={cancelConfirmationPopup}
        setShow={setCancelConfirmation}
        jobId = {id}
        user = "admin"
        type = ""
      /> 

      <AssignDriverModal
       show={assignDriverPopup}
        setShow={setAssignDriverPopup}
        jobId = {id}/>
      </>
    )
}

export default AdminJobDetails