

import React from 'react'
import './style.css'
import { BackChevronSvg } from '../../svgFiles/BackChevronSvg'
import Button from '../../components/shared/buttons/button'
import InputWithLabel from '../../components/shared/fields/InputWithLabel'
import { CameraSvg } from '../../svgFiles/CameraSvg'
const StartPickup = () => {
    return (
        <div className='mobile_wrapper position-relative d-flex flex-column px-3 pt-3'>
            <BackChevronSvg />
            <h3 className='mob-heading mt-1'>Start Pickup</h3>
            <div className='flex-grow-1 picupForm'>
                <InputWithLabel
                    label={'Enter starting Mileage'}
                    type='number'
                    onChange={() => { }}
                    placeholder={'0'}
                />
                <label htmlFor="VehiclePhotos" className='cmn_label  form-label'>Photos of Vehicle</label>
                <div className='vehiclePhoto position-relative d-flex flex-column justify-content-center align-items-center'>
                    <input type="file"  />
                    <CameraSvg/>
                    <p className='mb-0'>Tap to upload photos</p>
                </div>
                <label htmlFor="damageNotes" className='cmn_label  form-label d-block mt-3'>Damage Notes</label>
                <textarea name="damageNotes" className='form-control' id="" rows={6} placeholder='Enter any damage notes...'></textarea>
            </div>
            <div className='text-center px-3 pb-3'>
                <Button label='Begin Trip' className='rounded w-100' />
            </div>
        </div>
    )
}

export default StartPickup