import React from 'react'
import PageHead from '../../components/shared/pageHead/PageHead'
import JobTabs from './JobTabs'

const Jobs = () => {
      
   
    return (
        <div> <PageHead
            title={'Jobs'}
            description={'Manage and track all transport jobs'}

        />
        <JobTabs/> 
        </div>
    )
}

export default Jobs