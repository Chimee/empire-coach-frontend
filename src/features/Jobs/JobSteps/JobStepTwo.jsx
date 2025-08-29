import React, { useState } from 'react';
import Button from '../../../components/shared/buttons/button';
import { Form } from 'react-bootstrap';
import InputWithLabel from '../../../components/shared/fields/InputWithLabel';
import toast from 'react-hot-toast';

const JobStepTwo = ({ handleNext, handlePrevious, formData, setFormData }) => {
  const [timingPriority, setTimingPriority] = useState({
    mustOccur: false,
    mustDelivery: false,
    both: false,
  });
  const today = new Date().toISOString().split("T")[0];


  // Handle checkbox logic
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    if (name === 'both') {
      setTimingPriority({
        mustOccur: false,
        mustDelivery: false,
        both: checked,
      });
      setFormData((prev) => ({
        ...prev,
        time_relaxation: checked,
      }));
    } else {
      setTimingPriority((prev) => ({
        ...prev,
        [name]: checked,
        both: false,
      }));
      setFormData((prev) => ({
        ...prev,
        time_relaxation: false,
      }));
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validation
  const validate = () => {
     if (!formData.pickup_date) {
      toast.dismiss();
      toast.error("Pickup date is required");
      return false;
    }
     if (!formData.pickup_time) {
      toast.dismiss();
      toast.error("Pickup time is required");
      return false;
    }
      if (!formData.dropoff_date) {
      toast.dismiss();
      toast.error("Delivery date is required");
      return false;
    }

    const now = new Date();
    now.setHours(0,0,0,0)
    const pickupDate = formData.pickup_date ? new Date(formData.pickup_date) : null;
    pickupDate.setHours(0,0,0,0)
     const dropoffDate = formData.dropoff_date ? new Date(formData.dropoff_date) : null;
     const timeParts = formData.pickup_time.split(':');
     
    if(now.getTime() === pickupDate.getTime()){
     
        const date = new Date()
        const currentTimeValue = date.getTime();
        const twoHoursLater = new Date(currentTimeValue + 2 * 60 * 60 * 1000)
        const twoHourMilsec = (twoHoursLater.getTime());
        const pickupDateTime = new Date()
        pickupDateTime.setHours(parseInt(timeParts[0]))
        pickupDateTime.setMinutes(parseInt(timeParts[1]));
        pickupDateTime.setSeconds(0)

        pickupDateTime.setMilliseconds(0);
       const timeString = twoHoursLater.toTimeString().slice(0, 5);
      if(pickupDateTime < twoHourMilsec){
        toast.error(`Pickup time must be at least 2 hours later of currentTime`);
         return false;
      }
     
    }

   

    if (pickupDate.setHours(0, 0, 0, 0) < now.setHours(0, 0, 0, 0)) {
      toast.dismiss();
      toast.error("Pickup date cannot be in the past");
      return false;
    }

   
  
    const pickupDateOnly = new Date(formData.pickup_date);
    pickupDateOnly.setHours(0, 0, 0, 0);


  

    // Dropoff date must be after pickup date
    const dropoffDateOnly = new Date(formData.dropoff_date);
    dropoffDateOnly.setHours(0, 0, 0, 0);
    if (dropoffDateOnly <= pickupDateOnly) {
      toast.dismiss();
      toast.error("Delivery date must be after pickup date");
      return false;
    }

    // if (!formData.dropoff_time) {
    //   toast.dismiss();
    //   toast.error("Delivery time is required");
    //   return false;
    // }

    return true;
  };

  // Next button handler
  const onNext = () => {
    if (validate()) {
      handleNext();
    }
  };

  return (
    <div>
      <h5 className="step_heading mb-4">What’s your Timing priority</h5>
      <p className="step-tag-line mb-3">
        What part of the schedule is most important to you?
      </p>

      <Form.Check
        label="Pickup must occur at this date/time"
        name="mustOccur"
        type="checkbox"
        id="mustOccur"
        className="rem_pass job-req-check"
        checked={timingPriority.mustOccur}
        onChange={handleCheckboxChange}
      />
      <div className="d-flex gap-2 w-75">
        <InputWithLabel
          label="Pickup date"
          placeholder="Pickup Date"
          type="date"
          className="w-100"
          name="pickup_date"
          value={formData?.pickup_date || ""}
          onChange={handleInputChange}
          min={today}
        />
        <InputWithLabel
          label="Pickup time"
          placeholder="Pickup Time"
          type="time"
          name="pickup_time"
          value={formData?.pickup_time || ""}
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
      <div className="d-flex gap-2 w-75">
        <InputWithLabel
          label="Delivery date"
          placeholder="Delivery Date"
          type="date"
          className="w-100"
          name="dropoff_date"
          value={formData?.dropoff_date || ""}
          onChange={handleInputChange}
           min={today}
        />
        <InputWithLabel
          label="Delivery time"
          placeholder="Delivery Time"
          type="time"
          name="dropoff_time"
          value={formData?.dropoff_time || ""}
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

      <div className="d-flex justify-content-between mt-3">
        <Button
          label="Previous"
          className="rounded-2"
          size="small"
          onClick={handlePrevious}
        />
        <Button
          label="Next"
          className="rounded-2"
          size="small"
          onClick={onNext}
        />
      </div>
    </div>
  );
};

export default JobStepTwo;
