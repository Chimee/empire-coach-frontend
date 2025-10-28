import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../components/shared/breadcrumb/Breadcrumb';
import { Row, Col, Form } from 'react-bootstrap';
import { useParams } from 'react-router';
import { useGetAdminDetailQuery, useUpdateAdminMutation } from '../../app/adminApi/adminApi';
import { formatDateToMDY, formatPhoneNumber } from '../../helpers/Utils';


const AdminDetails = () => {
    const breadcrumbItems = [
        { name: 'Admin', path: '/admin' },
        { name: 'Admin Details' },
    ];
    const { id } = useParams();
    const { data, isLoading } = useGetAdminDetailQuery({ id });


    const [updateAdmin] = useUpdateAdminMutation();
    const [isActive, setIsActive] = useState(false);


    useEffect(() => {
        if (data?.data?.active_status) {
            setIsActive(data.data.active_status === "active");
        }
    }, [data]);

    const handleToggle = async (e) => {
        const newValue = e.target.checked;
        setIsActive(newValue);
        try {
            await updateAdmin({
                data: { id: data?.data?.id, active_status: newValue ? "active" : "inactive", }
            }).unwrap();
        } catch (err) {
            console.error("Failed to update status", err);
            setIsActive(!newValue);
        }
    }

    return (
        <>
            <Breadcrumb
                items={breadcrumbItems}
                title={data?.data?.username?.charAt(0).toUpperCase() + data?.data?.username?.slice(1)}
            />

            <Form.Check
                className='d-flex flex-column-reverse justify-content-start p-0 custom_switch'
                type="switch"
                id="custom-switch"
                label="Active"
                checked={isActive}
                onChange={handleToggle}
            />

            <Row className='mt-5'>
                <Col lg={4}>
                    <h5 className='info-label'>E-mail</h5>
                    <p className='info-value'>{isLoading ? "----" : data?.data?.email}</p>
                    <h5 className='info-label'>Created By</h5>
                    <p className='info-value'>{isLoading ? "----" : data?.data?.created_by_name}</p>
                </Col>
                <Col lg={4}>
                    <h5 className='info-label'>Phone</h5>
                    <p className='info-value'>{isLoading ? "----" : formatPhoneNumber(data?.data?.phone_number)}</p>
                    <h5 className='info-label'>Registration Date</h5>
                    <p className='info-value'>{isLoading ? "----" : formatDateToMDY(data?.data?.createdAt)}</p>
                </Col>
                <Col lg={4}>
                    <h5 className='info-label'>Role</h5>
                    <p className='info-value'>{isLoading ? "----" : data?.data?.role}</p>
                    <h5 className='info-label'>Last Updated</h5>
                    <p className='info-value'>{isLoading ? "----" : formatDateToMDY(data?.data?.updatedAt)}</p>
                </Col>
            </Row>
        </>
    );
}

export default AdminDetails;
