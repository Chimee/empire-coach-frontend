import React from 'react'
import { useNavigate } from 'react-router'
import PageHead from '../../components/shared/pageHead/PageHead'
import Datatable from '../../components/shared/datatable/Datatable'
import { EditTableSvg } from '../../svgFiles/EditTableSvg'
import { useGetDriversListQuery } from '../../app/driverApi/driverApi'
const Driver = () => {
    const [page, setPage] = React.useState(1);
    const [search, setSearch] = React.useState('');
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };
    const handleSearch = (searchText) => {
        setSearch(searchText);
    };
    const { data: driverList } = useGetDriversListQuery({ page, limit: 10, search: search });

    const navigate = useNavigate()
    const columns = [
        { label: "Name", accessor: "name" },
        { label: "Phone", accessor: "raw_phone" },
        { label: "E-mail", accessor: "email" },
        {
            label: "Status",
            accessor: "actions",
            cell: ({ row }) => (
                <span
                    className="fn-badge"
                    
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
                    className="cursor-pointer text-primary">
                    <EditTableSvg   onClick={(e) => {
                            e.stopPropagation();
                            navigate('/drivers/add-driver', {
                                state: {
                                    mode: 'edit',
                                    driverId: row.id, // assuming you're inside a map or have `row`
                                },
                            });
                        }}/>
                </span>
            ),
        },
    ];
    return (
        <div>
            <PageHead
                title={'Drivers'}
                description={'Overview of all drivers'}
                addTitle={"Add Driver"}
                addDescritpion={'Add a new Driver'}
                onClick={() => navigate('/drivers/add-driver')}
            />
            <Datatable
                tableData={driverList?.data}
                columns={columns}
                onPageChange={handlePageChange}
                page={page}
                showPegination={true}
                isLoading={false}
                showFilter={true}
                title="Drivers"
                onClickRow={(id) => navigate(`/drivers/driver-details/${id}`)}
                onFilterSearch={handleSearch}
            />

        </div>
    )
}

export default Driver