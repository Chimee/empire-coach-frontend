import React from 'react'
import { Row, Col } from 'react-bootstrap'
import TextAreaWithLabel from '../../../components/shared/fields/TextAreaWithLabel'
import Button from '../../../components/shared/buttons/button'

const JobStepSix = ({ handleNext, handlePrevious, formData, setFormData, handleSubmit, isLoading }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value.toUpperCase(),
    }));
  };

  return (
    <div>
      <h5 className='step_heading mb-4'>Additional Notes</h5>
      <Row>
        <Col lg={6}>
          <TextAreaWithLabel
            label="For empire "
            placeholder="Add note"
            name="empire_notes"
            value={formData.empire_notes || ''}
            onChange={handleChange}
          /></Col>
        <Col lg={6}> <TextAreaWithLabel
          label="For driver "
          placeholder="Add note"
          name="driver_notes"
          value={formData.driver_notes || ''}
          onChange={handleChange}
        /></Col>
      </Row>
      <div className="d-flex justify-content-between mt-3">
        <Button label={'Previous'} className={'rounded-2 bordered'} size={'small'} onClick={handlePrevious} />

        <Button label={'Submit'} className={'rounded-2'} size={'small'} onClick={handleSubmit} disabled={isLoading} />
      </div>
    </div>
  )
}

export default JobStepSix