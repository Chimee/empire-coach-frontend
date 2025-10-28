import React, { useState, useEffect } from 'react';
import InputWithLabel from '../../components/shared/fields/InputWithLabel';
import { AddSvg } from '../../svgFiles/AddSvg';
import { Col, Row } from 'react-bootstrap';
import Button from '../../components/shared/buttons/button';
import Breadcrumb from '../../components/shared/breadcrumb/Breadcrumb';
import { CameraSvg } from '../../svgFiles/CameraSvg';
import { useAddDriverMutation, useUpdateDriverMutation, useGetDriverDetailQuery } from '../../app/driverApi/driverApi';
import { useLocation } from 'react-router';
import toast from 'react-hot-toast';
import './driver.css';
import Image from 'react-bootstrap/Image';
import { useNavigate } from 'react-router';
import PhoneInput from 'react-phone-input-2';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
const AddDriver = () => {
  const navigate = useNavigate()
  const { state } = useLocation();
  const isEditMode = state?.mode === 'edit';
  const driverId = state?.driverId;

  const { data, isFetching } = useGetDriverDetailQuery({ id: driverId }, { skip: !isEditMode, refetchOnMountOrArgChange: true, });


  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    note: '',
  });


  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [addDriver, { isLoading }] = useAddDriverMutation();
  const [updateDriver, { isLoading: updating }] = useUpdateDriverMutation();

  useEffect(() => {
    if (data?.data && isEditMode) {
      const { name, email, phone, note, profile_picture } = data.data;
      setUserData({
        name: name || '',
        email: email || '',
        phone: phone || '',
        note: note || '',
      });
      if (profile_picture) {
        setImagePreview(profile_picture);
      }
    }
  }, [data, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;
    if (name === "name") {
      updatedValue = value.charAt(0).toUpperCase() + value.slice(1);
    }
    setUserData((prev) => ({ ...prev, [name]: updatedValue }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && !file.type.startsWith('image/')) {
      toast.error('Only image files are allowed.');
      return;
    }
    setProfileImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    const { name, email, phone, note } = userData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name.trim()) return toast.error('User name is required.');
    if (!email.trim()) return toast.error('Email is required.');
    if (!emailRegex.test(email)) return toast.error('Invalid email format.');
    if (!phone.trim()) return toast.error('Phone number is required.');
    // const formattedPhone = phone.startsWith("+")
    //   ? phone
    //   : `+${phone}`;

    // let parsedPhone =
    //   parsePhoneNumberFromString(formattedPhone)
    // if (!parsedPhone.country) {
    //   parsedPhone = parsePhoneNumberFromString(formattedPhone, 'US');
    // }

    // if (!parsedPhone || !parsedPhone.isValid()) {
    //   toast.dismiss();
    //   toast.error("Invalid phone number. Please check the country code and format.");
    //   return;
    // }


    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('note', note);

    if (profileImage) {
      formData.append('profile_picture', profileImage);
    } else if (!isEditMode) {
      formData.append(
        'profile_picture',
        'https://windingroad.com/wp-content/uploads/autos_db/thumbnails/DJ1.jpg'
      );
    }

    if (isEditMode) formData.append('driverId', driverId);

    try {
      if (isEditMode) {
        await updateDriver(formData).unwrap();
        navigate('/drivers');
      } else {
        await addDriver(formData).unwrap();
        setUserData({ name: '', email: '', phone: '', note: '' });
        setProfileImage(null);
        setImagePreview(null);
        navigate('/drivers');
      }
    } catch (err) {
      toast.error(err?.data?.message || 'Operation failed.');
    }
  };

  const breadcrumbItems = [
    { name: 'Drivers', path: '/drivers' },
    { name: isEditMode ? 'Edit Driver' : 'Add Driver' },
  ];

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <div className='form-frame'>
        <div className='AddForm mt-5'>
          <h2 className='d-flex gap-2 align-items-center'>
            <AddSvg /> {isEditMode ? 'Edit Driver' : 'Add Driver'}
          </h2>
          <div className='form-card mt-4'>
            <label className='input-label form-label'>Profile Picture</label>
            <div className='addProfile d-flex justify-content-center align-items-center mb-3'>
              <input accept='image/*' type='file' onChange={handleFileChange} />
              {imagePreview ? (
                <Image src={imagePreview} alt={imagePreview} width={100} height={100} />
              ) : (
                <CameraSvg />
              )}
            </div>

            <InputWithLabel
              label='User Name'
              placeholder='Michael Smith'
              type='text'
              name='name'
              value={userData.name}
              onChange={handleChange}
            />

            <Row>
              <Col lg={6}>
                <InputWithLabel
                  label='E-mail'
                  placeholder='E-mail'
                  type='text'
                  name='email'
                  value={userData.email}
                  onChange={handleChange}
                  readOnly={isEditMode}
                />
              </Col>
              <Col lg={6}>
                <label className='input-label form-label'>Phone</label>
                <PhoneInput
                  country={'us'}
                  value={userData.phone}
                  onChange={(value) =>
                    setUserData((prev) => ({
                      ...prev,
                      phone: value,
                    }))
                  }
                  inputClass='form-control'
                  containerClass='w-100'
                />
              </Col>
              <Col xs={12}>
                <label className='input-label form-label'>For Admin/internal use (Optional)</label>
                <textarea
                  className='form-control'
                  name='note'
                  value={userData.note}
                  onChange={handleChange}
                ></textarea>
              </Col>
            </Row>
          </div>
        </div>
        <div className='d-flex gap-3 justify-content-end mt-4'>
          <Button
            label={isLoading || updating ? 'Please wait...' : isEditMode ? 'Update' : 'Add'}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </>
  );
};

export default AddDriver;
