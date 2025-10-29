import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../components/shared/breadcrumb/Breadcrumb';
import InputWithLabel from '../../components/shared/fields/InputWithLabel';
import { AddSvg } from '../../svgFiles/AddSvg';
import { Row, Col } from 'react-bootstrap';
import Button from '../../components/shared/buttons/button';
import PhoneInput from 'react-phone-input-2';
import { useUpdateCompanyMutation, useGetCompanyDetailQuery } from '../../app/companyApi/companyApi';
import { useLocation } from 'react-router';
import toast from 'react-hot-toast';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

const EditCompany = () => {
  const breadcrumbItems = [
    { name: 'Company', path: '/company' },
    { name: 'Edit Company' },
  ];

  const { state } = useLocation();
  const companyId = state?.companyId;

  const { data, isLoading: isFetching } = useGetCompanyDetailQuery({ id: companyId });


  const [updateCompany, { isLoading }] = useUpdateCompanyMutation();

  const [companyData, setCompanyData] = useState({
    company_name: '',
    address: '',
    contact_person_name: '',
    contact_person_phone: '',
    email: '',
  });

  // Populate form once data is fetched
  useEffect(() => {
    if (data) {
      setCompanyData({
        company_name: data?.data?.name || '',
        address: data?.data?.address || '',
        contact_person_name: data?.data?.contact_person_name || '',
        contact_person_phone: data?.data?.contact_person_phone || '',
        raw_phone: data?.data?.raw_phone || '',
        email: data?.data?.email || '',
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;
    if (name === "company_name") {
      updatedValue = value.charAt(0).toUpperCase() + value.slice(1);
    }

    setCompanyData((prev) => ({
      ...prev,
      [name]: updatedValue,

    }));
  };

  const handlePhoneChange = (value) => {
    setCompanyData((prev) => ({
      ...prev,
      contact_person_phone: value,
    }));
  };

  const handleSubmit = async () => {
    const { company_name, address, contact_person_name, contact_person_phone } = companyData;

    if (!company_name.trim()) return toast.error('Company name is required.');
    if (!address.trim()) return toast.error('Billing address is required.');
    if (!contact_person_name.trim()) return toast.error('POC name is required.');
    if (!contact_person_phone.trim()) return toast.error('POC phone is required.');
    let formattedPhone = contact_person_phone;
    try {
      const parsed = parsePhoneNumberFromString(`+${contact_person_phone}`);
      if (parsed) {
        formattedPhone = `+${parsed.countryCallingCode} ${parsed.formatNational()}`;
      }
    } catch (error) {
      console.warn('Invalid phone number format:', error);
    }

    try {
      const payload = {
        companyId,
        company_name,
        address,
        contact_person_name,
        contact_person_phone,
        raw_phone:formattedPhone,
        
      };
      await updateCompany({ data: payload }).unwrap();
      toast.success('Company updated successfully!');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to update company.');
    }
  };

  return (
    <>
      <Breadcrumb
        items={breadcrumbItems}
        title="Company"
        description="Overview of all transport operations"
      />
      <div className='form-frame'>
        <div className='AddForm mt-5'>
          <h2 className='d-flex gap-2 align-items-center'><AddSvg /> Edit Company</h2>
          <div className='form-card mt-4'>
            <InputWithLabel
              label="Company Name"
              placeholder="Acme Logistics"
              type="text"
              name="company_name"
              value={companyData.company_name}
              onChange={handleChange}
            />
            <InputWithLabel
              label="Billing Address"
              placeholder="123 Business Ave, Suite 100, San Francisco, CA 94107"
              type="text"
              name="address"
              value={companyData.address}
              onChange={handleChange}
            />
            <Row>
              <Col lg={6}>
                <InputWithLabel
                  label="Default POC Name"
                  placeholder="Sarah Johnson"
                  type="text"
                  name="contact_person_name"
                  value={companyData.contact_person_name}
                  onChange={handleChange}
                />
              </Col>
              <Col lg={6}>
                <label className="input-label form-label">Default POC Phone</label>
                <PhoneInput
                  country={'us'}
                  inputClass="form-control"
                  containerClass="w-100"
                  value={companyData.contact_person_phone}
                  onChange={handlePhoneChange}
                />
              </Col>
            </Row>
            <InputWithLabel
              label="Default E-mail"
              placeholder="Sarah@acmelogistics.com"
              type="email"
              name="email"
              value={companyData.email}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className='d-flex gap-3 justify-content-end mt-4'>
          <Button
            label={isLoading ? 'Please wait...' : 'Edit'}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </>
  );
};

export default EditCompany;
