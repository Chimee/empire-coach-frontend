import React from 'react';
import Button from '../../../components/shared/buttons/button';
import InputWithLabel from '../../../components/shared/fields/InputWithLabel';
import { useGetCustomerProfileQuery } from '../../../app/customerApi/customerApi';
const JobStepOne = ({ handleNext }) => {
  const { data: customerProfile } = useGetCustomerProfileQuery();

  return (
    <div>
      <h5 className='step_heading'>Job Details</h5>
      <InputWithLabel
        label="Company Name"
        placeholder="John Doe"
        type="text"
        value={customerProfile?.data?.company_name || ''} // Assuming customerProfile has a name field
        readOnly="true" // Assuming you want this field to be read-only
      />
      <InputWithLabel
        label="Request Submitted by"
        placeholder="John Doe"
        type="text"
        value={customerProfile?.data?.username || ''} // Assuming customerProfile has a submittedBy field
        readOnly="true" // Assuming you want this field to be read-only
      />
      <div className="d-flex justify-content-end mt-3">
        <Button label={'Next'} className={'rounded-2'} size={'small'} onClick={handleNext} />
      </div>
    </div>
  );
};

export default JobStepOne;
