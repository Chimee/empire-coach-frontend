import React, { useState, useEffect } from "react";
import CommonModal from "../modalLayout/CommonModal";
import Button from "../buttons/button";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import { useUpdateDeliveryAddressMutation } from "../../../app/customerApi/customerApi";
import toast from "react-hot-toast";

const EditAddressModal = ({ show, handleClose, setShow, addressId, addressData, message, type }) => {
  // debugger;  
  const [autocompleteRef, setAutocompleteRef] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState({
    business_name: "",
    address: "",
    latitude: null,
    longitude: null
  });
  const [resetKey, setResetKey] = useState(0);
  const [updateDeliveryAddress] = useUpdateDeliveryAddressMutation();

  console.log("Address Data in Edit Modal:", addressData)

  useEffect(() => {
    if (addressData) {
      setSelectedPlace({
        business_name: addressData.label || "",
        address: addressData.address || "",
        latitude: type === "pickup" ? addressData.pickup_latitude : addressData.dropoff_latitude,
        longitude: type === "pickup" ? addressData.pickup_longitude : addressData.dropoff_longitude,
      });
    }
  }, [addressData, type, show]);

  const handlePlaceChanged = () => {
    if (!autocompleteRef) return;
    const place = autocompleteRef.getPlace();

    if (!place?.geometry) {
      toast.error("Could not get location details from Google");
      return;
    }

    setSelectedPlace((prev) => ({
      ...prev,
      business_name:place.name,
      address: place.formatted_address,
      latitude: place.geometry.location.lat(),
      longitude: place.geometry.location.lng(),
    }));
  };

  const handleSubmit = async () => {
    debugger;
    const { business_name, address, latitude, longitude } = selectedPlace;

    if (!business_name && !address) {
      toast.error("Please provide at least a business name or an address.");
      return;
    }

    try {
      const otherType = type === "pickup" ? "dropoff" : "pickup";

      await updateDeliveryAddress({
        data: {
          addressId,
          business_name: business_name || undefined,
          address: address || undefined,
          [`${type}_latitude`]: latitude || undefined,
          [`${type}_longitude`]: longitude || undefined,
          type,
          [`${otherType}_latitude`]: null,
          [`${otherType}_longitude`]: null,
        },
      }).unwrap();

      setResetKey((prev) => prev + 1);
      setShow(false);
    } catch (err) {
      console.log(err)
    }
  };

  return (
    <CommonModal setShow={setShow} show={show} handleClose={handleClose} className="confirmationModal sm-width">
      <div className="p-3">
        <h1 className="text-center text-lg font-semibold mb-4">
          Are you sure <br />
          you want to edit this address?
        </h1>

        <label className="form-label">Business Name</label>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Business name"
          value={selectedPlace.business_name}
          onChange={(e) =>
            setSelectedPlace((prev) => ({ ...prev, business_name: e.target.value }))
          }
        />
        <label className="form-label">Address</label>
        
        <Autocomplete key={resetKey} onLoad={setAutocompleteRef} onPlaceChanged={handlePlaceChanged}>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Search address"
            value={selectedPlace.address}
            onChange={(e) =>
              setSelectedPlace((prev) => ({ ...prev, address: e.target.value }))
            }
          />
        </Autocomplete>

        <Button
          label="Save"
          className="rounded-2 w-100"
          size="xs"
          onClick={handleSubmit}
        />
      </div>
    </CommonModal>
  );
};

export default EditAddressModal;
