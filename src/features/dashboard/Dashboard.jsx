import QuickJobsList from './QuickJobsList'
import JobsOverview from './JobsOverview'
import { PlusButtonSvg } from '../../svgFiles/PlusButtonSvg'
import './dashboard.css'
import DriversList from './DriversList'
import { useNavigate } from 'react-router'
import { jwtDecode } from '../../helpers/AccessControlUtils'
// import 
const Dashboard = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('authToken')
  const tokenDecode = jwtDecode(token);
  const role = tokenDecode?.role
   console.log(tokenDecode,"tokenDecode");
  return (
    <>

      <div className='d-flex gap-3 align-items-center'>
        <div className='content_list flex-grow-1'>
          <div className='d-flex justify-content-between align-items-center user-block'>
            <div className='user-details'>
              <h1>Hello Mark!</h1>
              <p className='mb-0'>It’s good to see you again.</p>
            </div>
            <img src='/images/bus.png' alt="bus image" />
          </div>
        </div>
        <div className='right_list'>
          <div className='d-flex job_req justify-content-between align-items-center'>
            <div className='create_job'>
              <h6 className='text-white'>{role === "customer" ? ' Job Request' : "Company Request"}</h6>
              <p>Create a {role === "customer" ?" job request" : "Company"}</p>
            </div>
            {role === "customer" ?<PlusButtonSvg onClick={() => navigate('/jobs/create-job')} /> :  <PlusButtonSvg onClick={() => navigate('/company/add-company')} /> }
            
          </div>
        </div>
      </div>
      <div className='d-flex gap-3 mt-3'>
        <div className='content_list flex-grow-1'>
          <QuickJobsList />
          <DriversList />
        </div>
        <div className='right_list'>
          <JobsOverview />
        </div>
      </div>
    </>
  )
}

export default Dashboard