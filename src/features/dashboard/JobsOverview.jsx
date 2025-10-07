import React from 'react'
import { JobRequestSvg } from '../../svgFiles/JobRequestSvg'
import { CompletedJobSvg } from '../../svgFiles/CompletedJobSvg'
import { PoMissingSvg } from '../../svgFiles/PoMissingSvg'
import { AwaitingSvg } from '../../svgFiles/AwaitingSvg'
import { TransitSvg } from '../../svgFiles/TransitSvg'
import { CancelledSvg } from '../../svgFiles/CancelledSvg'
import {useGetJobOverviewQuery} from "../../app/dashBoardApi"


const JobsOverview = () => {
  const { data, isFetching, isLoading } = useGetJobOverviewQuery();


    return (
        <div className='dashboard_card'>

            <h6 className='sub_heading mb-0'>Overview</h6>
            <p>#{data?.data.pendingJobs} job requests still waiting for approval</p>
            <ul className='overview_list d-flex gap-3 flex-column pt-2 mb-0'>
                <li className='d-flex justify-content-between'>
                    <div>
                        <h6>Total job requests</h6>
                        <h5>{data?.data.totalJobs}</h5>
                    </div>
                    <JobRequestSvg/>
                </li>
                <li className='d-flex justify-content-between'>
                    <div>
                        <h6>Completed jobs</h6>
                        <h5>{data?.data.completedJobs}</h5>
                    </div>
                   <CompletedJobSvg/>
                </li>
                <li className='d-flex justify-content-between'>
                    <div>
                        <h6>PO missing</h6>
                        <h5>{data?.data.pomissingjobs}</h5>
                    </div>
                  <PoMissingSvg/>
                </li>
                <li className='d-flex justify-content-between'>
                    <div>
                        <h6>Awaiting Reschedule date</h6>
                        <h5>{data?.data.awaiting_reschedule_Jobs}</h5>
                    </div>
                  <AwaitingSvg/>
                </li>
                <li className='d-flex justify-content-between'>
                    <div>
                        <h6>In-transit</h6>
                        <h5>{data?.data.inTransitjobs}</h5>
                    </div>
                  <TransitSvg/>
                </li>
                <li className='d-flex justify-content-between'>
                    <div>
                        <h6>Cancelled</h6>
                        <h5>{data?.data.cancelledJobs}</h5>
                    </div>
                  <CancelledSvg/>
                </li>
            </ul>

        </div>
    )
}

export default JobsOverview