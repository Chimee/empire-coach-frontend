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
      label: "Job Id",
      accessor: "id",
      cell: ({ row }) => <span>{`job-${row?.id}`}</span>,
    },
    { label: "Vehicle", accessor: "vehicle_make" },
    { label: "Vin Number", accessor: "vin_number" },
    { label: "Route", accessor: "vin_number" },
    { label: "Job Link", accessor: "vin_number" },
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
      cell: ({ row }) => <span>{formatDateToMDY(row?.dropoff_date)}</span>,
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
    { label: "Driver", accessor: "vin_number" },
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
