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
import { parsePhoneNumberFromString } from 'libphonenumber-js';

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
    firstName: '',
    lastName: '',
    phone_number: '',
    email: '',
  });

  useEffect(() => {
    const fullName = data?.data.username || '';
    const [firstName, ...lastParts] = fullName.split(' ');
    if (data?.data && isEditMode) {
      setUserData({
        firstName: firstName || '',
        lastName: lastParts.join(' ') || '',
        email: data.data.email || '',
        phone_number: data.data.phone_number || '',

      });
    }
  }, [data, isEditMode]);

  const [addCustomer, { isLoading }] = useAddCustomerMutation();
  const [updateCustomer, { isLoading: isUpdating }] = useUpdateCustomerMutation();

  const breadcrumbItems = [
    { name: 'Company', path: `/company/company-details/${companyId}` },
    { name: isEditMode ? 'Edit User' : 'Add User' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;
    if (name === "firstName") {
      updatedValue = value.charAt(0).toUpperCase() + value.slice(1);
    }

    setUserData((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));
  };

  const handleSubmit = async () => {
    const { firstName, lastName, phone_number, email } = userData;
    const username = `${firstName} ${lastName}`.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!firstName.trim()) return toast.error('First name is required.');
    if (!phone_number.trim()) return toast.error('Phone number is required.');
    if (!email.trim()) return toast.error('Email is required.');
    if (!emailRegex.test(email)) return toast.error('Invalid email format.');
    if (!companyId && !isEditMode) return toast.error('Company ID not found.');

    // const formattedPhone = phone_number.startsWith("+")
    //   ? phone_number
    //   : `+${phone_number}`;

    // let parsedPhone =
    //   parsePhoneNumberFromString(formattedPhone)
    // if (!parsedPhone.country) {
    //  parsedPhone = parsePhoneNumberFromString(formattedPhone, 'US');
    // }

    // if (!parsedPhone || !parsedPhone.isValid()) {
    //   toast.dismiss();
    //   toast.error("Invalid phone number. Please check the country code and format.");
    //   return;
    // }


    try {
      if (isEditMode) {
        await updateCustomer({
          data: { username, email, phone_number, customerId },
        }).unwrap();
      } else {
        await addCustomer({
          data: { username, email, phone_number, companyId },
        }).unwrap();
        setUserData({
          firstName: '',
          lastName: '',
          phone_number: '',
          email: '',
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
                  label='First Name'
                  placeholder='Michael'
                  type='text'
                  name='firstName'
                  value={userData.firstName}
                  onChange={handleChange}
                />
              </Col>
              <Col lg={6}>
                <InputWithLabel
                  label='Last Name'
                  placeholder={isEditMode ? '' : 'Smith'}
                  type='text'
                  name='lastName'
                  value={userData.lastName}
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
              <Col lg={6}>
                <InputWithLabel
                  label='E-mail'
                  placeholder='E-mail'
                  type='email'
                  name='email'
                  value={userData.email}
                  onChange={handleChange}
                  readOnly={isEditMode}
                />
              </Col>
            </Row>
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
