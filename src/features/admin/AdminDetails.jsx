import React from 'react'
import Breadcrumb from '../../components/shared/breadcrumb/Breadcrumb';
import { Row, Col } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import { useParams } from 'react-router';
import { useGetAdminDetailQuery } from '../../app/adminApi/adminApi';
import { formatDateToMDY } from '../../helpers/Utils';
const AdminDetails = () => {
    const breadcrumbItems = [
        { name: 'Admin', path: '/admin' },
        { name: 'Admin Details' },
    ];
    const { id } = useParams()
  
    const { data } = useGetAdminDetailQuery({ id })
    return (
        <>
            <Breadcrumb
                items={breadcrumbItems}
                title={data?.data?.username.charAt(0).toUpperCase() + data?.data?.username.slice(1)}
            />
            <Form.Check
                className='d-flex flex-column-reverse justify-content-start p-0 custom_switch'
                type="switch"
                id="custom-switch"
                label="Active"

                onChange={() => { }}
            />

            <Row className='mt-5'>
                <Col lg={4}>
                    <h5 className='info-label'>E-mail</h5>
                    <p className='info-value'> {data?.data?.email}</p>
                    <h5 className='info-label'>Created By</h5>
                    <p className='info-value'> {data?.data?.created_by_name}</p>
                </Col>
                <Col lg={4}>
                    <h5 className='info-label'>Phone</h5>
                    <p className='info-value'>{data?.data?.phone_number}</p>
                    <h5 className='info-label'>Registration Date</h5>
                    <p className='info-value'> {formatDateToMDY(data?.data?.createdAt)}</p>
                </Col>
                <Col lg={4}>
                    <h5 className='info-label'>Role</h5>
                    <p className='info-value'> {(data?.data?.role)}</p>
                    <h5 className='info-label'>Last Updated</h5>
                    <p className='info-value'> {formatDateToMDY(data?.data?.updatedAt)}</p>
                </Col>
            </Row>
        </>
    )
}

export default AdminDetails