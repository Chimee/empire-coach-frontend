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

  // Get user's timezone
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  console.log(userTimezone)

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
        pickup_time_relaxation: checked,
        dropoff_time_relaxation: checked,
      }));
    } else if (name === 'mustOccur') {
      setTimingPriority((prev) => ({
        ...prev,
        mustOccur: checked,
        both: false,
      }));
      setFormData((prev) => ({
        ...prev,
        pickup_time_relaxation: !checked,
      }));
    } else if (name === 'mustDelivery') {
      setTimingPriority((prev) => ({
        ...prev,
        mustDelivery: checked,
        both: false,
      }));
      setFormData((prev) => ({
        ...prev,
        dropoff_time_relaxation: !checked,
      }));
    }
  };

  // Handle input changes with timezone
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      timezone: userTimezone, // Store timezone for backend
    }));
  };

  // Convert local date/time to UTC ISO string
  const convertToUTC = (date, time) => {
    if (!date || !time) return null;
    const dateTime = new Date(`${date}T${time}`);
    return dateTime.toISOString();
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

    // Get current time in user's local timezone
    const now = new Date();

    // Create pickup datetime using the date and time inputs
    // IMPORTANT: Use the date string directly to avoid timezone conversion issues
    const [year, month, day] = formData.pickup_date.split('-').map(Number);
    const [hours, minutes] = formData.pickup_time.split(':').map(Number);

    const pickupDateTime = new Date(year, month - 1, day, hours, minutes, 0, 0);

    // Check if pickup date is in the past (date-only comparison)
    const pickupDateOnly = new Date(year, month - 1, day, 0, 0, 0, 0);
    const todayOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

    if (pickupDateOnly < todayOnly) {
      toast.dismiss();
      toast.error("Pickup date cannot be in the past");
      return false;
    }

    // Check if pickup time must be at least 2 hours from now
    const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    if (pickupDateTime < twoHoursLater) {
      toast.dismiss();
      toast.error("Pickup time must be at least 2 hours later than current time");
      return false;
    }

    // Check delivery if "mustDelivery" is selected
    if (timingPriority.mustDelivery) {
      if (!formData.dropoff_date) {
        toast.dismiss();
        toast.error("Delivery date is required");
        return false;
      }
      if (!formData.dropoff_time) {
        toast.dismiss();
        toast.error("Delivery time is required");
        return false;
      }

      // Validate delivery date/time is after pickup
      const [dropYear, dropMonth, dropDay] = formData.dropoff_date.split('-').map(Number);
      const [dropHours, dropMinutes] = formData.dropoff_time.split(':').map(Number);
      const dropoffDateTime = new Date(dropYear, dropMonth - 1, dropDay, dropHours, dropMinutes, 0, 0);

      if (dropoffDateTime <= pickupDateTime) {
        toast.dismiss();
        toast.error("Delivery date/time must be after pickup date/time");
        return false;
      }
    }

    // If "both" is selected, both pickup and dropoff should be provided
    if (timingPriority.both) {
      if (!formData.dropoff_date || !formData.dropoff_time) {
        toast.dismiss();
        toast.error("Both pickup and delivery date/time are required when 'Both are important but flexible' is selected");
        return false;
      }

      // Validate delivery date/time is after pickup
      const [dropYear, dropMonth, dropDay] = formData.dropoff_date.split('-').map(Number);
      const [dropHours, dropMinutes] = formData.dropoff_time.split(':').map(Number);
      const dropoffDateTime = new Date(dropYear, dropMonth - 1, dropDay, dropHours, dropMinutes, 0, 0);

      if (dropoffDateTime <= pickupDateTime) {
        toast.dismiss();
        toast.error("Delivery date/time must be after pickup date/time");
        return false;
      }
    }

    return true;
  };

  // Next button handler - prepare data with timezone info
  const onNext = () => {
    if (validate()) {
      // Add UTC datetime strings and timezone before proceeding
      const dataToSend = {
        ...formData,
        pickup_datetime_utc: convertToUTC(formData.pickup_date, formData.pickup_time),
        user_timezone: userTimezone,
      };

      if (formData.dropoff_date && formData.dropoff_time) {
        dataToSend.dropoff_datetime_utc = convertToUTC(formData.dropoff_date, formData.dropoff_time);
      }

      setFormData(dataToSend);
      handleNext();
    }
  };

  return (
    <div>
      <h5 className="step_heading mb-4">What's your Timing priority</h5>
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