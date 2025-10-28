

import React from 'react'
import Datatable from '../../components/shared/datatable/Datatable';
import { EditTableSvg } from '../../svgFiles/EditTableSvg';
import { useGetAllJobsByStatusAdminQuery } from '../../app/adminApi/adminApi';
import { formatDateToMDY } from '../../helpers/Utils';
import { getClassAndTitleByStatus } from '../../helpers/Utils';
import { useNavigate } from 'react-router';
const AdminJobsData = ({ tabName }) => {
    const navigate = useNavigate();
    const [page, setPage] = React.useState(1);
    const [search, setSearch] = React.useState("")
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleSearchJobs = (value) => {
        setSearch(value);
    }

    const { data: jobsList, isLoading, error } = useGetAllJobsByStatusAdminQuery({ tabName: tabName, page: page, search: search });

    
    const columns = [
        {
            label: "Id",
            accessor: "id",
            cell: ({ row }) => (
                <span

                >
                    {`${row?.id}`}
                </span>
            ),
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
            label: "PO Number",
            accessor: "po-number",
            cell: ({ row }) => (
                row.po_number ? (
                    <span>{row.po_number}</span>
                ) : (
                    <span className=""> - </span>
                )
            )
        },
        {
            label: "Status",
            accessor: "actions",
            cell: ({ row }) => {
                const { className, title } = getClassAndTitleByStatus(row?.request_status);

                return (
                    <span className={`fn-badge ${className}`}>
                        {title}
                    </span>
                );
            },
        },
        {
            label: "Pickup Date",
            accessor: "pickupDate",
            cell: ({ row }) => (
                <span>
                    {row?.pickup_date ? formatDateToMDY(row.pickup_date) : "-"}
                </span>
            ),
        },
        {
            label: "Delivery Date",
            accessor: "pickupDate",
            cell: ({ row }) => (
                <span>
                    {row?.dropoff_date ? formatDateToMDY(row.dropoff_date) : "-"}
                </span>
            ),
        },

        { label: "Driver", accessor: "driver_name" },
        {
            label: "Actions",
            accessor: "actions",
            cell: ({ row }) => (
                <span
                    className="cursor-pointer text-primary"
                    onClick={() => navigate(`/admin-jobs/job-details/${row.id}`, {
                        state: { status: row?.request_status }
                    })}
                >
                    View
                </span>
            ),
        },
    ];
    return (

        <Datatable
            tableData={jobsList?.data}
            columns={columns}
            onPageChange={handlePageChange}
            page={page}
            showPegination={true}
            isLoading={false}
            showFilter={true}
            onFilterSearch={handleSearchJobs}
            title="Job List"
        />

    )
}

export default AdminJobsData