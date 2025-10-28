import React, { useState } from 'react';
import Datatable from '../../components/shared/datatable/Datatable';
import { useGetAllJobsByStatusQuery } from '../../app/customerApi/customerApi';
import { formatDateToMDY, getClassAndTitleByStatus } from '../../helpers/Utils';
import { useNavigate } from 'react-router';
import Button from '../../components/shared/buttons/button';
import VehicleDetailsModal from '../../components/shared/modalContent/FillingPoModel';

const JobsData = ({ tabName }) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data: jobsList, isLoading } = useGetAllJobsByStatusQuery({ tabName, page, search });
  const [addPoPopup, setPoPopup] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSearchJobs = (value) => {
    setSearch(value);
  };

  const columns = [
    {
      label: "Id",
      accessor: "id",
      cell: ({ row }) => <span>{`${row?.id}`}</span>,
    },
    { label: "Vehicle", accessor: "vehicle_make" },
    { label: "Vin Number", accessor: "vin_number" },
    {
      label: "Route",
      accessor: "route",
      cell: ({ row }) => {
        const pickup = row?.pickup_business_name?.trim()
          ? row.pickup_business_name
          : (row?.pickup_location || "");

        const dropoff = row?.dropoff_business_name?.trim()
          ? row.dropoff_business_name
          : (row?.dropoff_location || "");

        const fullRoute = `${pickup} to ${dropoff}`;
        const truncate = (text, length = 15) =>
          text.length > length ? text.slice(0, length) + "..." : text;

        return (
          <span title={fullRoute}>
            {truncate(pickup)} to {truncate(dropoff)}`
          </span>
        );
      },
    },
    {
      label: "Status",
      accessor: "status",
      cell: ({ row }) => {
        const { className, title } = getClassAndTitleByStatus(row?.request_status);
        return <span className={`fn-badge ${className}`}>{title}</span>;
      },
    },
    {
      label: "Pickup Date",
      accessor: "pickupDate",
      cell: ({ row }) => <span>{formatDateToMDY(row?.pickup_date)}</span>,
    },
    {
      label: "Delivery Date",
      accessor: "deliveryDate",
      cell: ({ row }) => (
        <span>
          {row?.dropoff_date ? formatDateToMDY(row.dropoff_date) : "-"}
        </span>
      ),
    },
    {
      label: "PO Number",
      accessor: "po-number",
      cell: ({ row }) => (
        row.po_number ? (
          <span>{row.po_number}</span>
        ) : (
          <Button
            size="small"
            label="Add PO"
            className="btn-square rounded"
            onClick={() => {
              setSelectedJob(row);
              setPoPopup(true);
            }}
          />
        )
      )
    },
    { label: "Driver", accessor: "driver_name" },
    {
      label: "Actions",
      accessor: "actions",
      cell: ({ row }) => (
        <span
          className="cursor-pointer text-primary"
          onClick={() => navigate(`/jobs/job-details/${row.id}`, {
            state: { status: row?.request_status }
          })}
        >
          View
        </span>
      ),
    },
  ];

  return (
    <>
      <Datatable
        tableData={jobsList?.data}
        columns={columns}
        onPageChange={handlePageChange}
        page={page}
        showPegination={true}
        isLoading={isLoading}
        showFilter={true}
        onFilterSearch={handleSearchJobs}
        title="Job List"
      />

      {selectedJob && (
        <VehicleDetailsModal
          show={addPoPopup}
          setShow={setPoPopup}
          job={selectedJob}
          vehicleData={selectedJob}
        />
      )}
    </>
  );
};

export default JobsData;
