import React, { useState } from 'react';
import PageHead from '../../components/shared/pageHead/PageHead';
import Breadcrumb from '../../components/shared/breadcrumb/Breadcrumb';
import { Row, Col } from 'react-bootstrap';
import { CarSvg } from '../../svgFiles/CarSvg';
import './job.css';
import Button from '../../components/shared/buttons/button';
import { PendingCarSvg } from '../../svgFiles/PendingCarSvg';
import { useParams, useLocation } from 'react-router';
import {
  useGetAdminJobDetailsQuery,
  useCancelJobsAdminMutation,
  useApproveJobsByAdminMutation,
} from '../../app/adminApi/adminApi';
import { formatDateToMDY, formatTimeTo12Hour } from '../../helpers/Utils';
import toast from 'react-hot-toast';
import CancelConfirmationModal from '../../components/shared/modalContent/CancelJobModal';
import AssignDriverModal from '../../components/shared/modalContent/AssignDriverPopup';

const AdminJobDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const status = location.state?.status;

  const { data: jobDetails, isLoading } = useGetAdminJobDetailsQuery({ id });
  const [cancelJobAdmin, { isLoading: isCancelling }] = useCancelJobsAdminMutation();
  const [cancelConfirmationPopup, setCancelConfirmation] = useState(false);
  const [assignDriverPopup, setAssignDriverPopup] = useState(false);
  const [approveJob, { isLoading: isApproving }] = useApproveJobsByAdminMutation();

  const handleCancelApproveJob = async () => {
    try {
      const res = await cancelJobAdmin({ jobId: id }).unwrap();
      if (res) toast.success("Cancel succeeded");
    } catch (err) {
      toast.error(err?.data?.message || "Cancellation failed");
    }
  };

  const handleApproveJob = async () => {
    try {
      const res = await approveJob({ jobId: id }).unwrap();
      toast.success(res?.message || "Job approved successfully");
      if(res){
      setAssignDriverPopup(true);
      }
    } catch (err) {
      toast.error(err?.data?.message || "Job approval failed");
    }
  };

  const job = jobDetails?.data?.jobData;

  const breadcrumbItems = [
    { name: 'Jobs', path: '/admin-jobs' },
    { name: `Job-${id}` },
  ];

  return (
    <>
      <Row>
        <Col lg={9}>
          <Row>
            <Col lg={12} xl={10}>
              <div className="d-flex gap-3 justify-content-between align-items-center">
                <div className="job_info">
                  <Breadcrumb items={breadcrumbItems} />
                  <PageHead
                    title={'Jobs'}
                    description={`Created on ${formatDateToMDY(job?.created_at)}, ${formatTimeTo12Hour(job?.created_at)}`}
                  />
                  <span className="fn-tag mt-4">{job?.request_status}</span>
                  {["awaiting_for_cancellation", "cancelled"].includes(job?.request_status) && (
                    <p className="fn-tag mt-4">Cancel Reason: {job?.cancel_reason || 'N/A'}</p>
                  )}
                </div>

                <div className="d-flex gap-2">
                  {job?.request_status === 'awaiting_for_cancellation' ? (
                    <>
                      <Button label={'Decline'} className={'btn-square cancel rounded'} />
                      <Button
                        label={'Approve'}
                        className={'btn-square rounded'}
                        onClick={handleCancelApproveJob}
                      />
                    </>
                  ) : job?.request_status === 'submitted' ? (
                    <>
                      <Button
                        label={'Approve'}
                        className={'btn-square rounded'}
                        onClick={handleApproveJob}
                      />
                      <Button
                        label={'Cancel'}
                        className={'btn-square rounded'}
                        onClick={() => setCancelConfirmation(true)}
                      />
                    </>
                  ) : job?.request_status === 'awaiting_reschedule_date' ? (
                    <>
                      <Button label={'Select Reschedule Date/Time'} className={'btn-square rounded'} />
                      <Button
                        label={'Cancel'}
                        className={'btn-square rounded'}
                        onClick={() => setCancelConfirmation(true)}
                      />
                    </>
                  ) : job?.request_status === 'rescheduled' || job?.request_status === 'approved' ? (
                    <>
                      <Button label={'Reschedule Job'} className={'btn-square rounded'} />
                      <Button
                        label={'Cancel'}
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
          <h6 className="small-heading">Driver</h6>
          <div className="no-driver">
            <CarSvg />
            <h5>
              {job?.driverName === "No Driver Assigned Yet" || !job?.driverName
                ? "No Driver Assigned Yet"
                : job?.driverName}
            </h5>
          </div>
        </Col>

        <Col lg={12} className="mt-5">
          <h6 className="small-heading">Job Details</h6>
          <Row className="mt-5">
            <Col lg={9}>
              <Row>
                <Col lg={6}>
                  <h6 className="small-heading">Vehicle Details</h6>
                  <ul className="p-0 job-list-bullets">
                    <li>{job?.vehicle_year} {job?.vehicle_make} {job?.vehicle_model}</li>
                    <li>VIN: {job?.vin_number}</li>
                    <li>Fuel Type: {job?.fuel_type}</li>
                    <li>PO Number: {job?.po_number || "N/A"}</li>
                  </ul>
                </Col>
                <Col lg={6}>
                  <h6 className="small-heading">Service Options</h6>
                  <ul className="p-0 job-list-bullets">
                    {job?.deliver_washed && <li>Deliver Washed</li>}
                    {job?.send_driver_contact_info && <li>Send Driver Contact Info</li>}
                  </ul>
                </Col>
              </Row>

              <Row className="pt-3">
                <Col lg={6}>
                  <h6 className="small-heading">Pickup Details</h6>
                  <ul className="p-0 job-list-bullets">
                    <li>{job?.pickup_location}</li>
                    <li>{formatDateToMDY(job?.pickup_date)} {formatTimeTo12Hour(job?.pickup_time)}</li>
                    <li>Contact: {job?.pickup_POC_name}</li>
                    <li>Phone: {job?.pickup_POC_phone}</li>
                    <li>Notes: {job?.pickup_additional_note}</li>
                  </ul>
                </Col>
                <Col lg={6}>
                  <h6 className="small-heading">Drop-off Details</h6>
                  <ul className="p-0 job-list-bullets">
                    <li>{job?.dropoff_location}</li>
                    <li>{formatDateToMDY(job?.dropoff_date)} {formatTimeTo12Hour(job?.dropoff_time)}</li>
                    <li>Contact: {job?.dropoff_POC_name}</li>
                    <li>Phone: {job?.dropoff_POC_phone}</li>
                    <li>Notes: {job?.dropoff_additional_note}</li>
                  </ul>
                </Col>
              </Row>

              <Col lg={12} className="mt-3">
                <h6 className="small-heading">Location Tracking</h6>
              </Col>
            </Col>

            <Col lg={3}>
              <h6 className="small-heading">Job Status</h6>
              <div className="d-flex gap-2 align-items-center mt-3 mb-4">
                <PendingCarSvg />
                <div className="job_status">
                  <h6 className="mb-1">Pending</h6>
                  <span>Last Updated: {formatDateToMDY(job?.updated_at)}, {formatTimeTo12Hour(job?.updated_at)}</span>
                </div>
              </div>

              <h6 className="timeline-title">Timeline</h6>
              <ul className="p-0 timeline d-flex flex-column gap-3 mt-3">
                <li className="d-flex gap-3 align-items-center">
                  <span className="timeline-count">1</span>
                  <div className="timeline_status">
                    <span className="d-block">Request Submitted</span>
                    <span>{formatDateToMDY(job?.created_at)}, {formatTimeTo12Hour(job?.created_at)}</span>
                  </div>
                </li>
                <li className="d-flex gap-3 align-items-center">
                  <span className="timeline-count">2</span>
                  <div className="timeline_status">
                    <span className="d-block">Job Approval</span>
                    <span>{job?.approved_at ? formatDateToMDY(job?.approved_at) : 'Pending'}</span>
                  </div>
                </li>
                <li className="d-flex gap-3 align-items-center">
                  <span className="timeline-count">3</span>
                  <div className="timeline_status">
                    <span className="d-block">Driver Assignment</span>
                    <span>{job?.driverName || 'Pending'}</span>
                  </div>
                </li>
                <li className="d-flex gap-3 align-items-center">
                  <span className="timeline-count">4</span>
                  <div className="timeline_status">
                    <span className="d-block">Pickup</span>
                    <span>{formatDateToMDY(job?.pickup_date)}, {formatTimeTo12Hour(job?.pickup_time)}</span>
                  </div>
                </li>
              </ul>
            </Col>
          </Row>
        </Col>
      </Row>

      {cancelConfirmationPopup && (
        <CancelConfirmationModal
          show={cancelConfirmationPopup}
          setShow={setCancelConfirmation}
          jobId={id}
          user="admin"
          type=""
        />
      )}

      {assignDriverPopup && (
        <AssignDriverModal
          show={assignDriverPopup}
          setShow={setAssignDriverPopup}
          jobId={id}
        />
      )}
    </>
  );
};

export default AdminJobDetails;
