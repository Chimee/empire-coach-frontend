import React from 'react'
import './style.css'
import { DriverLocationSvg } from '../../svgFiles/DriverLocationSvg'
import { DriverDropLocationSvg } from '../../svgFiles/DriverDropLocationSvg'
import Button from '../../components/shared/buttons/button'
const rideDeatails = () => {
    return (
        <div className='mobile_wrapper position-relative d-flex flex-column'>
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6396957.383016897!2d-99.66486626180465!3d38.47577194024099!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb9fe5f285e3d%3A0x8b5109a227086f55!2sCalifornia%2C%20USA!5e0!3m2!1sen!2sin!4v1753956070095!5m2!1sen!2sin"
                width="600" height="170" style={{ border: 0 }} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            <div className='loaction flex-grow-1'>
                <ul className='p-0 pt-3'>
                    <li className='d-flex gap-2 pickupLoc position-relative pb-3'>
                        <DriverLocationSvg className="shrink-0" />
                        <div className='loc-details d-flex flex-column gap-2'>
                            <h6>Pickup Details</h6>
                            <span className='d-block'>Apr 16/2025, 3:30PM</span>
                            <span className='d-block'>Miami, FL</span>
                            <span className='d-block'>Contact : William</span>
                            <span className='d-block'>Phone : (123) 456-7890</span>
                            <span className='d-block'>Notes : Gate code 1234</span>
                        </div>
                    </li>
                    <li className='d-flex gap-2'>
                        <DriverDropLocationSvg className="flex-shrink-0 bg-white z-3" />
                        <div className='loc-details d-flex flex-column gap-2'>

                            <h6>Drop-off details</h6>
                            <span className='d-block'>Jacksonville, FL</span>
                            <span className='d-block'>Apr 17/2025, 3:30PM</span>
                            <span className='d-block'>Phone : (123) 456-7890</span>
                            <span className='d-block'>Note : Gate code 4321</span>
                        </div>
                    </li>
                </ul>
                <div className='d-flex gap-2 flex-column'>
                    <h2 className='mob-heading mb-0'>Vehicle Details</h2>
                    <p className='mob-body d-block m-0'>2022 Ford Transit</p>
                    <p className='mob-body d-block m-0'>VIN : 1FTBR3X89MKA12345</p>
                    <p className='mob-body d-block m-0'>Fuel Type: Diesel</p>
                </div>
                <div className='d-flex gap-2 flex-column mt-3'>
                    <h2 className='mob-heading mb-0'>Service Option</h2>
                    <p className='mob-body d-block m-0'>Deliver Washed</p>
                </div>
            </div>
                <div className='text-center px-3 pb-3'>
                    <Button label='Start Check-in' className='rounded w-100' />
                </div>
        </div>
    )
}

export default rideDeatails