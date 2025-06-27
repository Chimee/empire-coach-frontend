import React from 'react'
import Button from '../../../components/shared/buttons/button'
import { Form } from 'react-bootstrap'
import InputWithLabel from '../../../components/shared/fields/InputWithLabel'
const JobStepTwo = ({ handleNext, handlePrevious }) => {
  return (
    <div>
      <h5 className='step_heading mb-0'>What’s your Timing priority</h5>
      <p className='step-tag-line mb-3'>What part of the schedule is most important to you?</p>
      <Form.Check
        label="Pickup must occur at this date/time"
        name="mustOccur"
        type={'checkbox'}
        id='mustOccur'
        className='rem_pass job-req-check'
      />
      <div className='d-flex gap-2 w-75'>
        <InputWithLabel
          label="Pickup date"
          placeholder="John Doe"
          type="date"
          className='w-100'
        />
        <InputWithLabel
          label="Pickup time"
          placeholder="John Doe"
          type="time"
        />
      </div>
      <Form.Check
        label="Delivery must occur at this date/time"
        name="mustDelivery"
        type={'checkbox'}
        id='mustDelivery'
        className='rem_pass job-req-check'
      />
      <div className='d-flex gap-2 w-75'>
        <InputWithLabel
          label="Delivery date"
          placeholder="John Doe"
          type="date"
          className='w-100'
        />
        <InputWithLabel
          label="Delivery time"
          placeholder="John Doe"
          type="time"
        />
      </div>
      <Form.Check
        label="Both are important but flexible"
        name="both"
        type={'checkbox'}
        id='both'
        className='rem_pass job-req-check'
      />
      <div className="d-flex justify-content-between mt-3">
        <Button label={'Previous'} className={'rounded-2'} size={'small'} onClick={handlePrevious} />

        <Button label={'Next'} className={'rounded-2'} size={'small'} onClick={handleNext} />
      </div>
    </div>
  )
}

export default JobStepTwo