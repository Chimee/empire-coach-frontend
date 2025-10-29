import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../components/shared/breadcrumb/Breadcrumb';
import { AddSvg } from '../../svgFiles/AddSvg';
import InputWithLabel from '../../components/shared/fields/InputWithLabel';
import { Row, Col } from 'react-bootstrap';
import Button from '../../components/shared/buttons/button';
import PhoneInput from 'react-phone-input-2';
import { useAddAdminMutation, useGetAdminDetailQuery, useUpdateAdminMutation } from '../../app/adminApi/adminApi';
import { useLocation } from 'react-router';
import toast from 'react-hot-toast';
import { dmApi } from '../../app/dmApi';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { parsePhoneNumberFromString } from "libphonenumber-js/max";
const AddAdmin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const isEditMode = state?.mode === 'edit';
  const adminId = state?.adminId;

  const { data } = useGetAdminDetailQuery(
    { id: adminId },
    { skip: !isEditMode, refetchOnMountOrArgChange: true, }
  );

  const [adminData, setAdminData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone_number: '',
  });


  useEffect(() => {
    if (data?.data) {
      const fullName = data.data.username || '';
      const [firstName, ...lastParts] = fullName.split(' ');
      setAdminData({
        firstName: firstName || '',
        lastName: lastParts.join(' ') || '',
        email: data.data.email || '',
        phone_number: data.data.phone_number || '',
      });
    }
  }, [data]);

  const [addAdmin, { isLoading: adding }] = useAddAdminMutation();
  const [updateAdmin, { isLoading: updating }] = useUpdateAdminMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;
    if (name === "firstName") {
      updatedValue = value.charAt(0).toUpperCase() + value.slice(1);
    }

    setAdminData((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));
  };

  const handleSubmit = async () => {
    const { firstName, lastName, email, phone_number } = adminData;
    const username = `${firstName} ${lastName}`.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    toast.dismiss();
    if (!firstName.trim()) return toast.error('First name is required.');
    if (!email.trim()) return toast.error('Email is required.');
    if (!emailRegex.test(email)) return toast.error('Invalid email format.');
    if (!phone_number.trim()) return toast.error('Phone number is required.');

    let formattedPhone = phone_number;
    try {
      const parsed = parsePhoneNumberFromString(`+${phone_number}`);
      if (parsed) {
        formattedPhone = `+${parsed.countryCallingCode} ${parsed.formatNational()}`;

      }
    } catch (error) {
      console.warn("Invalid phone number format:", error);
    }


    try {
      if (isEditMode) {
        await updateAdmin({ data: { username, email, phone_number, id: adminId ,raw_phone: formattedPhone } }).unwrap();
        navigate('/admin');
      } else {
        await addAdmin({ data: { username, email, phone_number , raw_phone: formattedPhone } }).unwrap();
        dispatch(dmApi.util.invalidateTags(['getAdminListAPI']));
        setAdminData({ firstName: '', lastName: '', email: '', phone_number: '' });
        navigate('/admin');
      }
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to save admin.');
    }
  };

  const breadcrumbItems = [
    { name: 'Admin', path: '/admin' },
    { name: isEditMode ? 'Edit Admin' : 'Add Admin' },
  ];

  return (
    <>
      <Breadcrumb
        items={breadcrumbItems}
        title={'Admin'}
        description={'Overview of all transport operations'}
      />
      <div className='form-frame'>
        <div className='AddForm mt-5'>
          <h2 className='d-flex gap-2 align-items-center'>
            <AddSvg /> {isEditMode ? 'Edit Admin' : 'Add Admin'}
          </h2>
          <div className='form-card mt-4'>
            <Row>
              <Col lg={6}>
                <InputWithLabel
                  label='First Name'
                  placeholder='Acme'
                  type='text'
                  name='firstName'
                  value={adminData.firstName}
                  onChange={handleChange}
                />
              </Col>
              <Col lg={6}>
                <InputWithLabel
                  label='Last Name'
                  placeholder={isEditMode ? '' : 'Smith'}
                  type='text'
                  name='lastName'
                  value={adminData.lastName}
                  onChange={handleChange}
                />
              </Col>
            </Row>
            <Row>
              <Col lg={6}>
                <InputWithLabel
                  label='E-mail'
                  placeholder='john@admin.com'
                  type='email'
                  name='email'
                  value={adminData.email}
                  onChange={handleChange}
                  readOnly={isEditMode}
                />
              </Col>
              <Col lg={6}>
                <label className='input-label form-label'>Phone</label>
                <PhoneInput
                  country={'us'}
                  value={adminData.phone_number}
                  onChange={(value) =>
                    setAdminData((prev) => ({
                      ...prev,
                      phone_number: value,
                    }))
                  }
                  inputClass='form-control'
                  containerClass='w-100'
                />
              </Col>
            </Row>
          </div>
        </div>
        <div className='d-flex gap-3 justify-content-end mt-4'>
          <Button
            label={adding || updating ? 'Please wait...' : isEditMode ? 'Update' : 'Add'}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </>
  );
};

export default AddAdmin;
