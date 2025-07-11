

import React, { useState } from 'react';
// Step components
import JobStepOne from './JobSteps/JobStepOne';
import JobStepTwo from './JobSteps/JobStepTwo';
import JobStepThree from './JobSteps/JobStepThree';
import JobStepFour from './JobSteps/JobStepFour';
import JobStepFive from './JobSteps/JobStepFive';
import JobStepSix from './JobSteps/JobStepSix';
import { useCreateJobMutation } from '../../app/customerApi/customerApi';
const CreateJob = ({ show, handleClose, setShow }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({});
    const [createJob, { isLoading }] = useCreateJobMutation();

    const handleNext = () => {
        if (step < 6) setStep(step + 1);
    };

    const handlePrevious = () => {
        if (step > 1) setStep(step - 1);
    };
    console.log(formData, "formData--->last");
    const pickupLocation = `${formData.pickup_street} , ${formData.pickup_city} , ${formData.pickup_state} , ${formData.pickup_zip}` || "";
    const dropoff_location = `${formData.dropoff_street} , ${formData.dropoff_city} , ${formData.dropoff_state} , ${formData.dropoff_zip}` || "";
    // Move handleSubmit here
    const handleSubmit = async () => {
        try {
            const payload = {
                pickup_date: formData.pickup_date,
                pickup_time: formData.pickup_time,
                dropoff_date: formData.dropoff_date,
                dropoff_time: formData.dropoff_time,
                time_relaxation: formData.time_relaxation || false,
                pickup_business_name: formData.pickup_business_name || "",
                dropoff_business_name: formData.dropoff_business_name || "",
                pickup_location: pickupLocation || "",
                dropoff_location: dropoff_location || "",
                pickup_POC_name: formData.pickup_POC_name || "",
                pickup_POC_phone: formData.pickup_POC_phone || "",
                dropoff_POC_name: formData.dropoff_POC_name || "",
                dropoff_POC_phone: formData.dropoff_POC_phone || "",
                pickup_additional_note: formData.pickup_additional_note || "",
                dropoff_additional_note: formData.dropoff_additional_note || "",
                vehicle_details: formData.vehicle_details || [],
                deliver_washed: formData.deliver_washed || false,
                deliver_full: formData.deliver_full || false,
                send_driver_contact_info: formData.send_driver_contact_info || false,
                empire_notes: formData.empire_notes || "",
                driver_notes: formData.driver_notes || "",
            };
            await createJob({ data: payload }).unwrap();
            setStep(1);
            setFormData({});
            handleClose();
        } catch (error) {
            console.error(error);
        }
    };

    const renderStepTracker = () => {
        const steps = [1, 2, 3, 4, 5, 6];
        return (
            <ul className="step-tracker d-flex justify-content-between px-2">
                {steps.map((num) => (
                    <li key={num} className={`${step === num ? 'list-active' : ''} ${step > num ? 'list-completed' : ''}`}>
                        <div
                            className={`step-circle d-flex align-items-center justify-content-center rounded-5 ${step === num ? 'active' : ''} ${step > num ? 'completed' : ''}`}
                        >
                            {num}
                        </div>
                    </li>
                ))}
            </ul>
        );
    };

    const renderStep = () => {
        const commonProps = { handleNext, handlePrevious, formData, setFormData };
        switch (step) {
            case 1: return <JobStepOne {...commonProps} />;
            case 2: return <JobStepTwo {...commonProps} />;
            case 3: return <JobStepThree {...commonProps} />;
            case 4: return <JobStepFour {...commonProps} />;
            case 5: return <JobStepFive {...commonProps} />;
            case 6: return (
                <JobStepSix
                    {...commonProps}
                    isLoading={isLoading}
                    handleSubmit={handleSubmit}
                />
            );
            default: return null;
        }
    };

    return (
        <div>
            <div className='req-job-headers'>
                <h2 className='text-center'>New Job request</h2>
                <p className='text-center'>Please fill the form below to receive a quote for your project. Feel free to add as much detail as needed.</p>
            </div>
            <div className="job-request-modal">
                {renderStepTracker()}
                {renderStep()}
            </div>
        </div>
    );
};

export default CreateJob;