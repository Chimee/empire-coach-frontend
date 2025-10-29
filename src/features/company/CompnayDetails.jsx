import React from 'react'
import Breadcrumb from '../../components/shared/breadcrumb/Breadcrumb';
import { PlusButtonSvg } from '../../svgFiles/PlusButtonSvg';
import { useNavigate } from 'react-router';
import { Col, Form, Row } from 'react-bootstrap';
import Datatable from '../../components/shared/datatable/Datatable';
import { EditTableSvg } from '../../svgFiles/EditTableSvg';
import { useParams } from 'react-router';
import { useGetCompanyDetailQuery } from '../../app/companyApi/companyApi';
import { formatDateToMDY ,formatPhoneNumber} from '../../helpers/Utils';
import { useGetCompanyCustomersListQuery, useUpdateCompanyMutation } from '../../app/companyApi/companyApi';

const CompnayDetails = () => {
    const { id } = useParams()
    const { data: companyDetails, isLoading } = useGetCompanyDetailQuery({ id }, { skip: !id })
    const { data: customerList } = useGetCompanyCustomersListQuery({ id }, { skip: !id })
    console.log("companyDetails", companyDetails)
    const [isActive, setIsActive] = React.useState(false);
    React.useEffect(() => {
        if (companyDetails?.data?.active_status) {
            setIsActive(companyDetails.data.active_status === "active");
        }
    }, [companyDetails]);
    const [updateCompany] = useUpdateCompanyMutation();

    const navigate = useNavigate()
    const breadcrumbItems = [
        { name: 'Company', path: '/company' },
        { name: 'Company Details' },
    ];
    const [page, setPage] = React.useState(1);
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };


    const columns = [
        { label: "Full Name", accessor: "username" },
        { label: "E-mail", accessor: "email" },
        { label: "Phone", accessor: "raw_phone" },
        { label: "Last Login", accessor: "last_login" },
        {
            label: "Status",
            accessor: "active_status",
            cell: ({ row }) => (
                <span className={`fn-badge ${row.active_status ? "badge-active" : "badge-inactive"}`}>
                    {row.active_status == "active" ? "Active" : "Inactive"}
                </span>
            ),
        },

        {
            label: "Actions",
            accessor: "actions",
            cell: ({ row }) => (
                <span
                    className="cursor-pointer text-primary">
                    <EditTableSvg onClick={(e) => { e.stopPropagation(); navigate('/company/company-details/add-customer', { state: { customerId: row.id, mode: 'edit' , companyId: id} }); }} />
                </span>
            ),
        },
    ];
    return (
        <>
            <div className='d-flex justify-content-between gap-3'>
                <div><Breadcrumb
                    items={breadcrumbItems}
                    title={companyDetails?.data?.name}
                />
                    <Form.Check
                        className='d-flex flex-column-reverse justify-content-start p-0 custom_switch'
                        type="switch"
                        id="custom-switch"
                        label="Active"
                        checked={isActive}
                        onChange={async (e) => {
                            const newValue = e.target.checked;
                            setIsActive(newValue);
                            try {
                                await updateCompany({
                                    data: {
                                        companyId: id,
                                        active_status: newValue ? "active" : "inactive",
                                    }
                                }).unwrap();
                            } catch (error) {
                                console.error("Failed to update status:", error);
                                setIsActive(!newValue);
                            }
                        }}
                    />
                </div>
                <div className='right_list'>

                    <div className='d-flex job_req justify-content-between align-items-center'>
                        <div className='create_job'>
                            <h6 className='text-white'>Add Customer Users</h6>
                            <p>{'Add a new customer user to company'}</p>
                        </div>
                        <PlusButtonSvg onClick={() => {
                            navigate('/company/company-details/add-customer', {
                                state: { companyId: id },
                            })
                        }} />
                    </div>
                </div>
            </div>
            <Row className='mt-5'>
                <Col lg={4}>
                    <h5 className='info-label'>Billing Address</h5>
                    <p className='info-value'> {isLoading ? "----" : companyDetails?.data?.address}</p>
                    <h5 className='info-label'>E-mail</h5>
                    <p className='info-value'> {isLoading ? "----" : companyDetails?.data?.email}</p>
                </Col>
                <Col lg={4}>
                    <h5 className='info-label'>Point of Contact</h5>
                    <p className='info-value'> {isLoading ? "----" : companyDetails?.data?.contact_person_name}</p>
                    <h5 className='info-label'>Registration Date</h5>
                    <p className='info-value'> {isLoading ? "----" : formatDateToMDY(companyDetails?.data?.createdAt)}</p>
                </Col>
                <Col lg={4}>
                    <h5 className='info-label'>POC Phone</h5>
                    <p className='info-value'> {isLoading ? "----" :(companyDetails?.data?.raw_phone)}</p>
                    <h5 className='info-label'>Last Updated</h5>
                    <p className='info-value'> {isLoading ? "----" : formatDateToMDY(companyDetails?.data?.updatedAt)}</p>
                </Col>
            </Row>
            <Datatable
                tableData={customerList?.data}
                columns={columns}
                onPageChange={handlePageChange}
                page={page}
                showPegination={true}
                isLoading={false}
                showFilter={false}
                title="Customer Users"
                onClickRow={(customerId) =>
                    navigate(`/company/customer-details/${customerId}`, {
                        state: { companyId: id }
                    })
                }
            />
        </>
    )
}

export default CompnayDetails