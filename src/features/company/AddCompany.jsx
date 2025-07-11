import React, { useState } from 'react';
import Breadcrumb from '../../components/shared/breadcrumb/Breadcrumb';
import InputWithLabel from '../../components/shared/fields/InputWithLabel';
import { AddSvg } from '../../svgFiles/AddSvg';
import { Row, Col } from 'react-bootstrap';
import Button from '../../components/shared/buttons/button';
import { useAddCompanyMutation } from '../../app/companyApi/companyApi';
import toast from 'react-hot-toast';
import PhoneInput from 'react-phone-input-2';
import { validateRequiredFields } from '../../helpers/Utils';
const AddCompany = () => {
  const [companyData, setCompanyData] = useState({
    company_name: "",
    address: "",
    contact_person_name: "",
    contact_person_phone: "",
    email: ""
  });

  const [addCompany, { isLoading }] = useAddCompanyMutation();

  const breadcrumbItems = [
    { name: 'Company', path: '/company' },
    { name: 'Add Company' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const {
      company_name,
      address,
      contact_person_name,
      contact_person_phone,
      email,
    } = companyData;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const requiredFields = [
      { value: company_name, label: "Company Name" },
      { value: address, label: "Billing Address" },
      { value: contact_person_name, label: "Default POC Name" },
      { value: contact_person_phone, label: "Default POC Phone" },
      { value: email, label: "Default E-mail" },
    ];

    const requiredError = validateRequiredFields(requiredFields);
    if (requiredError) {
      toast.dismiss();
      toast.error(requiredError);
      return;
    }

    if (!emailRegex.test(email)) {
      toast.dismiss();
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      await addCompany({ data: companyData }).unwrap();
      setCompanyData({
        company_name: "",
        address: "",
        contact_person_name: "",
        contact_person_phone: "",
        email: ""
      });
    } catch (err) {
      toast.dismiss();
      toast.error(err?.data?.message || "Failed to add company.");
    }
  };

  return (
    <>
      <Breadcrumb
        items={breadcrumbItems}
        title={'Company'}
        description={'Overview of all transport operations'}
      />
      <div className='form-frame'>
        <div className='AddForm mt-5'>
          <h2 className='d-flex gap-2 align-items-center'><AddSvg /> Add Company</h2>
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
                  value={companyData.contact_person_phone}
                  onChange={(value) =>
                    setCompanyData((prev) => ({
                      ...prev,
                      contact_person_phone: value,
                    }))
                  }
                  inputClass="form-control"
                  containerClass="w-100"
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
            label={isLoading ? "Please wait..." : "Add"}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </>
  );
};

export default AddCompany;
