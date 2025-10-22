import React from "react";
import InputWithLabel from "../../../components/shared/fields/InputWithLabel";
import { Row, Col } from "react-bootstrap";
import Button from "../../../components/shared/buttons/button";
import toast from "react-hot-toast";
import VehicleDroppDown from "./VehicleDroppDown";
import { useGetVehicleQuery } from "../../../app/settingApi/settingApi";
import { CiTrash } from "react-icons/ci";

const JobStepFour = ({ handleNext, handlePrevious, formData, setFormData }) => {
  const [currentVehicle, setCurrentVehicle] = React.useState({
    year: "",
    make: "",
    model: "",
    vinNumber: "",
    PO_number: ""
  });

  const { data: vehiclesData } = useGetVehicleQuery();

  // Generate Make options from API
  const MakeOptions = vehiclesData?.data?.map((v) => ({
    label: v.make,
    value: v.make
  })) || [];


  // Find selected make object to get models
  const selectedMakeObj = vehiclesData?.data?.find(
    (v) => v.make === currentVehicle.make
  );

  const ModelOptions =
    selectedMakeObj?.models?.map((m) => ({
      label: m,
      value: m
    })) || [];

  const currentYear = new Date().getFullYear();
  const YearOptions = Array.from({ length: 10 }, (_, i) => {
    const year = currentYear + 1 - i;
    return { label: String(year), value: String(year) };
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentVehicle((prev) => ({
      ...prev,
      [name]: value.toUpperCase(),
    }));
  };
  const handleSelect = (name, value) => {
    setCurrentVehicle((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "make" ? { model: "" } : {}) // reset model when make changes
    }));
  };

  const saveVehicleDetails = () => {
  
    if (
      !currentVehicle.year ||
      !currentVehicle.make ||
      !currentVehicle.model ||
      !currentVehicle.vinNumber ||
      !currentVehicle.fueltype
    ) {
      toast.dismiss();
      toast.error("Please fill all required fields for the current vehicle.");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      vehicle_details: [...(prev.vehicle_details || []), currentVehicle]
    }));
    setCurrentVehicle({
      year: "",
      make: "",
      model: "",
      vinNumber: "",
      fueltype: "",
      PO_number: ""
    });
  };

  const handleNextStep = () => {
   
    const isCurrentVehicleEmpty = Object.keys(currentVehicle).every(
      (key) => !currentVehicle[key]
    );
    const isCurrentVehicleIncomplete = Object.keys(currentVehicle).some(
      (key) => !currentVehicle[key]
    );

    if (
      (formData?.vehicle_details?.length === 0 || !formData?.vehicle_details) &&
      isCurrentVehicleEmpty
    ) {
      toast.dismiss();
      toast.error(
        "Please add at least one vehicle with all required fields filled."
      );
      return;
    }

    if (isCurrentVehicleIncomplete && !isCurrentVehicleEmpty) {
      toast.dismiss();
      toast.error(
        "Please fill all required fields for the current vehicle before proceeding."
      );
      return;
    }

    if (!isCurrentVehicleIncomplete && !isCurrentVehicleEmpty) {
      setFormData((prev) => ({
        ...prev,
        vehicle_details: [...(prev.vehicle_details || []), currentVehicle]
      }));
      setCurrentVehicle({
        year: "",
        make: "",
        model: "",
        vinNumber: "",
        fueltype: "",
        PO_number: ""
      });
    }

    handleNext();
  };

  const removeVehicle = (index) => {
    setFormData((prev) => ({
      ...prev,
      vehicle_details: prev.vehicle_details.filter((_, i) => i !== index)
    }));

  };

  return (
    <div>
      {formData?.vehicle_details?.length > 0 && (
        <div className="vehicle_list mb-3 d-flex flex-column gap-3">
          {formData.vehicle_details.map((vehicle, index) => (
            <div key={index} className="vehicle_item">
              <h3 className="d-flex gap-2 justify-content-between align-items-center">
                {vehicle.year} {vehicle.make} {vehicle.model} <CiTrash className="text-danger" onClick={() => removeVehicle(index)} />
              </h3>
              <div className="d-flex justify-content-between gap-2">
                <p>
                  PO Number :<span>{vehicle.PO_number}</span>
                </p>
                <p>
                  VIN Number: <span>{vehicle.vinNumber}</span>
                </p>
                <p>
                  Fuel Type :<span>{vehicle.fueltype}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <h5 className="step_heading mb-4">Vehicle Details</h5>
      <div className="vehicle_card">
        <Row>
          <Col lg={4}>
            <VehicleDroppDown
            label="Year"
              currentVehicle={currentVehicle}
              setCurrentVehicle={setCurrentVehicle}
              selectType="Year"
              options={YearOptions}
              value={currentVehicle.year}
              onChange={(val) => handleSelect("year", val)}
            />
          </Col>
          <Col lg={4}>
            <VehicleDroppDown
            label="Make"
              currentVehicle={currentVehicle}
              setCurrentVehicle={setCurrentVehicle}
              selectType="Make"
              options={MakeOptions}
              value={currentVehicle.make}
              onChange={(val) => handleSelect("make", val)}
            />
          </Col>
          <Col lg={4}>
            <VehicleDroppDown
            label="Model"
              currentVehicle={currentVehicle}
              setCurrentVehicle={setCurrentVehicle}
              selectType="Model"
              options={ModelOptions}
              value={currentVehicle.model}
              onChange={(val) => handleSelect("model", val)}
            />
          </Col>
          <Col lg={12}>
            <InputWithLabel
              label="VIN Number"
              placeholder="Enter VIN Number here"
              name="vinNumber"
              value={currentVehicle.vinNumber || ""}
              onChange={handleChange}
            />
          </Col>
          <Col lg={12}>
            <VehicleDroppDown
            label="Fuel Type"
              selectType="FuelType"
              currentVehicle={currentVehicle}
              setCurrentVehicle={setCurrentVehicle}
              value={currentVehicle.fueltype}
              options={[
                { label: "Diesel", value: "DIESEL" },
                { label: "Electric", value: "Electric" },
                { label: "Gas", value: "Gas" },
              ]}
              onChange={(val) => handleSelect("fueltype", val)}
            />
          </Col>
          <Col lg={12}>
            <InputWithLabel
              label="PO Number (optional)"
              placeholder="Enter purchase order number"
              name="PO_number"
              value={currentVehicle.PO_number || ""}
              onChange={handleChange}
            />
          </Col>
        </Row>
        <div className="text-end">
          <Button
            label={"Save"}
            className={"rounded-2"}
            size={"small"}
            onClick={saveVehicleDetails}
          />
        </div>
      </div>
      <div className="d-flex justify-content-between mt-3">
        <Button
          label={"Previous"}
          className={"rounded-2 bordered"}
          size={"small"}
          onClick={handlePrevious}
        />
        <Button
          label={"Next"}
          className={"rounded-2"}
          size={"small"}
          onClick={handleNextStep}
        />
      </div>
    </div>
  );
};

export default JobStepFour;
