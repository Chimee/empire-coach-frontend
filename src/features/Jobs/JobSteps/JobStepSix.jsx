import React from 'react'
import { Row, Col } from 'react-bootstrap'
import TextAreaWithLabel from '../../../components/shared/fields/TextAreaWithLabel'
import Button from '../../../components/shared/buttons/button'
const JobStepSix = ({ handleNext, handlePrevious }) => {
  return (
    <div>
      <h5 className='step_heading mb-4'>Service Options</h5>
      <Row>
        <Col lg={6}>
          <TextAreaWithLabel
            label="For empire "
            placeholder="Add note"
            type="text"
          /></Col>
        <Col lg={6}> <TextAreaWithLabel
          label="For driver "
          placeholder="Add note"
          type="text"
        /></Col>
      </Row>

      <div className="d-flex justify-content-between mt-3">
        <Button label={'Previous'} className={'rounded-2 bordered'} size={'small'} onClick={handlePrevious} />

        <Button label={'Next'} className={'rounded-2'} size={'small'} onClick={handleNext} />
      </div>
    </div>
  )
}

export default JobStepSix