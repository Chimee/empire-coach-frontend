import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ClockSvg } from '../../svgFiles/ClockSvg';
import { LocationSvg } from '../../svgFiles/LocationSvg';
import { useGetAllJobsByStatusQuery } from '../../app/customerApi/customerApi';
import { useGetAllJobsByStatusAdminQuery } from '../../app/adminApi/adminApi';
import { jwtDecode } from "../../helpers/AccessControlUtils";

const tabesName = {
  All: 'all',
  activeJobs: 'activeJobs',
  awaiting_reschedule_date: 'awaiting_reschedule_date',
  awaitingCancellation: 'awaiting_for_cancellation',
  poMissing: 'PO_missing',
  cancelled: 'cancelled',
};

const QuickJobsList = () => {
  const [page, setPage] = useState(1);
  const [tabName, setTabName] = useState('all');
  const [jobList, setJobList] = useState([]);

  const scrollRef = useRef(null);

  const token = localStorage.getItem("authToken");
  const parseToken = token ? jwtDecode(token) : {};

  // Decide which query hook to use based on role
  const isUser = parseToken?.role === "customer";
  const queryHook = isUser ? useGetAllJobsByStatusQuery : useGetAllJobsByStatusAdminQuery;

  const { data, isFetching, isLoading } = queryHook(
    { tabName, page, search: '' },
    { keepPreviousData: true }
  );

  // Reset on tab change
  useEffect(() => {
    setPage(1);
    setJobList([]);
  }, [tabName]);

  // Append or replace job list
  useEffect(() => {
    if (data?.data?.data?.length) {
      setJobList(prev =>
        page === 1 ? data.data.data : [...prev, ...data.data.data]
      );
    }
  }, [data, page]);

  const handleScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container || isFetching) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      setPage(prev => prev + 1);
    }
  }, [isFetching]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleFilter = e => {
    const selectedTab = tabesName[e.target.value];
    if (selectedTab !== tabName) {
      setTabName(selectedTab);
    }
  };

  return (
    <div className="dashboard_card scrollable-section" ref={scrollRef}>
      <div className="d-flex gap-10px align-items-center justify-content-between dashboad-filter">
        <h6 className="sub_heading mb-0">Quick Access</h6>
        <div className="d-flex gap-3 align-items-center">
          <span>Status :</span>
          <select onChange={handleFilter} className="form-select" value={tabName}>
            {Object.keys(tabesName).map(key => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ul className="job_list d-flex flex-column gap-3 p-0">
        {jobList.length > 0 ? (
          jobList.map((job, i) => (
            <li key={job.id || i}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="job_head">
                  <h6 className="mb-0">Job #{job.id}</h6>
                  <p className="mb-0">{job.id}</p>
                </div>
                <span className="type_tag">{job.request_status}</span>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="locations w-100 border-end pr-3">
                  <div className="location_inner">
                    <h6>Pickups</h6>
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <LocationSvg className="flex-shrink-0" />
                      <span>{job.pickup_location}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <ClockSvg className="flex-shrink-0" />
                      <span>{job.pickup_date}</span>
                    </div>
                  </div>
                </div>
                <div className="locations w-100 text-end">
                  <div className="location_inner d-inline-block text-start">
                    <h6>Dropoff</h6>
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <LocationSvg className="flex-shrink-0" />
                      <span>{job.dropoff_location}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <ClockSvg className="flex-shrink-0" />
                      <span>{job.dropoff_date}</span>
                    </div>
                  </div>
                </div>
              </div>

              <h4 className="pb-2">{job?.driver_name || 'driver not assigned'}</h4>
            </li>
          ))
        ) : !isLoading ? (
          <li className="text-muted">No jobs found.</li>
        ) : null}

        {isFetching && <li>Loading more...</li>}
      </ul>
    </div>
  );
};

export default QuickJobsList;
