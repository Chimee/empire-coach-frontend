import React, { useState } from 'react';
import Datatable from '../../components/shared/datatable/Datatable';
import { useGetAllCompletedJobsQuery } from '../../app/customerApi/customerApi';
import { formatDateToMDY, getClassAndTitleByStatus } from '../../helpers/Utils';
import { useNavigate } from 'react-router';



const CompletedJobs = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const { data: jobsList, isLoading } = useGetAllCompletedJobsQuery({ page, search });
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
        { label: "Vin Number", accessor: "vin_number" },
        {
            label: "Route",
            accessor: "route",
            cell: ({ row }) => {
                const pickup = row?.pickup_location || "";
                const dropoff = row?.dropoff_location || "";
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
            cell: ({ row }) => <span>{formatDateToMDY(row?.dropoff_date)}</span>,
        },
        { label: "Driver", accessor: "driver_name" },
        {
            label: "Actions",
            accessor: "actions",
            cell: ({ row }) => (
                <span
                    className="cursor-pointer text-primary"
                    onClick={() => navigate(`/jobs/job-details/${row.id}`, {
                        state: { status: row?.request_status, completed: true }
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
        </>
    );
};

export default CompletedJobs;
