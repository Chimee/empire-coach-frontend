import React from 'react'
import CommonModal from '../modalLayout/CommonModal'
import { Row,Col } from 'react-bootstrap'
import InputWithLabel from '../fields/InputWithLabel'
import InputWithIcon from '../fields/InputWithIcon'
import Button from '../buttons/button'
import { RefreshSvg } from '../../../svgFiles/RefreshSvg'
const AddEmployeeModal = ({show,handleClose,setShow}) => {
  return (
    <CommonModal show={show} handleClose={handleClose} setShow={setShow} title="Adding Employees  Data">
      <Row>
        <Col lg={6}>
        <InputWithLabel
          label="Total Employees"
          type="text"
          name="totalemployee"          
          placeholder="10"
          required={false}
        />
        </Col>
        <Col lg={6}>
        <InputWithLabel
          label="Employees in Unloading Area"
          type="email"
          name="employeesUnloading"          
          placeholder="5"
          required={false}
        />
        </Col>
        <Col lg={6}>
        <InputWithIcon
          label="Phone Number"
          type="tel"
          name="phoneNumber"          
          placeholder="8787878787"
          required={false}
          icon={RefreshSvg}
          disabled={true}
        />
        </Col>
        <Col lg={6}>
        <InputWithLabel
          label="Case Count"
          type="text"
          name="casecount"          
          placeholder="5"
          required={false}
          disabled={true}
        />
        </Col>
      
        <Col className='text-end'>
        <Button label="Save Changes" size="small"/> 
        </Col>
      </Row>

    </CommonModal>
  )
}

export default AddEmployeeModal