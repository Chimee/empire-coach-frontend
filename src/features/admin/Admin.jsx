import React from 'react'
import './admin.css'
import { useNavigate } from 'react-router'
import PageHead from '../../components/shared/pageHead/PageHead'
import Datatable from '../../components/shared/datatable/Datatable'
import { EditTableSvg } from '../../svgFiles/EditTableSvg'
import { useGetAdminListQuery } from '../../app/adminApi/adminApi'
const Admin = () => {
    const navigate = useNavigate()
    const [page, setPage] = React.useState(1);
    const [search, setSearch] = React.useState('')
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };
    const handleSearch = (searchText) => {
        setSearch(searchText);
    };
    const { data: adminList } = useGetAdminListQuery({ page, limit: 10, search: search });





    const columns = [
        { label: "Name", accessor: "username" },
        { label: "Phone", accessor: "phone_number" },
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
                    className="cursor-pointer text-primary d-inline"

                >
                    <EditTableSvg
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate('/admin/add-admin', {
                                state: {
                                    mode: 'edit',
                                    adminId: row.id, // assuming you're inside a map or have `row`
                                },
                            });
                        }}
                    />
                </span>
            ),
        },
    ];
    return (
        <div>
            <PageHead
                title={'Admin'}
                description={'Overview of all transport operations'}
                addTitle={"Add Admin"}
                addDescritpion={'Add a new Admin'}
                onClick={() => navigate('/admin/add-admin')}
            />
            <Datatable
                tableData={adminList?.data}
                columns={columns}
                onPageChange={handlePageChange}
                page={page}
                showPegination={true}
                isLoading={false}
                showFilter={true}
                title="companies"
                onClickRow={(id) => navigate(`/admin/admin-details/${id}`)}
                onFilterSearch={handleSearch}
            />

        </div>
    )
}

export default Admin