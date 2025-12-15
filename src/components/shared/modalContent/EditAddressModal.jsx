import React, { useState, useEffect } from "react";
import CommonModal from "../modalLayout/CommonModal";
import Button from "../buttons/button";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import { useUpdateDeliveryAddressMutation } from "../../../app/customerApi/customerApi";
import toast from "react-hot-toast";
import { useUpdateJobDetailsMutation } from '../../../app/adminApi/adminApi';

const EditAddressModal = ({ show, handleClose, setShow, addressId, addressData, message, type, jobId = null, userRole }) => {

  const [autocompleteRef, setAutocompleteRef] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState({
    business_name: "",
    address: "",
    latitude: null,
    longitude: null
  });
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [dropoffDate, setDropoffDate] = useState("");
  const [dropoffTime, setDropoffTime] = useState("");
  const [resetKey, setResetKey] = useState(0);
  const [updateDeliveryAddress, { isLoading: isUpdatingAddress }] = useUpdateDeliveryAddressMutation();
  const [updateJobDetails, { isLoading: isUpdating }] = useUpdateJobDetailsMutation();


  useEffect(() => {
    if (addressData) {
      setSelectedPlace({
        business_name: addressData.label || "",
        address: addressData.address || "",
        latitude: type === "pickup" ? addressData.pickup_latitude : addressData.dropoff_latitude,
        longitude: type === "pickup" ? addressData.pickup_longitude : addressData.dropoff_longitude,
      });

      setPickupDate(addressData.pickup_date || "");
      setPickupTime(addressData.pickup_time || "");
      setDropoffDate(addressData.dropoff_date || "");
      setDropoffTime(addressData.dropoff_time || "");
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
      business_name: place.name,
      address: place.formatted_address,
      latitude: place.geometry.location.lat(),
      longitude: place.geometry.location.lng(),
    }));
  };

  const handleSubmit = async () => {
    const { business_name, address, latitude, longitude } = selectedPlace;

    if (!business_name && !address) {
      toast.error("Please provide at least a business name or an address.");
      return;
    }

    try {
      const otherType = type === "pickup" ? "dropoff" : "pickup";
      if (userRole === "customer") {

        const payload = {
          addressId,
          business_name: business_name || undefined,
          address: address || undefined,
          [`${type}_latitude`]: latitude || undefined,
          [`${type}_longitude`]: longitude || undefined,
          type,
          [`${otherType}_latitude`]: null,
          [`${otherType}_longitude`]: null,
          jobId
        };

        if (type === "pickup") {
          payload.pickup_date = pickupDate || undefined;
          payload.pickup_time = pickupTime || undefined;
        } else {
          payload.dropoff_date = dropoffDate || undefined;
          payload.dropoff_time = dropoffTime || undefined;
        }

        await updateDeliveryAddress({ data: payload }).unwrap();
      }

      else if (["admin", "superadmin"].includes(userRole)) {
        const payload = {
          jobId,
          type,
          address,
          latitude,
          longitude,
        };

        if (type === "pickup") {
          payload.pickup_date = pickupDate || undefined;
          payload.pickup_time = pickupTime || undefined;
          payload.business_name = business_name || undefined;
          payload[`${otherType}_date`] = null;
          payload[`${otherType}_time`] = null;
        } else {
          payload.dropoff_date = dropoffDate || undefined;
          payload.dropoff_time = dropoffTime || undefined;
          payload.business_name = business_name || undefined;
          payload[`${otherType}_date`] = null;
          payload[`${otherType}_time`] = null;
        }

        await updateJobDetails(payload).unwrap();
      }

      toast.success("Address updated successfully");
      setResetKey((prev) => prev + 1);
      setShow(false);

    } catch (err) {
      console.error(err);
      toast.error("Failed to update address");
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

        {type === "pickup" && (
          <>
            <label className="form-label">Pickup Date</label>
            <input
              type="date"
              className="form-control mb-3"
              value={pickupDate ? pickupDate.split("T")[0] : ""}
              onChange={(e) => setPickupDate(e.target.value)}
            />
            <label className="form-label">Pickup Time</label>
            <input
              type="time"
              className="form-control mb-3"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
            />
          </>
        )}

        {type === "dropoff" && (
          <>
            <label className="form-label">Dropoff Date</label>
            <input
              type="date"
              className="form-control mb-3"
              value={dropoffDate ? dropoffDate.split("T")[0] : ""}
              onChange={(e) => setDropoffDate(e.target.value)}
            />
            <label className="form-label">Dropoff Time</label>
            <input
              type="time"
              className="form-control mb-3"
              value={dropoffTime}
              onChange={(e) => setDropoffTime(e.target.value)}
            />
          </>
        )}

        <Button
          label="Save"
          className="rounded-2 w-100"
          size="xs"
          loading={isUpdating || isUpdatingAddress}
          onClick={handleSubmit}
        />
      </div>
    </CommonModal>
  );
};

export default EditAddressModal;
