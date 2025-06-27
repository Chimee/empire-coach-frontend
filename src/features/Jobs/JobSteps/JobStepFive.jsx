import React from 'react'
import Button from '../../../components/shared/buttons/button'
import { Form } from 'react-bootstrap'
const JobStepFive = ({ handleNext, handlePrevious }) => {
  return (
 <div>
         <h5 className='step_heading mb-4'>Service Options</h5>
        <Form.Check
              label="Deliver Washed"
              name="deliveryWashed"
              type={'checkbox'}
              id='deliveryWashed'
              className='rem_pass job-req-check mb-3'
            />
        <Form.Check
              label="Deliver full (DEF/diesel)"
              name="deliveryFull"
              type={'checkbox'}
              id='deliveryFull'
              className='rem_pass job-req-check mb-3'
            />
        <Form.Check
              label="Send driver contact info"
              name="sendDriver"
              type={'checkbox'}
              id='sendDriver'
              className='rem_pass job-req-check'
            />
      <div className="d-flex justify-content-between mt-3">
        <Button label={'Previous'} className={'rounded-2 bordered'} size={'small'} onClick={handlePrevious} />

        <Button label={'Next'} className={'rounded-2'} size={'small'} onClick={handleNext} />
      </div>
    </div>
  )
}

export default JobStepFive