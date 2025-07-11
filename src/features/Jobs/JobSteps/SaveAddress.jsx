import React, { useState } from "react";
import Button from "../../../components/shared/buttons/button";
import { Row, Col } from "react-bootstrap";
import { validateRequiredFields } from "../../../helpers/Utils";
import toast from "react-hot-toast";
import Autocomplete from "react-google-autocomplete";

const SaveAddress = ({ addressType, formData, setFormData, saveDeliveryAddress }) => {
  const prefix = addressType;
  const [resetKey, setResetKey] = useState(0);

  const handleAddressSelect = (place) => {
    if (!place?.geometry) {
      toast.error("Could not get location details from Google");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [`${prefix}_location`]: place.formatted_address,
      [`${prefix}_latitude`]: place.geometry.location.lat(),
      [`${prefix}_longitude`]: place.geometry.location.lng(),
    }));
  };

  const handleSave = async () => {
    const requiredFields = [
      { value: formData[`${prefix}_location`], label: `${addressType} location` }
    ];
    const error = validateRequiredFields(requiredFields);
    if (error) {
      toast.error(error);
      return;
    }
    try {
      await saveDeliveryAddress({
        data: {
          [`${prefix}_location`]: formData[`${prefix}_location`],
          [`${prefix}_latitude`]: formData[`${prefix}_latitude`],
          [`${prefix}_longitude`]: formData[`${prefix}_longitude`],
          type: addressType,
        },
      }).unwrap();
      toast.success(`${addressType} address saved successfully`);
      setFormData((prev) => ({
        ...prev,
        [`${prefix}_location`]: "",
        [`${prefix}_latitude`]: "",
        [`${prefix}_longitude`]: "",
      }));
      setResetKey(prev => prev + 1);  // trigger the reset
    } catch (err) {
      toast.error(err?.data?.message || `Failed to save ${addressType} address.`);
    }
  };

  return (
    <>
      <label className="form-label">Address</label>
      <Autocomplete
        key={resetKey}   // only changes after you explicitly reset
        apiKey={process.env.REACT_APP_GOOGLE_MAP_API_KEY}
        onPlaceSelected={handleAddressSelect}
        options={{
          types: ["geocode"],
          componentRestrictions: { country: "us" },
        }}
        className="form-control mb-3"
        placeholder="Search address"
      />
      <Row>
        <Col>
          <Button
            label="Save"
            className="rounded-2 w-100 mb-3"
            size="xs"
            onClick={handleSave}
          />
        </Col>
      </Row>
    </>
  );
};

export default SaveAddress;
