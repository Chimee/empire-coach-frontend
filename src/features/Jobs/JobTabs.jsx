import React from 'react'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import JobsData from './JobsData';
const JobTabs = () => {
    return (
       <div className='tabs_wrapper position-relative' >
         <Tabs
            defaultActiveKey="upcoming"
            id="justify-tab-example"
            justify
           className="jobs_tabs"
        >
            <Tab eventKey="upcoming" title="Upcoming">
                <JobsData />
            </Tab>
            <Tab eventKey="pendingApproval" title="Pending Approval">
                <JobsData />
            </Tab>
            <Tab eventKey="poMissing" title="PO Missing">
                <JobsData />
            </Tab>
            <Tab eventKey="inTransit" title="In-transit">
                <JobsData />
            </Tab>
            <Tab eventKey="delivered" title="Delivered">
                <JobsData />
            </Tab>
            <Tab eventKey="cancelled" title="Cancelled">
                <JobsData />
            </Tab>
        </Tabs>
       </div>
    )
}

export default JobTabs