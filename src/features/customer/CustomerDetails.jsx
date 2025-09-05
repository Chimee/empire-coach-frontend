import { useState, useEffect } from "react"
import Breadcrumb from '../../components/shared/breadcrumb/Breadcrumb';
import { Col, Form, Row } from 'react-bootstrap';
import { useParams, useLocation } from 'react-router';
import { formatDateToMDY } from '../../helpers/Utils';
import {
    useUpdateCustomerMutation,
    useGetCustomerDetailQuery,
} from '../../app/customerApi/customerApi';
const CustomerDetails = () => {
    const { id } = useParams();
    const { data: companyDetails, isLoading } = useGetCustomerDetailQuery({ id });
    const { state } = useLocation();
    const companyId = state?.companyId;
    console.log(companyDetails)

    const breadcrumbItems = [
        { name: 'Company', path: `/company/company-details/${companyId}` },
        { name: 'Company Details' },
    ];
    const [updateCustomer, { isLoading: isUpdating }] = useUpdateCustomerMutation();
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (companyDetails?.data?.active_status) {
            setIsActive(companyDetails.data.active_status === "active");
        }
    }, [companyDetails]);

    return (
        <>
            <div className='d-flex justify-content-between gap-3'>
                <div className='d-flex justify-content-between gap-3 align-items-center w-100'>
                    <div>
                        <Breadcrumb
                            items={breadcrumbItems}
                            title={companyDetails?.data?.username}
                        />
                    </div>
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
                                await updateCustomer({
                                    data: {
                                        customerId: companyDetails?.data?.id,
                                        is_active: newValue
                                    }
                                }).unwrap();
                            } catch (error) {
                                setIsActive(!newValue);
                                console.error("Failed to update status:", error);
                            }
                        }}
                    />

                </div>
            </div>

            <Row className='mt-5'>
                <Col lg={4}>
                    <h5 className='info-label'>E-mail</h5>
                    <p className='info-value'>{isLoading ? "----" : companyDetails?.data?.email}</p>
                    <h5 className='info-label'>Created By</h5>
                    <p className='info-value'>
                        {isLoading ? "----" : companyDetails?.data?.created_by === 1 ? 'Super Admin' : 'Admin'}
                    </p>
                </Col>
                <Col lg={4}>
                    <h5 className='info-label'>Phone</h5>
                    <p className='info-value'>{isLoading ? "----" : companyDetails?.data?.phone_number}</p>
                    <h5 className='info-label'>Registration Date</h5>
                    <p className='info-value'>{isLoading ? "----" : formatDateToMDY(companyDetails?.data?.createdAt)}</p>
                </Col>
                <Col lg={4}>
                    <h5 className='info-label'>Role</h5>
                    <p className='info-value'>{isLoading ? "----" : companyDetails?.data?.role}</p>
                    <h5 className='info-label'>Last Updated</h5>
                    <p className='info-value'>{isLoading ? "----" : formatDateToMDY(companyDetails?.data?.updatedAt)}</p>
                </Col>
            </Row>
        </>
    );
};


export default CustomerDetails