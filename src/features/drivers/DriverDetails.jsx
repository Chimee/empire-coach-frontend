import React,{useEffect,useState} from 'react'
import Breadcrumb from '../../components/shared/breadcrumb/Breadcrumb';
import { Row, Col } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import { useParams } from 'react-router';
import { useGetDriverDetailQuery ,useUpdateDriverMutation } from '../../app/driverApi/driverApi';
import { formatDateToMDY } from '../../helpers/Utils';
import Image from 'react-bootstrap/Image';
const DriverDetails = () => {
    const {id} = useParams()
    const {data:driverDetails, isLoading} = useGetDriverDetailQuery({id});
    const[updateDriverStatus ,{isLoading:isUpdating}] = useUpdateDriverMutation()
    console.log(driverDetails,"driverDetails");
    const[isActive,setIsActive] = useState(false);

    useEffect(() => {
    if (driverDetails?.data?.active_status) {
      setIsActive(driverDetails.data.active_status === 'active');
    }
  }, [driverDetails]);
    
    const breadcrumbItems = [
        { name: 'Drivers', path: '/drivers' },
        { name: 'Driver Details' },
    ];

    const handleStatusToggle = async () => {
    const newStatus = isActive ? 'inactive' : 'active';
    setIsActive(!isActive);

    const formData = new FormData();
    formData.append('driverId', id);
    formData.append('active_status', newStatus);
          
    try {
      await updateDriverStatus(formData).unwrap();
    } catch (err) {
      setIsActive(isActive);
      console.error(err);
    }
  };

    
    return (
        <>
            <Breadcrumb
                items={breadcrumbItems}
            />
           <div className='d-flex justify-content-between align-items-center mb-3 mt-3'>
             <div className='d-flex gap-3 align-items-center'>
                <div className='addProfile d-flex justify-content-center align-items-center '>
                    <Image src={ driverDetails?.data?.profile_picture} alt="driver image" className='object-fit-cover' width={100} height={100} />
                </div>
                <h2 className='mb-0'>Craig Ekstrom Bothman</h2>
            </div>
            <Form.Check
               className='d-flex flex-column-reverse justify-content-start p-0 custom_switch'
                type="switch"
               id="custom-switch"
              label={isActive ? 'Active' : 'Inactive'}
               checked={isActive}
                onChange={handleStatusToggle}
                disabled={isUpdating}
           />
           </div>

            <Row className='mt-5'>
                <Col lg={4}>
                    <h5 className='info-label'>E-mail</h5>
                    <p className='info-value'> {isLoading ? "-----" : driverDetails?.data?.email}</p>
                    <h5 className='info-label'>Created By</h5>
                    <p className='info-value'> {isLoading ? "-----" : driverDetails?.data?.referred_by}</p>
                </Col>
                <Col lg={4}>
                    <h5 className='info-label'>Phone</h5>
                    <p className='info-value'>{isLoading ? "-----" : driverDetails?.data?.phone}</p>
                    <h5 className='info-label'>Registration Date</h5>
                    <p className='info-value'> {isLoading ? "-----" : formatDateToMDY(driverDetails?.data?.createdAt)}</p>
                </Col>
                <Col lg={4}>
                    <h5 className='info-label opacity-0'>Role</h5>
                    <p className='info-value opacity-0'> Admin</p>
                    <h5 className='info-label'>Last Updated</h5>
                    <p className='info-value'>{isLoading ? "-----" : formatDateToMDY(driverDetails?.data?.updatedAt)}</p>
                </Col>
                <Col lg={12}>
                <Row>
                    <Col lg={6}>
                    <h5 className='info-label'>Note</h5>
                    <p className='note'>{isLoading ? "-----" : driverDetails?.data?.note}</p>
                    </Col>
                </Row>
                </Col>
            </Row>
        </>
    )
}

export default DriverDetails