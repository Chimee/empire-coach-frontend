

import React from 'react'
import './style.css'
import Button from '../../components/shared/buttons/button'
import tripSvgImage from '../../images/tripEnded.svg'
import { Image } from 'react-bootstrap'
import CorrectSvg from '../../svgFiles/CorrectSvg'
const CompleteDelivery = () => {
    return (
        <div className='mobile_wrapper position-relative d-flex flex-column px-3 pt-3 gap-5 justify-content-center tripStarts'>
            
                <Image src={tripSvgImage} alt={'trip-picture'} />
        
            <div className='picupForm '>

                <h6 className='d-flex gap-2 align-items-center justify-content-center highlight'><CorrectSvg /> Trip Complete</h6>
                <p className='text-center'>Thanks for completing your trip. You can upload any remaining documents within the next 48 hours.  Tap below to submit your delivery report.</p>
            </div>
        </div>
    )
}

export default CompleteDelivery