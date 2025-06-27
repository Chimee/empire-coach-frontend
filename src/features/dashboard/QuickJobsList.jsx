import React from 'react'
import { ClockSvg } from '../../svgFiles/ClockSvg'
import { LocationSvg } from '../../svgFiles/LocationSvg'

const QuickJobsList = () => {
    return (
        <div className='dashboard_card '>
            <div className='d-flex gap-10px align-items-center justify-content-between dashboad-filter'>
                <h6 className='sub_heading mb-0'>Quick Access</h6>
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
                            <h6 className='mb-0'>Job #44102</h6>
                            <p className='mb-0'>2022 Blue Bird All American</p>
                        </div>
                        <span className='type_tag'>Submitted</span>
                    </div>
                        <div className='d-flex justify-content-between align-items-center mb-3'>
                            <div className='locations w-100 border-end pr-3'>
                                <div className='location_inner'>
                                    <h6>Pickups</h6> 
                                    <div className='d-flex align-items-center gap-2 mb-3'>
                                        <LocationSvg className="flex-shrink-0"/> <span>Orlando, FL</span>
                                    </div>
                                    <div className='d-flex align-items-center gap-2 '>
                                        <ClockSvg className="flex-shrink-0"/> <span>Apr 30, 10:00 AM</span>
                                    </div>
                                   
                                </div>
                            </div>
                            <div className='locations w-100 text-end' >
                                <div className='location_inner d-inline-block text-start'>
                                    <h6>Dropoff</h6> 
                                    <div className='d-flex align-items-center gap-2 mb-3'>
                                        <LocationSvg className="flex-shrink-0"/> <span>Tampa, FL</span>
                                    </div>
                                    <div className='d-flex align-items-center gap-2 '>
                                        <ClockSvg className="flex-shrink-0"/> <span>Apr 30, 10:00 AM</span>
                                    </div>
                                   
                                </div>
                            </div>
                        </div>
                        <h4 className='pb-2'>No driver assigned yet</h4>
                    </li>
                ))}


            </ul>
        </div>
    )
}

export default QuickJobsList