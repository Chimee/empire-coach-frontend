

import React, { useState } from 'react';
// Step components
import JobStepOne from './JobSteps/JobStepOne';
import JobStepTwo from './JobSteps/JobStepTwo';
import JobStepThree from './JobSteps/JobStepThree';
import JobStepFour from './JobSteps/JobStepFour';
import JobStepFive from './JobSteps/JobStepFive';
import JobStepSix from './JobSteps/JobStepSix';
import { useCreateJobMutation } from '../../app/customerApi/customerApi';
import { useNavigate } from 'react-router';
const CreateJob = ({ show, handleClose, setShow }) => {
    const navigate = useNavigate()
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
  
    // Move handleSubmit here
    const handleSubmit = async () => {
        try {
            
            await createJob({ data: formData }).unwrap();
          navigate("/")
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
            <div className='req-job-headers d-flex flex-column'>
                <h2 className='text-center mb-0'>New Job request</h2>
                <p className='text-center mb-0'>Please fill the form below to receive a quote for your project. Feel free to add as much detail as needed.</p>
            </div>
            <div className="job-request-modal mt-4">
                {renderStepTracker()}
                {renderStep()}
            </div>
        </div>
    );
};

export default CreateJob;