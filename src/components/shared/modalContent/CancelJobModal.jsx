import React, { useState } from 'react';
import CommonModal from '../modalLayout/CommonModal';
import Button from '../buttons/button';
import { useCancelJobsByAdminMutation } from '../../../app/adminApi/adminApi';
import { useCancelRescheduleJobMutation } from '../../../app/customerApi/customerApi';
import toast from "react-hot-toast";

const CancelConfirmationModal = ({
  show,
  setShow,
  jobId,
  user,
  type
}) => {
  const [reason, setReason] = useState('');
  const [cancelJobByAdmin, { isLoading }] = useCancelJobsByAdminMutation();
   const [cancelrescheduleJobs, { isLoading: isCancelling }] = useCancelRescheduleJobMutation();
     const isSubmitting = isLoading || isCancelling;

  const handleConfirm = async () => {
    if (!reason.trim()) return alert("Please enter a reason for cancellation");

    if (user === "admin") {
      try {
         await cancelJobByAdmin({ jobId, reason }).unwrap();
        setReason("");
        setShow(false);
      } catch (err) {
        toast.error(err?.data?.message || "Cancellation failed");
      }
    }
    else{
      if(type === "cancel"){
         try {
          debugger;
            const data = await cancelrescheduleJobs({ jobId, reason, type }).unwrap();
            toast.success(data.message || "Job cancelled successfully");
           setReason("");
           setShow(false);         
        }
        catch (err) {
            toast.error(err?.data?.message || "cancellation failed");
        }
      }
    }
  };

  const onClose = () => {
    setReason('');
    setShow(false);
  };

  return (
    <CommonModal show={show} setShow={setShow} handleClose={onClose} className="confirmationModal sm-width" title={'Cancel Job'}>
      <p className="text-secondary">
        Are you sure you want to cancel this job? This action cannot be undone.
      </p>

      <label className="fw-semibold mt-3">Reason for Cancellation</label>
      <textarea
        className="form-control mt-1 mb-3"
        rows="4"
        placeholder="Please provide a reason for cancellation"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />

      <div className="d-flex justify-content-end gap-2 mt-3">
        <Button
          label="Cancel"
          className="bordered rounded"
          onClick={onClose}
          disabled={isLoading}
        />
         <Button
          className="rounded d-flex align-items-center gap-2"
          onClick={handleConfirm}
          disabled={isSubmitting}
          label={
            isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                {type === "reschedule" ? "Rescheduling..." : "Cancelling..."}
              </>
            ) : (
              "Confirm"
            )
          }
        />
      </div>
    </CommonModal>
  );
};

export default CancelConfirmationModal;
