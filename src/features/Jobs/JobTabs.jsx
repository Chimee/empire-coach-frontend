import React, { useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import JobsData from './JobsData';

const JobTabs = () => {
  const [activeTab, setActiveTab] = useState("all");

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
  };

  // map keys to user-friendly names
  const tabesName = {
      all: "all",
    activeJobs: "activeJobs",
    awaiting_reschedule_date: "awaiting_reschedule_date",
    awaitingCancellation: "awaiting_for_cancellation",
    poMissing: "PO_missing",
    cancelled: "cancelled",   
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
          <JobsData tabName={tabesName[activeTab]} />
        </Tab>
        <Tab eventKey="activeJobs" title="Active jobs">
          <JobsData tabName={tabesName[activeTab]} />
        </Tab>
        <Tab eventKey="awaiting_reschedule_date" title="Awaiting Rescheduled Date">
          <JobsData tabName={tabesName[activeTab]} />
        </Tab>
        <Tab eventKey="poMissing" title="Po Missing">
          <JobsData tabName={tabesName[activeTab]} />
        </Tab>
        <Tab eventKey="awaitingCancellation" title="Awaiting Cancellation">
          <JobsData tabName={tabesName[activeTab]} />
        </Tab>
        <Tab eventKey="cancelled" title="Cancelled">
          <JobsData tabName={tabesName[activeTab]} />
        </Tab>
      </Tabs>
    </div>
  );
};

export default JobTabs;
