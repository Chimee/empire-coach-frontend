import React from 'react'
import InputWithLabel from '../../../components/shared/fields/InputWithLabel'
import SelectBox from '../../../components/shared/fields/SelectBox'
import { Row, Col } from 'react-bootstrap'
import Button from '../../../components/shared/buttons/button'
const JobStepFour = ({ handleNext, handlePrevious }) => {
   const SelectOptions = [
    {
      label: "Punjab",
      value: 'punjba'
    }
  ]
  return (
    <div>
      <h5 className='step_heading mb-0'>Vehicle Details</h5>
      <div className='vehicle_card'>
        <Row>
          <Col lg={4}>
            <SelectBox label="Year" options={SelectOptions} />
          </Col>
          <Col lg={4}>
            <SelectBox label="Make" options={SelectOptions} />
          </Col>
          <Col lg={4}>
           <SelectBox label="Model" options={SelectOptions} />
          </Col>
          <Col lg={12}>
            <InputWithLabel
                  label="VIN Number"
                  placeholder="Enter VIN Number here"
                  type="text"
                />
          </Col>
          <Col lg={12}>
            <InputWithLabel
                  label="Fuel type"
                  placeholder="Enter Fuel type here"
                  type="text"
                />
          </Col>
          <Col lg={12}>
            <InputWithLabel
                  label="PO Number (optional)"
                  placeholder="Enter purchase order number"
                  type="text"
                />
          </Col>
        </Row>
           <div className='text-end'>
            <Button label={'Save'} className={'rounded-2'} size={'small'} onClick={handleNext} />
           </div>
      </div>
     <div className="d-flex justify-content-between mt-3">
        <Button label={'Previous'} className={'rounded-2 bordered'} size={'small'} onClick={handlePrevious} />

        <Button label={'Next'} className={'rounded-2'} size={'small'} onClick={handleNext} />
      </div>
    </div>
  )
}

export default JobStepFour