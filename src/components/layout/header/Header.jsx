import React from 'react'
import './header.css'
import Avatar from '../../../images/Avatar.svg'
const Header = () => {
  return (
    <div className='headerWrapper'>
        <div className='header_user'>
            <div className='user_image'>
            {/* <img src={Avatar} alt="Avatar" /> */}
            <span className='online'></span>
            </div>
            <div className='user_info'>
                <h5 className='m-0'>Jay Hargudson</h5>
                <p className='desig m-0'>Manager</p>
            </div>
        </div>
    </div>
  )
}

export default Header