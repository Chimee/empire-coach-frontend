import React from 'react'
import PageHead from '../../components/shared/pageHead/PageHead'
import Datatable from '../../components/shared/datatable/Datatable'
import { useNavigate } from 'react-router'
import { EditTableSvg } from '../../svgFiles/EditTableSvg'
import { useGetCompanyListQuery } from '../../app/companyApi/companyApi'
const Company = () => {
    const [page, setPage] = React.useState(1);
    const [search, setSearch] = React.useState('')
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };
    const handleSearch = (searchText) => {
        setSearch(searchText);
    };
    const { data: useData } = useGetCompanyListQuery({ page, limit: 10, search: search })
    const navigate = useNavigate();


    const columns = [
        { label: "Company name", accessor: "name" },
        { label: "POC Name", accessor: "contact_person_name" },
        { label: "POC Phone", accessor: "contact_person_phone" },
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
                    className="cursor-pointer text-primary"                >
                    <EditTableSvg onClick={(e) => { e.stopPropagation(); navigate("/company/edit-company", { state: { companyId: row?.id} }); }} />
                </span>
            ),
        },
    ];
    return (
        <div>
            <PageHead
                title={'Company'}
                description={'Overview of all transport operations'}
                addTitle={"Add company"}
                addDescritpion={'Add a new company'}
                onClick={() => navigate('/company/add-company')}
            />

            <Datatable
                tableData={useData?.data}
                columns={columns}
                onPageChange={handlePageChange}
                onFilterSearch={handleSearch}
                page={page}
                showPegination={true}
                isLoading={false}
                showFilter={true}
                title="companies"
                onClickRow={(id) => navigate(`/company/company-details/${id}`)}
            />
        </div>
    )
}

export default Company