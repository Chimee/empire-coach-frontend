import React from 'react'
import Button from '../../../components/shared/buttons/button'
import { Form } from 'react-bootstrap'

const JobStepFive = ({ handleNext, handlePrevious, formData, setFormData }) => {
  const handleCheckbox = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };


  return (
 <div>
         <h5 className='step_heading mb-4'>Service Options</h5>
        <Form.Check
              label="Deliver Washed"
              name="deliver_washed"
              type={'checkbox'}
              id='deliver_washed'
              className='rem_pass job-req-check mb-3'
              checked={!!formData.deliver_washed}
              onChange={handleCheckbox}
            />
        <Form.Check
              label="Deliver full (DEF/Fuel)"
              name="deliver_full"
              type={'checkbox'}
              id='deliver_full'
              className='rem_pass job-req-check mb-3'
              checked={!!formData.deliver_full}
              onChange={handleCheckbox}
            />
        <Form.Check
              label="Send driver contact info"
              name="send_driver_contact_info"
              type={'checkbox'}
              id='send_driver_contact_info'
              className='rem_pass job-req-check'
              checked={!!formData.send_driver_contact_info}
              onChange={handleCheckbox}
            />
      <div className="d-flex justify-content-between mt-3">
        <Button label={'Previous'} className={'rounded-2 bordered'} size={'small'} onClick={handlePrevious} />

        <Button label={'Next'} className={'rounded-2'} size={'small'} onClick={handleNext} />
      </div>
    </div>
  )
}

export default JobStepFive