import { useState, useEffect, useRef } from 'react'
import QuickJobsList from './QuickJobsList'
import JobsOverview from './JobsOverview'
import { PlusButtonSvg } from '../../svgFiles/PlusButtonSvg'
import './dashboard.css'
import { useNavigate } from 'react-router'
import { jwtDecode } from '../../helpers/AccessControlUtils'
// import 
const Dashboard = () => {
  const divRef = useRef(null);
  const navigate = useNavigate()
  const token = localStorage.getItem('authToken')
  const tokenDecode = jwtDecode(token);
  const role = tokenDecode?.role
  console.log(tokenDecode,"tokenDECODE")
  const username = tokenDecode?.username
  console.log(username,"username-------")
  const [height, setHeight] = useState(0);
  useEffect(() => {
    const updateHeight = () => {
      if (divRef.current) {
        setHeight(divRef.current.offsetHeight);
      }
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);
  return (
    <>

      <div className='d-flex gap-3 align-items-center'>
        <div className='content_list flex-grow-1'>
          <div className='d-flex justify-content-between align-items-center user-block'>
            <div className='user-details'>
              <h1 className='text-capitalize'>Hello {username ? username : "Admin"}</h1>
              <p className='mb-0'>It’s good to see you again.</p>
            </div>
            <img src='/images/bus-imageDashboard.png' alt="bus" />
          </div>
        </div>
        <div className='right_list'>
          <div className='d-flex job_req justify-content-between align-items-center'>
            <div className='create_job'>
              <h6 className='text-white'>{role === "customer" ? ' Job Request' : "Add Customer Company"}</h6>
              <p>Create a {role === "customer" ? " job request" : "Company"}</p>
            </div>
            {role === "customer" ? <PlusButtonSvg onClick={() => navigate('/jobs/create-job')} /> : <PlusButtonSvg onClick={() => navigate('/company/add-company')} />}

          </div>
        </div>
      </div>
      <div className='d-flex gap-3 mt-3'>
        <div className='content_list flex-grow-1'>
          <QuickJobsList height={height} />
        </div>
        <div className='right_list' ref={divRef}>
          <JobsOverview />
        </div>
      </div>
    </>
  )
}

export default Dashboard