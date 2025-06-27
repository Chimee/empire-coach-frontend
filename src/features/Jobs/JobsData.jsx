import React from 'react'
import Datatable from '../../components/shared/datatable/Datatable';
import { EditTableSvg } from '../../svgFiles/EditTableSvg';

const JobsData = () => {
    const [page, setPage] = React.useState(1);
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };
    const dummyData = {
        data: [
            {
                _id: "1",
                name: "John Doe",
                phone: "+1 234 567 8901",
                email: "john.doe@example.com",
                status: "Active",
            },
            {
                _id: "2",
                name: "Jane Smith",
                phone: "+1 987 654 3210",
                email: "jane.smith@example.com",
                status: "Inactive",
            },
            {
                _id: "3",
                name: "Alice Johnson",
                phone: "+1 456 789 1234",
                email: "alice.johnson@example.com",
                status: "Pending",
            },
        ],
        pagination: {
            totalRecords: 3,
        },
    }

    const columns = [
        { label: "Name", accessor: "name" },
        { label: "Phone", accessor: "phone" },
        { label: "E-mail", accessor: "email" },
        {
            label: "Status",
            accessor: "actions",
            cell: ({ row }) => (
                <span
                    className="fn-badge"
                    onClick={() => alert(`Clicked on user: ${row.name}`)}
                >
                    Active
                </span>
            ),
        },
        {
            label: "Actions",
            accessor: "actions",
            cell: ({ row }) => (
                <span
                    className="cursor-pointer text-primary"
                    onClick={() => alert(`Clicked on user: ${row.name}`)}
                >
                    <EditTableSvg />
                </span>
            ),
        },
    ];
    return (

        <Datatable
            tableData={dummyData}
            columns={columns}
            onPageChange={handlePageChange}
            page={page}
            showPegination={true}
            isLoading={false}
            showFilter={true}
            title="companies"
        />

    )
}

export default JobsData