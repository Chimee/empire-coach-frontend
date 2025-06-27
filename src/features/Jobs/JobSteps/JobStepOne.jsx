import React from 'react';
import Button from '../../../components/shared/buttons/button';
import InputWithLabel from '../../../components/shared/fields/InputWithLabel';
const JobStepOne = ({ handleNext }) => {
  return (
    <div>
      <h5 className='step_heading'>Job Details</h5>
      <InputWithLabel
        label="Customer Name"
        placeholder="John Doe"
        type="text"
      />
      <InputWithLabel
        label="Request Submitted by"
        placeholder="John Doe"
        type="text"
      />
      <div className="d-flex justify-content-end mt-3">
        <Button label={'Next'} className={'rounded-2'} size={'small'} onClick={handleNext} />
      </div>
    </div>
  );
};

export default JobStepOne;
