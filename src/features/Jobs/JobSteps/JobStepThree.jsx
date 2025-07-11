import React, { useState } from "react";
import Button from "../../../components/shared/buttons/button";
import { Row, Col } from "react-bootstrap";
import InputWithLabel from "../../../components/shared/fields/InputWithLabel";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import SavedAddress from "./SavedAddress";
import TextAreaWithLabel from "../../../components/shared/fields/TextAreaWithLabel";
import { validateRequiredFields } from "../../../helpers/Utils";
import toast from "react-hot-toast";
import { useSaveDeliveryAddressMutation } from "../../../app/customerApi/customerApi";
import SaveAddress from "./SaveAddress";
import PhoneInput from "react-phone-input-2";

const JobStepThree = ({ handleNext, handlePrevious, formData, setFormData }) => {
  const SelectOptions = [{ label: "Punjab", value: "punjab" }];
  const [saveDeliveryAddress] = useSaveDeliveryAddressMutation();

  // state to force SaveAddress re-render on tab change
  const [resetKeys, setResetKeys] = useState({
    pickup: 0,
    dropoff: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const clearAddressFields = (prefix) => {
    const keys = ["business_name", "latitude", "longitude", "location"];
    setFormData((prev) => {
      const updated = { ...prev };
      keys.forEach((key) => {
        delete updated[`${prefix}_${key}`];
      });
      return updated;
    });
    // bump the reset key to force SaveAddress remount
    setResetKeys((prev) => ({
      ...prev,
      [prefix]: prev[prefix] + 1,
    }));
  };

  const validateStepThree = () => {
    const fields = [
      { value: formData.pickup_location, label: "Pickup location" },
      { value: formData.pickup_POC_name, label: "POC Name for Pickup" },
      { value: formData.pickup_POC_phone, label: "POC Phone for Pickup" },
      { value: formData.pickup_additional_note, label: "Pickup Note" },

      { value: formData.dropoff_location, label: "Dropoff location" },
      { value: formData.dropoff_POC_name, label: "POC Name for Dropoff" },
      { value: formData.dropoff_POC_phone, label: "POC Phone for Dropoff" },
      { value: formData.dropoff_additional_note, label: "Dropoff Note" },
    ];
    const error = validateRequiredFields(fields);
    if (error) {
      toast.dismiss();
      toast.error(error);
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStepThree()) handleNext();
  };

  const renderAddressTab = (prefix) => (
    <div className="address">
      <h5>{prefix === "pickup" ? "Pickup" : "Dropoff"} Location</h5>
      <Tabs
        defaultActiveKey="newLocation"
        id={`${prefix}-tab`}
        className="mb-3 location_tabs"
        onSelect={(key) => {
          if (key === "newLocation") clearAddressFields(prefix);
        }}
      >
        <Tab eventKey="savedLocation" title="Saved Location">
          <SavedAddress
            addressType={prefix}
            onSelectAddress={(type, address, businessName) => {
              setFormData((prev) => ({
                ...prev,
                [`${type}_location`]: address,
                ...(businessName && { [`${type}_business_name`]: businessName }),
              }));
            }}
          />
        </Tab>
        <Tab eventKey="newLocation" title="New Location">
          <SaveAddress
            key={resetKeys[prefix]} // this is the crucial bit
            addressType={prefix}
            formData={formData}
            setFormData={setFormData}
            saveDeliveryAddress={saveDeliveryAddress}
            selectOptions={SelectOptions}
          />
          <Button
            label="Use for this trip only"
            className="rounded-2 w-100 bordered"
            size="xs"
          />
        </Tab>
      </Tabs>
      <div className="divider_cmn"></div>

      <InputWithLabel
        label="POC Name"
        placeholder="Enter name here"
        name={`${prefix}_POC_name`}
        value={formData[`${prefix}_POC_name`] || ""}
        onChange={handleChange}
      />

      <label className="cmn_label form-label">POC Phone</label>
      <PhoneInput
        country="us"
        value={formData[`${prefix}_POC_phone`] || ""}
        onChange={(value) =>
          setFormData((prev) => ({
            ...prev,
            [`${prefix}_POC_phone`]: value,
          }))
        }
        inputClass="form-control w-100"
        containerClass="w-100 mb-3"
      />

      <TextAreaWithLabel
        label="Add Note"
        placeholder="Add Note"
        name={`${prefix}_additional_note`}
        value={formData[`${prefix}_additional_note`] || ""}
        onChange={handleChange}
      />
    </div>
  );

  return (
    <div>
      <h5 className="step_heading mb-0">What’s your Timing priority</h5>
      <Row>
        <Col lg={6}>{renderAddressTab("pickup")}</Col>
        <Col lg={6}>{renderAddressTab("dropoff")}</Col>
      </Row>
      <div className="d-flex justify-content-between mt-3">
        <Button
          label="Previous"
          className="rounded-2 bordered"
          size="small"
          onClick={handlePrevious}
        />
        <Button
          label="Next"
          className="rounded-2"
          size="small"
          onClick={handleNextStep}
        />
      </div>
    </div>
  );
};

export default JobStepThree;
