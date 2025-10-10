import React, { useState } from "react";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import Button from "../../../components/shared/buttons/button";
import { Row, Col } from "react-bootstrap";
import { validateRequiredFields } from "../../../helpers/Utils";
import toast from "react-hot-toast";
import InputWithLabel from "../../../components/shared/fields/InputWithLabel";

const libraries = ["places"];

const SaveAddress = ({ addressType, formData, setFormData, saveDeliveryAddress }) => {
  const prefix = addressType;
  const [resetKey, setResetKey] = useState(0);
  const [autocompleteRef, setAutocompleteRef] = useState(null);
 

  const handlePlaceChanged = () => {
    if (!autocompleteRef) return;

    const place = autocompleteRef.getPlace();
    if (!place?.geometry) {
      toast.error("Could not get location details from Google");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [`${prefix}_location`]: place.formatted_address,
      [`${prefix}_latitude`]: place.geometry.location.lat(),
      [`${prefix}_longitude`]: place.geometry.location.lng(),
      [`${prefix}_business_name`]:place.name
    }));
  };

  const handleSave = async () => {
    debugger;
    const requiredFields = [
      { value: formData[`${prefix}_location`], label: `${addressType} location` }
    ];
    const error = validateRequiredFields(requiredFields);
    if (error) {
      toast.error(error);
      return;
    }

    try {
      const otherPrefix = prefix === "pickup" ? "dropoff" : "pickup";
      await saveDeliveryAddress({
        data: {
          address: formData[`${prefix}_location`],
          [`${prefix}_latitude`]: formData[`${prefix}_latitude`],
          [`${prefix}_longitude`]: formData[`${prefix}_longitude`],
          type: addressType,
           [`${otherPrefix}_latitude`]: formData[`${otherPrefix}_latitude`] || null,
           [`${otherPrefix}_longitude`]: formData[`${otherPrefix}_longitude`] || null,
           business_name: formData[`${prefix}_business_name`] || null
        },
        
      }).unwrap();
      // setFormData((prev) => ({
      //   ...prev,
      //   [`${prefix}_location`]: "",
      //   [`${prefix}_latitude`]: "",
      //   [`${prefix}_longitude`]: "",
      // }));
      //setResetKey((prev) => prev + 1);
    } catch (err) {
    }
  };

  return (
    <>
 
      <label className="form-label">Address</label>
      <Autocomplete
        key={resetKey}
        onLoad={setAutocompleteRef}
        onPlaceChanged={handlePlaceChanged}
      >
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Search address"
        />
      </Autocomplete>

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
