import React from 'react'
import './header.css'
import Avatar from '../../../images/Avatar.svg'
import { jwtDecode } from "../../../helpers/AccessControlUtils"

const Header = () => {
  const token = localStorage.getItem('authToken')
  const tokenDecode = jwtDecode(token)

  // Capitalize first letter
  const username = tokenDecode?.username
    ? tokenDecode.username.charAt(0).toUpperCase() + tokenDecode.username.slice(1)
    : ""

  const role = tokenDecode?.role || ""

  return (
    <div className='headerWrapper'>
      <div className='header_user'>
        <div className='user_image'>
          {/* <img src={Avatar} alt="Avatar" /> */}
          <span className='online'></span>
        </div>
        <div className='user_info'>
          <h5 className='m-0'>{username}</h5>
          <p className='desig m-0'>{role}</p>
        </div>
      </div>
    </div>
  )
}

export default Header
