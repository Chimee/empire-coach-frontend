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
    fuelType: "",
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

  // Generate Model options dynamically
  const ModelOptions =
    selectedMakeObj?.models?.map((m) => ({
      label: m,
      value: m
    })) || [];

  const YearOptions = [
    { label: "2024", value: "2024" },
    { label: "2023", value: "2023" },
    { label: "2022", value: "2022" },
    { label: "2021", value: "2021" },
    { label: "2020", value: "2020" }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentVehicle((prev) => ({
      ...prev,
      [name]: value
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
      !currentVehicle.fuelType
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
      fuelType: "",
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
        fuelType: "",
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
                {vehicle.year} {vehicle.make} {vehicle.model} <CiTrash  className="text-danger" onClick={() => removeVehicle(index)}/>
              </h3>
              <div className="d-flex justify-content-between gap-2">
                <p>
                  PO Number <span>{vehicle.PO_number}</span>
                </p>
                <p>
                  VIN Number <span>{vehicle.vinNumber}</span>
                </p>
                <p>
                  Fuel type <span>{vehicle.fuelType}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <h5 className="step_heading mb-0">Vehicle Details</h5>
      <div className="vehicle_card">
        <Row>
          <Col lg={4}>
            <VehicleDroppDown
              currentVehicle={currentVehicle}
              setCurrentVehicle={setCurrentVehicle}
              selectType="Year"
              options={YearOptions}
              onChange={(val) => handleSelect("year", val)}
            />
          </Col>
          <Col lg={4}>
            <VehicleDroppDown
              currentVehicle={currentVehicle}
              setCurrentVehicle={setCurrentVehicle}
              selectType="Make"
              options={MakeOptions}
              onChange={(val) => handleSelect("make", val)}
            />
          </Col>
          <Col lg={4}>
            <VehicleDroppDown
              currentVehicle={currentVehicle}
              setCurrentVehicle={setCurrentVehicle}
              selectType="Model"
              options={ModelOptions}
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
            <InputWithLabel
              label="Fuel type"
              placeholder="Enter Fuel type here"
              name="fuelType"
              value={currentVehicle.fuelType || ""}
              onChange={handleChange}
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
