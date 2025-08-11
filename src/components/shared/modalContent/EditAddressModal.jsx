import React, { useState } from "react";
import CommonModal from "../modalLayout/CommonModal";
import Button from "../buttons/button";
import { Autocomplete } from "@react-google-maps/api";
import { useUpdateDeliveryAddressMutation } from "../../../app/customerApi/customerApi";
import { Row, Col } from "react-bootstrap";
import toast from "react-hot-toast";
import { validateRequiredFields } from "../../../helpers/Utils";

const EditAddressModal = ({ show, handleClose, setShow, addressId, message, type }) => {
  const [autocompleteRef, setAutocompleteRef] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [resetKey, setResetKey] = useState(0);
  const [updateDeliveryAddress] = useUpdateDeliveryAddressMutation();

  const handlePlaceChanged = () => {
    if (!autocompleteRef) return;
    const place = autocompleteRef.getPlace();

    if (!place?.geometry) {
      toast.error("Could not get location details from Google");
      return;
    }

    setSelectedPlace({
      address: place.formatted_address,
      latitude: place.geometry.location.lat(),
      longitude: place.geometry.location.lng(),
    });
  };

  const handleSubmit = async () => {
    
    if (!selectedPlace) {
      toast.error("Please select a location from the autocomplete.");
      return;
    }

    const { address, latitude, longitude } = selectedPlace;

   const requiredFields = [
         { value: selectedPlace.address, label: `${type} location` }
       ];
       const error = validateRequiredFields(requiredFields);

    if (error) {
      toast.error(error);
      return;
    }

    try {
      const otherType = type === "pickup" ? "dropoff" : "pickup";
       const payload= {
          addressId,
          address,
          [`${type}_latitude`]: latitude,
          [`${type}_longitude`]: longitude,
          type,
          [`${otherType}_latitude`]: null,
          [`${otherType}_longitude`]: null,
        }
   

      await updateDeliveryAddress({
        data: {
          addressId,
          address,
          [`${type}_latitude`]: latitude,
          [`${type}_longitude`]: longitude,
          type,
          [`${otherType}_latitude`]: null,
          [`${otherType}_longitude`]: null,
        },
      }).unwrap();

      toast.success(`${type} address saved successfully`);
      setResetKey((prev) => prev + 1);
      setShow(false); 
    } catch (err) {
      toast.error(err?.data?.message || `Failed to save ${type} address.`);
    }
  };

  return (
    <CommonModal setShow={setShow} show={show} handleClose={handleClose} className="confirmationModal">
      <div className="p-4">
        <h2 className="text-center text-lg font-semibold mb-4">
          Are you sure <br />
          you want to edit this address?
        </h2>

        <label className="form-label">Address</label>
        <Autocomplete key={resetKey} onLoad={setAutocompleteRef} onPlaceChanged={handlePlaceChanged}>
          <input type="text" className="form-control mb-3" placeholder="Search address" />
        </Autocomplete>

        <Row>
          <Col>
            <Button
              label="Save"
              className="rounded-2 w-100 mb-3"
              size="xs"
              onClick={handleSubmit}
            />
          </Col>
        </Row>
      </div>
    </CommonModal>
  );
};

export default EditAddressModal;
