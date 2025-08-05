




import React from 'react'
import './style.css'
import Button from '../../components/shared/buttons/button'
import { DriverLocationSvg } from '../../svgFiles/DriverLocationSvg'
import { DriverDropLocationSvg } from '../../svgFiles/DriverDropLocationSvg'
const RideStatusScreen = () => {
    const [show, setShow] = React.useState(false)
    return (
        <div className='mobile_wrapper position-relative d-flex flex-column'>
            <div className='flex-grow-1'>

                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6396957.383016897!2d-99.66486626180465!3d38.47577194024099!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb9fe5f285e3d%3A0x8b5109a227086f55!2sCalifornia%2C%20USA!5e0!3m2!1sen!2sin!4v1753956070095!5m2!1sen!2sin"
                    width="600" height="100%" style={{ border: 0 }} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>
            <div className='aboveMap'>
                <div className='job_view position-relative pt-2'>
                    <div className='d-flex justify-content-center'> <span className='arrow_down' onClick={() => setShow(!show)}></span></div>
                    <div className='driverJob'>
                        <p>Job #44213</p>
                        <span className='en-route'>En-Route</span>
                        <p>Crimson Cab Toyota Sienna (Diesel)</p>
                        <div className='d-flex'>
                            <ul className='p-0 m-0 flex-grow-1 border-end'>
                                <li className='pickupLoc position-relative align-items-center pb-3'>
                                    <DriverLocationSvg className="shrink-0 bg-white z-3" />   Orlando, FL
                                </li>
                                <li className='d-flex gap-2 align-items-center'>
                                    <DriverDropLocationSvg className="flex-shrink-0 bg-white z-3" />    Tampa, FL
                                </li>

                            </ul>
                            <ul className='pl-1 mb-0 text-black'>
                                <li className='text-center'><strong>Apr <br /> 09/2025</strong></li>
                                <li className='text-center'>3:30PM</li>
                            </ul>
                        </div>
                    </div>
                    {show &&
                        <div className='text-center pb-3 d-flex flex-column gap-3 mt-3'>
                            <Button label='Update Location' className='rounded w-100 bordered' />
                            <Button label='Upload Trip Documents' className='rounded w-100 bordered' />
                            <Button label='Start Delivery Check-Out' className='rounded w-100' disabled />
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default RideStatusScreen