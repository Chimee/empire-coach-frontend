

import React from 'react'
import { ClockSvg } from '../../svgFiles/ClockSvg'
import { LocationSvg } from '../../svgFiles/LocationSvg'

const DriversList = () => {
    return (
        <div className='dashboard_card mt-3'>
            <div className='d-flex gap-10px align-items-center justify-content-between dashboad-filter'>
                <h6 className='sub_heading mb-0'>Drivers</h6>
                <div className='d-flex gap-3 align-items-center '>
                    <span>Status :</span>
                    <select name="" id="">
                        <option value="">Submitted</option>
                    </select>
                </div>
            </div>
            <ul className='job_list d-flex flex-column gap-3 p-0'>
                {[...Array(4)].map((_, i) => (
                    <li key={i}><div className='d-flex justify-content-between align-items-center mb-3'>
                        <div className='job_head'>
                            <p className='mb-2'>Job #44102</p>
                            <h6 className='mb-0'>Craig Ekstrom Bothman</h6>
                        </div>
                    </div>
                    <h2 className='company_name'>2022 Blue Bird All American</h2>
                    <h2 className='company_name'>Progress </h2>
                        <div className='d-flex justify-content-between align-items-center'>
                            <div className='locations w-100  pr-3'>
                                <div className='location_inner'>
                                    <h6 className='pb-0 text-black'>Pickups</h6>
                                    <div className='d-flex align-items-center gap-2'>
                                        <LocationSvg className="flex-shrink-0" /> <span>Orlando, FL</span>
                                    </div>


                                </div>
                            </div>
                            <div className='locations w-100 text-end' >
                                <div className='location_inner d-inline-block text-start'>
                                    <h6 className='pb-0 text-black'>Dropoff</h6>
                                    <div className='d-flex align-items-center gap-2'>
                                        <LocationSvg className="flex-shrink-0" /> <span>Tampa, FL</span>
                                    </div>


                                </div>
                            </div>
                        </div>
                    </li>
                ))}


            </ul>
        </div>
    )
}

export default DriversList