import React, { useState ,useMemo} from 'react';
import Button from '../../../components/shared/buttons/button';
import { Form } from 'react-bootstrap';
import InputWithLabel from '../../../components/shared/fields/InputWithLabel';
import toast from 'react-hot-toast';
import CommonModal from '../modalLayout/CommonModal';

const ReScheduleDate = ({ show, setShow, handleClose, onConfirm, message = "" ,onFutureConfirm,type,reqstatus}) => {
    console.log(reqstatus)
  const [timingPriority, setTimingPriority] = useState({
    mustOccur: false,
    mustDelivery: false,
    both: false,
  });
  const [reason, setReason] = useState('');

  const [formData, setFormData] = useState({
    pickup_date: "",
    pickup_time: "",
    dropoff_date: "",
    dropoff_time: "",
    time_relaxation: false,
  });

    const isFutureButtonDisabled = useMemo(() => {
    return(
    formData.pickup_date ||
    formData.pickup_time ||
    formData.dropoff_date ||
    formData.dropoff_time
);
  }, [formData, reason]);
 

  const today = new Date().toISOString().split("T")[0];

  const handleConfirm = () => {
    if(reqstatus != "awaiting_reschedule_date") {
    if (!reason.trim()) {
      toast.error("Please enter a reason for reschedule");
      return;
    }
}

    if (!validate()) return;
    const {pickup_date,pickup_time,dropoff_date,dropoff_time,time_relaxation} = formData
    if (reqstatus === "awaiting_reschedule_date") {
      debugger;
     onConfirm(pickup_date, pickup_time, dropoff_date, dropoff_time, time_relaxation);
   } else {
     onConfirm(pickup_date, pickup_time, dropoff_date, dropoff_time, time_relaxation ,reason);
}
    setReason('');
  };

   const onClose = () => {
    setFormData({ pickup_date: "",
    pickup_time: "",
    dropoff_date: "",
    dropoff_time: "",
    time_relaxation: false});
    setReason('');
    handleClose();
  };



  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    if (name === 'both') {
      setTimingPriority({ mustOccur: false, mustDelivery: false, both: checked });
      setFormData((prev) => ({ ...prev, time_relaxation: checked }));
    } else {
      setTimingPriority((prev) => ({ ...prev, [name]: checked, both: false }));
      setFormData((prev) => ({ ...prev, time_relaxation: false }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const pickupDate = formData.pickup_date ? new Date(formData.pickup_date) : null;
    const dropoffDate = formData.dropoff_date ? new Date(formData.dropoff_date) : null;

    if (!pickupDate || !formData.pickup_time) {
      toast.error("Pickup date and time are required");
      return false;
    }

    if (pickupDate.setHours(0, 0, 0, 0) < now.getTime()) {
      toast.error("Pickup date cannot be in the past");
      return false;
    }

    if (pickupDate.getTime() === now.getTime()) {
      const timeParts = formData.pickup_time.split(":");
      const current = new Date();
      const pickupTime = new Date();
      pickupTime.setHours(parseInt(timeParts[0]));
      pickupTime.setMinutes(parseInt(timeParts[1]));
      pickupTime.setSeconds(0);

      const twoHoursLater = new Date(current.getTime() + 2 * 60 * 60 * 1000);
      if (pickupTime < twoHoursLater) {
        const timeString = twoHoursLater.toTimeString().slice(0, 5);
        toast.error(`Pickup time must be at least 2 hours later — after ${timeString}`);
        return false;
      }
    }

    if (!dropoffDate || !formData.dropoff_time) {
      toast.error("Delivery date and time are required");
      return false;
    }

    if (dropoffDate.setHours(0, 0, 0, 0) <= pickupDate.setHours(0, 0, 0, 0)) {
      toast.error("Delivery date must be after pickup date");
      return false;
    }

    return true;
  };

  const onFutureValidate = ()=>{
     if (!reason.trim()) {
      toast.error("Please enter a reason for reschedule");
      return;
    }
    onFutureConfirm({ reason , type })
  }

  return (
    <CommonModal
      show={show}
      setShow={setShow}
      handleClose={onClose}
      className="confirmationModal sm-width"
      title={reqstatus == "awaiting_reschedule_date" ?"select your timing" : "Reschedule Job"}
    >
      <div className="d-flex flex-column gap-3">
        <Form.Check
          label="Pickup must occur at this date/time"
          name="mustOccur"
          type="checkbox"
          id="mustOccur"
          className="rem_pass job-req-check"
          checked={timingPriority.mustOccur}
          onChange={handleCheckboxChange}
        />
        <div className="d-flex flex-wrap gap-3">
          <InputWithLabel
            label="Pickup Date"
            placeholder="Pickup Date"
            type="date"
            className="w-70"
            name="pickup_date"
            value={formData.pickup_date}
            onChange={handleInputChange}
            min={today}
          />
          <InputWithLabel
            label="Pickup Time"
            placeholder="Pickup Time"
            type="time"
            className="w-30"
            name="pickup_time"
            value={formData.pickup_time}
            onChange={handleInputChange}
          />
        </div>

        <Form.Check
          label="Delivery must occur at this date/time"
          name="mustDelivery"
          type="checkbox"
          id="mustDelivery"
          className="rem_pass job-req-check"
          checked={timingPriority.mustDelivery}
          onChange={handleCheckboxChange}
        />
        <div className="d-flex flex-wrap gap-3">
          <InputWithLabel
            label="Delivery Date"
            placeholder="Delivery Date"
            type="date"
            className="w-70"
            name="dropoff_date"
            value={formData.dropoff_date}
            onChange={handleInputChange}
            min={today}
          />
          <InputWithLabel
            label="Delivery Time"
            placeholder="Delivery Time"
            type="time"
            className="w-30"
            name="dropoff_time"
            value={formData.dropoff_time}
            onChange={handleInputChange}
          />
        </div>

        <Form.Check
          label="Both are important but flexible"
          name="both"
          type="checkbox"
          id="both"
          className="rem_pass job-req-check"
          checked={timingPriority.both}
          onChange={handleCheckboxChange}
        />
   {reqstatus != "awaiting_reschedule_date" && (
  <>
       <div className="d-flex align-items-center justify-content-between my-3">
 
  <div className="flex-grow-1 me-2" style={{ borderBottom: '1px solid #ccc' }}></div>

 
  <span className="text-muted fw-semibold">Or</span>


  <div className="flex-grow-1 mx-2" style={{ borderBottom: '1px solid #ccc' }}></div>

  <div>
<Button
  label={
    <>
      <i className="bi bi-calendar-plus me-2"></i>
      Reschedule for future
    </>
  }
    className="rounded btn-outline-primary px-4"
    disabled={isFutureButtonDisabled}
     onClick={() => onFutureValidate()}
    title={
     isFutureButtonDisabled
      ? "Clear all fields and enter a reason to enable"
      : "Click to reschedule for future"
    }
   />
  </div>
   </div>

        <div>
          <label className="fw-semibold">Reason for Reschedule</label>
          <textarea
            className="form-control mt-1"
            rows="4"
            placeholder="Please provide a reason for reschedule"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
        </>
        )}
        <div className="d-flex justify-content-end gap-2">
          <Button label="Cancel" className="bordered rounded" onClick={onClose} />
          <Button label="Confirm" className="rounded" onClick={handleConfirm} />
        </div>
      </div>
    </CommonModal>
  );
};

export default ReScheduleDate;
