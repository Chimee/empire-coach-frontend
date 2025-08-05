
import React from 'react'
import './style.css'
import Button from '../../components/shared/buttons/button'
import { Row, Col } from 'react-bootstrap'
import { RecieptSvg } from '../../svgFiles/RecieptSvg'
const UploadDocument = () => {
    return (
        <div className='mobile_wrapper position-relative d-flex flex-column px-3 pt-3'>
            <h3 className='mob-heading mt-1 mb-3'>Upload Trip Documents</h3>
            <div className='flex-grow-1 picupForm'>
                <Row className='row-gap-2 mb-2'>
                    <Col xs={6} className='pe-0'>
                        <div className='vehiclePhoto uploadDoc position-relative d-flex flex-column justify-content-center align-items-center'>
                            <input type="file" />
                            <RecieptSvg />
                            <p className='mb-0 text-black'>Fuel Receipt</p>
                        </div>
                    </Col>
                    <Col xs={6}>
                        <div className='vehiclePhoto uploadDoc position-relative d-flex flex-column justify-content-center align-items-center'>
                            <input type="file" />
                            <RecieptSvg />
                            <p className='mb-0 text-black'>Hotel Receipt</p>
                        </div>
                    </Col>
                    <Col xs={6} className='pe-0'>
                        <div className='vehiclePhoto uploadDoc position-relative d-flex flex-column justify-content-center align-items-center'>
                            <input type="file" />
                            <RecieptSvg />
                            <p className='mb-0 text-black'>Flight Confirmation</p>
                        </div>
                    </Col>
                    <Col xs={6}>
                        <div className='vehiclePhoto uploadDoc position-relative d-flex flex-column justify-content-center align-items-center'>
                            <input type="file" />
                            <RecieptSvg />
                            <p className='mb-0 text-black'>Daily Driver Log</p>
                        </div>
                    </Col>
                    <Col xs={6}>
                        <div className='vehiclePhoto uploadDoc position-relative d-flex flex-column justify-content-center align-items-center'>
                            <input type="file" />
                            <RecieptSvg />
                            <p className='mb-0 text-black'>Other Receipts</p>
                        </div>
                    </Col>
                </Row>
                <label htmlFor="damageNotes" className='cmn_label  form-label d-block mt-3'>Additional Notes</label>
                <textarea name="damageNotes" className='form-control' id="" rows={6} placeholder='Enter any Additional notes...'></textarea>
            </div>
            <div className='text-center px-3 pb-3 d-flex flex-column gap-2'>
                <Button label='Back' className='rounded w-100 bordered  ' />
                <Button label='Submit' className='rounded w-100' />
            </div>
        </div>
    )
}

export default UploadDocument