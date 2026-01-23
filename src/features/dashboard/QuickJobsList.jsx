import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ClockSvg } from '../../svgFiles/ClockSvg';
import { LocationSvg } from '../../svgFiles/LocationSvg';
import { useGetAllJobsByStatusQuery } from '../../app/customerApi/customerApi';
import { useGetAllJobsByStatusAdminQuery } from '../../app/adminApi/adminApi';
import { jwtDecode } from "../../helpers/AccessControlUtils";
import { formatDate, getClassAndTitleByStatus, formatTimeTo12Hour ,formatDateTimeInTimezone } from '../../helpers/Utils';
import { useNavigate } from "react-router-dom";

const AdminTabs = [
  { label: "All", value: "all" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Pending Approval", value: "pendingApproval" },
  { label: "PO Missing", value: "poMissing" },
  { label: "Change Request Pending", value: "awaitingRescheduled" },
  { label: "In Transit", value: "inTransit" },
  { label: "Delivered", value: "delivered" },
  { label: "Awaiting Cancellation", value: "awaitingCancellation" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Awaiting Reschedule Date", value: "awaitingRescheduled_date" }
];

const CustomerTabs = [
  { label: "All", value: "all" },
  { label: "Active Jobs", value: "activeJobs" },
  { label: "Awaiting Reschedule Date", value: "awaiting_reschedule_date" },
  { label: "Awaiting Cancellation", value: "awaiting_for_cancellation" },
  { label: "PO Missing", value: "PO_missing" },
  { label: "Cancelled", value: "cancelled" }
];

const QuickJobsList = ({ height }) => {
  const limit = 10;
  const [page, setPage] = useState(1);
  const [tabName, setTabName] = useState('all');
  const [jobList, setJobList] = useState([]);

  const scrollRef = useRef(null);

  const token = localStorage.getItem("authToken");
  const parseToken = token ? jwtDecode(token) : {};
  const isUser = parseToken?.role === "customer";
  const tabesName = isUser ? CustomerTabs : AdminTabs
  const queryHook = isUser ? useGetAllJobsByStatusQuery : useGetAllJobsByStatusAdminQuery;
  const navigate = useNavigate();

  const { data, isFetching, isLoading } = queryHook(
    { tabName, page, search: '' },
    { keepPreviousData: true }
  );



  // Reset when tab changes
  useEffect(() => {
    setPage(1);
    setJobList([]);
  }, [tabName]);

  // Append jobs without duplicates
  useEffect(() => {
    if (data?.data?.data?.length) {
      setJobList(prev => {
        const newJobs = data.data.data.filter(
          job => !prev.some(existing => existing.id === job.id)
        );
        return page === 1 ? data.data.data : [...prev, ...newJobs];
      });
    }
  }, [data, page]);

  const handleScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container || isFetching) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    if (
      scrollTop + clientHeight >= scrollHeight - 50 &&
      data?.data?.data?.length === limit
    ) {
      setPage(prev => prev + 1);
    }
  }, [isFetching, data]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);
  const handleFilter = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue !== tabName) {
      setTabName(selectedValue);
    }
  };

  return (
    <div
      className="dashboard_card scrollable-section"
      ref={scrollRef}
      style={{ maxHeight: `${height}px` }}
    >
      <div className="d-flex gap-10px align-items-center justify-content-between dashboad-filter">
        <h6 className="sub_heading mb-0">Quick Access</h6>
        <div className="d-flex gap-3 align-items-center">
          <span className="text-nowrap">Status :</span>
          {/* Controlled select to avoid flicker */}
          <select
            onChange={handleFilter}
            className="form-select"
            value={tabName}
          >
            {tabesName.map((tab) => (
              <option key={tab.value} value={tab.value}>
                {tab.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ul className="job_list d-flex flex-column gap-3 p-0">
        {jobList.length > 0 ? (
          jobList.map((job) => {
            const { className, title } = getClassAndTitleByStatus(job?.request_status);

            return (
              <li
                key={job.id}
                onClick={() =>
                  isUser
                    ? navigate(`/jobs/job-details/${job.id}`)
                    : navigate(`/admin-jobs/job-details/${job.id}`)
                }
                style={{ cursor: "pointer" }}
              >
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="job_head">
                    <h6 className="mb-0">Job #{job?.id}</h6>
                    <p className="mb-0">{job?.companyName}</p>
                  </div>
                  <span className={`fn-badge ${className}`}>{title}</span>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="locations w-100 border-end pr-3">
                    <div className="location_inner">
                      <h6>Pickups</h6>
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <ClockSvg className="flex-shrink-0" />
                        <span>{`${formatDate(job?.pickup_date)} ${formatTimeTo12Hour(job?.pickup_time)}`}</span>
                      </div>
                      {job?.pickup_business_name && (
                        <p className="mb-1 fw-medium">{job.pickup_business_name}</p>
                      )}
                      <div className="d-flex align-items-center gap-2">
                        <LocationSvg className="flex-shrink-0" />
                        <span>{job?.pickup_location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="locations w-100 text-end ps-3">
                    <div className="location_inner d-inline-block text-start">
                      <h6>Dropoff</h6>
                      {job?.dropoff_date && (<div className="d-flex align-items-center gap-2 mb-3">
                        <ClockSvg className="flex-shrink-0" />
                        <span>{`${formatDate(job?.dropoff_date)} ${formatTimeTo12Hour(job?.dropoff_time)}`}</span>
                      </div>)}
                      {job?.dropoff_business_name && (
                        <p className="mb-1 fw-medium">{job.dropoff_business_name}</p>
                      )}
                      <div className="d-flex align-items-center gap-2">
                        <LocationSvg className="flex-shrink-0" />

                        <span>{job?.dropoff_location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <h4 className="pb-2">{job?.driver_name || 'driver not assigned'}</h4>
              </li>
            );
          })
        ) : !isLoading ? (
          <li className="text-muted">No jobs found.</li>
        ) : null}

        {isFetching && <li>Loading more...</li>}
      </ul>
    </div>
  );
};

export default QuickJobsList;
