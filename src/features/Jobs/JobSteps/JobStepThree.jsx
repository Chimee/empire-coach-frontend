import React from 'react'
import Button from '../../../components/shared/buttons/button'
import { Row, Col } from 'react-bootstrap'
import InputWithLabel from '../../../components/shared/fields/InputWithLabel'
import SelectBox from '../../../components/shared/fields/SelectBox'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import SavedAddress from './SavedAddress'
import TextAreaWithLabel from '../../../components/shared/fields/TextAreaWithLabel'
const JobStepThree = ({ handleNext, handlePrevious }) => {
  const SelectOptions = [
    {
      label: "Punjab",
      value: 'punjba'
    }
  ]
  return (
    <div>
      <h5 className='step_heading mb-0'>What’s your Timing priority</h5>
      <Row>
        <Col lg={6}>
          <div className='address'>
            <h5>Pickup Location</h5>
            <Tabs
              defaultActiveKey="newLoaction"
              id="uncontrolled-tab-example"
              className="mb-3 location_tabs"
            >
              <Tab eventKey="savedLocation" title="Saved Location">
                <SavedAddress />
              </Tab>
              <Tab eventKey="newLoaction" title="New Location">

                <InputWithLabel
                  label="Business name (optional)"
                  placeholder="Illinois"
                  type="text"
                />
                <InputWithLabel
                  label="Street Address"
                  placeholder="Street address"
                  type="text"
                />
                <SelectBox label="State" options={SelectOptions} />
                <Row>
                  <Col lg={6}>
                    <SelectBox label="City" options={SelectOptions} />
                  </Col>
                  <Col lg={6}>
                    <InputWithLabel
                      label="Zip Code"
                      placeholder="000000"
                      type="text"
                    />
                  </Col>
                  <Col lg={12}>
                    <Button label={'Save'} className={'rounded-2 w-100 mb-3'} size={'xs'} />
                    <Button label={'Use for this trip only'} className={'rounded-2 w-100 bordered'} size={'xs'} />

                  </Col>
                </Row>


              </Tab>

            </Tabs>
            <div className='divider_cmn'></div>
            <InputWithLabel
              label="POC Name"
              placeholder="Enter name here"
              type="text"
            />
            <InputWithLabel
              label="POC Phone"
              placeholder="(000) 000-0000"
              type="text"
            />
            <TextAreaWithLabel
              label="Add Note"
              placeholder="Add Note"
              type="text"
            />
          </div>
        </Col>
        <Col lg={6}>
          <div className='address'>
            <h5>Pickup Location</h5>
            <Tabs
              defaultActiveKey="newLoaction"
              id="uncontrolled-tab-example"
              className="mb-3 location_tabs"
            >
              <Tab eventKey="savedLocation" title="Saved Location">
                <SavedAddress />
              </Tab>
              <Tab eventKey="newLoaction" title="New Location">

                <InputWithLabel
                  label="Business name (optional)"
                  placeholder="Illinois"
                  type="text"
                />
                <InputWithLabel
                  label="Street Address"
                  placeholder="Street address"
                  type="text"
                />
                <SelectBox label="State" options={SelectOptions} />
                <Row>
                  <Col lg={6}>
                    <SelectBox label="City" options={SelectOptions} />
                  </Col>
                  <Col lg={6}>
                    <InputWithLabel
                      label="Zip Code"
                      placeholder="000000"
                      type="text"
                    />
                  </Col>
                  <Col lg={12}>
                    <Button label={'Save'} className={'rounded-2 w-100 mb-3'} size={'xs'} />
                    <Button label={'Use for this trip only'} className={'rounded-2 w-100 bordered'} size={'xs'} />

                  </Col>
                </Row>


              </Tab>

            </Tabs>
            <div className='divider_cmn'></div>
            <InputWithLabel
              label="POC Name"
              placeholder="Enter name here"
              type="text"
            />
            <InputWithLabel
              label="POC Phone"
              placeholder="(000) 000-0000"
              type="text"
            />
            <TextAreaWithLabel
              label="Add Note"
              placeholder="Add Note"
              type="text"
            />
          </div></Col>
      </Row>
      <div className="d-flex justify-content-between mt-3">
        <Button label={'Previous'} className={'rounded-2 bordered'} size={'small'} onClick={handlePrevious} />

        <Button label={'Next'} className={'rounded-2'} size={'small'} onClick={handleNext} />
      </div>
    </div>
  )
}

export default JobStepThree