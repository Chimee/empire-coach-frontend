import React, { useState } from 'react';
import CommonModal from '../modalLayout/CommonModal';

// Step components
import JobStepOne from '../../../features/Jobs/JobSteps/JobStepOne';
import JobStepTwo from '../../../features/Jobs/JobSteps/JobStepTwo';
import JobStepThree from '../../../features/Jobs/JobSteps/JobStepThree';
import JobStepFour from '../../../features/Jobs/JobSteps/JobStepFour';
import JobStepFive from '../../../features/Jobs/JobSteps/JobStepFive';
import JobStepSix from '../../../features/Jobs/JobSteps/JobStepSix';
import { useCreateJobMutation } from '../../../app/customerApi/customerApi';

const JobRequestModal = ({ show, handleClose, setShow }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [createJob, { isLoading }] = useCreateJobMutation();

  const handleNext = () => {
    if (step < 6) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  // Move handleSubmit here
  const handleSubmit = async () => {
    try {
      await createJob({ data: formData }).unwrap();
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
      <ul className="step-tracker d-flex justify-content-between mb-4 px-2">
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
    <CommonModal show={show} handleClose={handleClose} setShow={setShow}>
      <div className='req-job-headers'>
        <h2 className='text-center'>New Job request</h2>
        <p className='text-center'>Please fill the form below to receive a quote for your project. Feel free to add as much detail as needed.</p>
      </div>
      <div className="job-request-modal">
        {renderStepTracker()}
        {renderStep()}
      </div>
    </CommonModal>
  );
};

export default JobRequestModal;