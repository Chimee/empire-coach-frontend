
import Breadcrumb from '../../components/shared/breadcrumb/Breadcrumb';
import { Col, Form, Row } from 'react-bootstrap';
import { useParams } from 'react-router';
import { formatDateToMDY } from '../../helpers/Utils';
import { useGetCustomerDetailQuery } from '../../app/customerApi/customerApi';
const CustomerDetails = () => {
    const { id } = useParams()
    const { data: companyDetails, isLoading } = useGetCustomerDetailQuery({ id })
   

  
    const breadcrumbItems = [
        { name: 'Company', path: '/company' },
        { name: 'Company Details' },
    ];
  


    return (
        <>
            <div className='d-flex justify-content-between gap-3'>
                <div className='d-flex justify-content-between gap-3 align-items-center w-100'><div>
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

                        onChange={() => { }}
                    />
                </div>
               
            </div>
            <Row className='mt-5'>
                <Col lg={4}>
                    <h5 className='info-label'>E-mail</h5>
                    <p className='info-value'> {isLoading ? "----" : companyDetails?.data?.email}</p>
                    <h5 className='info-label'>Created By</h5>
                    <p className='info-value'> {isLoading ? "----" : companyDetails?.data?.created_by === 1 ? 'Super Admin' : 'Admin'}</p>
                </Col>
                <Col lg={4}>
                    <h5 className='info-label'>Phone</h5>
                    <p className='info-value'> {isLoading ? "----" : companyDetails?.data?.phone_number}</p>
                    <h5 className='info-label'>Registration Date</h5>
                    <p className='info-value'> {isLoading ? "----" : formatDateToMDY(companyDetails?.data?.createdAt)}</p>
                </Col>
                <Col lg={4}>
                    <h5 className='info-label'>Role</h5>
                    <p className='info-value'> {isLoading ? "----" : companyDetails?.data?.role}</p>
                    <h5 className='info-label'>Last Updated</h5>
                    <p className='info-value'> {isLoading ? "----" : formatDateToMDY(companyDetails?.data?.updatedAt)}</p>
                </Col>
            </Row>
           
        </>
    )
}

export default CustomerDetails