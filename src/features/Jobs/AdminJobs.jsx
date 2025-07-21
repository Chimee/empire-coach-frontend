import React from 'react'
import PageHead from '../../components/shared/pageHead/PageHead'
import AdminJobTabs from './adminJobTabs'
const AdminJobs = () => {


  return (
    <div> 
      <PageHead
      title={'Jobs'}
      description={'Manage and track all transport jobs'}

    />
      <AdminJobTabs />
    </div>
  )
}

export default AdminJobs