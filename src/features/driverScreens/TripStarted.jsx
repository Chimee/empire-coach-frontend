


import React from 'react'
import './style.css'
import Button from '../../components/shared/buttons/button'
import tripSvgImage from '../../images/tripSvg.svg'
import { useNavigate ,useParams } from 'react-router'
import { Image } from 'react-bootstrap'
import CorrectSvg from '../../svgFiles/CorrectSvg'
const TripStarted = () => {
    const {id,driverId} = useParams()
    const navigate = useNavigate();
    return (
        <div className='mobile_wrapper position-relative d-flex flex-column px-3 pt-3 gap-5 justify-content-end tripStarts'>
            
                <Image src={tripSvgImage} alt={'trip-picture'} />
        
            <div className='picupForm '>
                <h6 className='d-flex gap-2 align-items-center justify-content-center highlight'><CorrectSvg /> Trip Started</h6>
                <p className='text-center'>The trip has been started. Drive safely!</p>
            </div>
            <div className='text-center px-3 pb-3 pt-5'>              
                <Button label='Begin Trip' className='rounded w-100' 
                onClick={()=>navigate(`/ride-detail/jobId/${id}/driver/${driverId}`)}/>
            </div>
        </div>
    )
}

export default TripStarted