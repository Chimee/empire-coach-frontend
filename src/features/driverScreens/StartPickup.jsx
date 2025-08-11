import React, { useState } from 'react';
import './style.css';
import { BackChevronSvg } from '../../svgFiles/BackChevronSvg';
import { useParams,useNavigate } from 'react-router';
import Button from '../../components/shared/buttons/button';
import InputWithLabel from '../../components/shared/fields/InputWithLabel';
import { CameraSvg } from '../../svgFiles/CameraSvg';
import { useUpdateRideDetailsMutation } from "../../app/driverApi/driverApi";
import toast from "react-hot-toast";

const StartPickup = () => {
    const {id,driverId} = useParams();
  const [mileage, setMileage] = useState("");
  const [damageNotes, setDamageNotes] = useState("");
  const [photos, setPhotos] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const navigate= useNavigate();

  const [updateRideDetails, { isLoading }] = useUpdateRideDetailsMutation();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotos((prev) => [...prev, ...files]);
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...urls]);
  };

  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleBeginTrip = async () => {
     if (!mileage || !damageNotes || photos.length === 0) {
        toast.error("Please fill all the fields and upload at least one photo");
        return;
    }

    try {
    const formData = new FormData();

    formData.append("jobId", id);
    formData.append("driverId", driverId);
    formData.append("checkin_mileage", mileage);
    formData.append("damage_notes", damageNotes);
    formData.append("current_latitude", null);
    formData.append("current_longitude", null);
    formData.append("ending_mileage", null);
    formData.append("delivery_notes", null);
    formData.append("ride_status", "checked_in");
     
    photos.forEach((file) => {
      formData.append("vehicle_photo", file);
    });
     const res = await updateRideDetails(formData);

      if(res.data){
       toast.success(res.data?.message || " ride details have been updated ")
       navigate(`/trip-starts/jobId/${id}/driver/${driverId}`)
      }
    } catch (error) {

        toast.error(error?.data?.message || "update ride details failed")
    }
  };

  return (
    <div className='mobile_wrapper position-relative d-flex flex-column px-3 pt-3'>
      <BackChevronSvg onClick = {()=>navigate(`/ride-details/jobId/${id}/driver/${driverId}`)}/>
      <h3 className='mob-heading mt-1'>Start Pickup</h3>

      <div className='flex-grow-1 picupForm'>
        <InputWithLabel
          label={'Enter starting Mileage'}
          type='number'
          value={mileage}
          onChange={(e) => setMileage(e.target.value)}
          placeholder={'0'}
        />

        <label htmlFor="VehiclePhotos" className='cmn_label form-label'>
          Photos of Vehicle
        </label>
        <div className='vehiclePhoto position-relative d-flex flex-column justify-content-center align-items-center'>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />
          <CameraSvg />
          <p className='mb-0'>Tap to upload photos</p>
        </div>

   
        {previewUrls.length > 0 && (
          <div className="photo-preview mt-2 d-flex flex-wrap gap-2">
            {previewUrls.map((url, idx) => (
              <div key={idx} className="position-relative">
                <img
                  src={url}
                  alt="Preview"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "8px"
                  }}
                />
                <button
                  type="button"
                  onClick={() => removePhoto(idx)}
                  style={{
                    position: "absolute",
                    top: "-5px",
                    right: "-5px",
                    background: "black",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                    fontSize: "14px",
                    lineHeight: "18px",
                    padding: 0
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <label htmlFor="damageNotes" className='cmn_label form-label d-block mt-3'>
          Damage Notes
        </label>
        <textarea
          name="damageNotes"
          className='form-control'
          rows={6}
          value={damageNotes}
          onChange={(e) => setDamageNotes(e.target.value)}
          placeholder='Enter any damage notes...'
        />
      </div>

      <div className='text-center px-3 pb-3'>
        <Button
          label={isLoading ? 'Processing...' : 'Begin Trip'}
          className='rounded w-100'
          onClick={handleBeginTrip}
          disabled={isLoading}
        />
      </div>
    </div>
  );
};

export default StartPickup;
