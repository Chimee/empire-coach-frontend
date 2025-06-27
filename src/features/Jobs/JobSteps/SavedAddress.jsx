import React, { useState } from 'react'
import { TogglerSvg } from '../../../svgFiles/TogglerSvg'
import { AddressLocationSvg } from '../../../svgFiles/AddressLocationSvg'
const SavedAddress = () => {
    const [toggle, setToggle] = useState(false)
    const handleToggle = () => {
        setToggle(!toggle)
    }
    return (
        <div className='d-flex gap-3 saved_address align-content-center'>
            <AddressLocationSvg className={'flex-shrink-0'} />
            <div className='address_wrapper position-relative'>
                <div className='toggle position-absolute'>
                    <TogglerSvg onClick={handleToggle} />
                    {toggle && <div className='toggle_items position-absolute'>
                        <span className='d-block'>
                            Edit
                        </span>
                        <span className='d-block'>
                            Delete
                        </span>
                    </div>}
                </div>
                <h3>Office HQ</h3>
                <p>123 Business Ave, Suite 100 San Francisco, CA 94107</p>

            </div>
        </div>
    )
}

export default SavedAddress