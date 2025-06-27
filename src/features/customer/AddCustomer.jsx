import React, { useState, useEffect } from 'react';
import InputWithLabel from '../../components/shared/fields/InputWithLabel';
import { AddSvg } from '../../svgFiles/AddSvg';
import { Col, Row } from 'react-bootstrap';
import Button from '../../components/shared/buttons/button';
import Breadcrumb from '../../components/shared/breadcrumb/Breadcrumb';
import PhoneInput from 'react-phone-input-2';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router';
import {
  useAddCustomerMutation,
  useUpdateCustomerMutation,
  useGetCustomerDetailQuery,
} from '../../app/customerApi/customerApi';

const AddCustomer = () => {
  const { state } = useLocation();
  const isEditMode = state?.mode === 'edit';
  const companyId = state?.companyId;
  const customerId = state?.customerId;

  const { data } = useGetCustomerDetailQuery(
    { id: customerId },
    { skip: !isEditMode, refetchOnMountOrArgChange: true }
  );

  const [userData, setUserData] = useState({
    username: '',
    phone_number: '',
    email: '',
    role: '',
  });

  useEffect(() => {
    if (data?.data && isEditMode) {
      setUserData({
        username: data.data.username || '',
        phone_number: data.data.phone_number || '',
        email: data.data.email || '',
        role: data.data.role || '',
      });
    }
  }, [data, isEditMode]);

  const [addCustomer, { isLoading }] = useAddCustomerMutation();
  const [updateCustomer, { isLoading: isUpdating }] = useUpdateCustomerMutation();

  const breadcrumbItems = [
    { name: 'Company', path: '/company' },
    { name: isEditMode ? 'Edit User' : 'Add User' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const { username, phone_number, email, role } = userData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!username.trim()) return toast.error('Username is required.');
    if (!phone_number.trim()) return toast.error('Phone number is required.');
    if (!email.trim()) return toast.error('Email is required.');
    if (!emailRegex.test(email)) return toast.error('Invalid email format.');
    if (!role.trim()) return toast.error('Role is required.');
    if (!companyId && !isEditMode) return toast.error('Company ID not found.');

    try {
      if (isEditMode) {
        await updateCustomer({ data: { ...userData, customerId: customerId } }).unwrap();
       
      } else {
        await addCustomer({ data: { ...userData, companyId } }).unwrap();
        setUserData({
          username: '',
          phone_number: '',
          email: '',
          role: '',
        });
      }

    } catch (error) {
      toast.error(error?.data?.message || 'Operation failed.');
    }
  };

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <div className='form-frame'>
        <div className='AddForm mt-5'>
          <h2 className='d-flex gap-2 align-items-center'>
            <AddSvg /> {isEditMode ? 'Edit User' : 'Add User'}
          </h2>
          <div className='form-card mt-4'>
            <Row>
              <Col lg={6}>
                <InputWithLabel
                  label='User Name'
                  placeholder='Michael Smith'
                  type='text'
                  name='username'
                  value={userData.username}
                  onChange={handleChange}
                />
              </Col>
              <Col lg={6}>
                <label className='input-label form-label'>Phone</label>
                <PhoneInput
                  country={'us'}
                  value={userData.phone_number}
                  onChange={(value) =>
                    setUserData((prev) => ({
                      ...prev,
                      phone_number: value,
                    }))
                  }
                  inputClass='form-control'
                  containerClass='w-100'
                />
              </Col>
            </Row>
            <InputWithLabel
              label='E-mail'
              placeholder='E-mail'
              type='email'
              name='email'
              value={userData.email}
              onChange={handleChange}
              readOnly={isEditMode}
            />
            <InputWithLabel
              label='Role'
              placeholder='Admin'
              type='text'
              name='role'
              value={userData.role}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className='d-flex gap-3 justify-content-end mt-4'>
          <Button
            label={isEditMode ? (isUpdating ? 'Updating...' : 'Update') : isLoading ? 'Please wait...' : 'Add'}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </>
  );
};

export default AddCustomer;
