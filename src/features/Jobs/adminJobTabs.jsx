import React, { useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import AdminJobsData from './AdminJobsData';

const AdminJobTabs = () => {
  const [activeTab, setActiveTab] = useState("all");

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
  };

  // map keys to user-friendly names
  const tabesName = {
    all: "all",
    upcoming: "upcoming",
    pendingApproval: "pendingApproval",
    poMissing: "poMissing",
    changeRequestPending: "awaitingRescheduled",
    inTransit: "inTransit",
    delivered: "delivered",
    awaitingCancellation: "awaitingCancellation",
    cancelled: "cancelled",
    awaitingRescheuleDate:"awaitingRescheduled_date"
  };

  return (
    <div className="tabs_wrapper position-relative">
      <Tabs
        activeKey={activeTab}
        onSelect={handleTabChange}
        id="justify-tab-example"
        justify
        className="jobs_tabs"
      >
        <Tab eventKey="all" title="All">
          <AdminJobsData tabName={tabesName[activeTab]} />
        </Tab>
        <Tab eventKey="upcoming" title="upcoming">
          <AdminJobsData tabName={tabesName[activeTab]} />
        </Tab>
        <Tab eventKey="pendingApproval" title="Pending Approval">
          <AdminJobsData tabName={tabesName[activeTab]} />
        </Tab>
         <Tab eventKey="poMissing" title="Po Missing">
          <AdminJobsData tabName={tabesName[activeTab]} />
        </Tab>
         <Tab eventKey="changeRequestPending" title="Change Request Pending">
          <AdminJobsData tabName={tabesName[activeTab]} />
        </Tab>
        <Tab eventKey="inTransit" title="In Transit">
          <AdminJobsData tabName={tabesName[activeTab]} />
        </Tab>
         <Tab eventKey="delivered" title="Delivered">
          <AdminJobsData tabName={tabesName[activeTab]} />
        </Tab>
        <Tab eventKey="awaitingCancellation" title="Awaiting Cancellation">
          <AdminJobsData tabName={tabesName[activeTab]} />
        </Tab>
        <Tab eventKey="cancelled" title="Cancelled">
          <AdminJobsData tabName={tabesName[activeTab]} />
        </Tab>
         <Tab eventKey="awaitingRescheuleDate" title="Awaiting Rescheule Date">
          <AdminJobsData tabName={tabesName[activeTab]} />
        </Tab>
      </Tabs>
    </div>
  );
};

export default AdminJobTabs;
