import React from "react";
import InputWithLabel from "../../../components/shared/fields/InputWithLabel";
import SelectBox from "../../../components/shared/fields/SelectBox";
import { Row, Col } from "react-bootstrap";
import Button from "../../../components/shared/buttons/button";
import { validateRequiredFields } from "../../../helpers/Utils";
import toast from "react-hot-toast";
import VehicleDroppDown from "./VehicleDroppDown";
const JobStepFour = ({ handleNext, handlePrevious, formData, setFormData }) => {
  const [currentVehicle, setCurrentVehicle] = React.useState({
    year: '',
    make: '',
    model: '',
    vinNumber: '',
    fuelType: '',
    PO_number: ''
  });

  const YearOptions = [
    { label: "2024", value: "2024" },
    { label: "2023", value: "2023" },
    { label: "2022", value: "2022" },
    { label: "2021", value: "2021" },
    { label: "2020", value: "2020" },
  ];
  const MakeOptions = [
    { label: "Ford", value: "Ford" },
    { label: "Chevrolet", value: "Chevrolet" },
    { label: "Toyota", value: "Toyota" },
    { label: "Honda", value: "Honda" },
    { label: "Hyundai", value: "Hyundai" },
  ];
  const ModelOptions = [
    { label: "Mustang", value: "Mustang" },
    { label: "Silverado", value: "Silverado" },
    { label: "Camry", value: "Camry" },
    { label: "Civic", value: "Civic" },
    { label: "Elantra", value: "Elantra" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentVehicle((currentVehicle) => ({
      ...currentVehicle,
      [name]: value
    }));
  };

  const handleSelect = (name, value) => {

    setCurrentVehicle((currentVehicle) => ({
      ...currentVehicle,
      [name]: value
    }));
  };
  const saveVehicleDetails = () => {
    if (!currentVehicle.year || !currentVehicle.make || !currentVehicle.model || !currentVehicle.vinNumber || !currentVehicle.fuelType) {
      toast.dismiss();
      toast.error("Please fill all required fields for the current vehicle.");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      vehicle_details: [
        ...prev.vehicle_details || [],
        currentVehicle
      ]
    }));
    setCurrentVehicle({
      year: '',
      make: '',
      model: '',
      vinNumber: '',
      fuelType: '',
      PO_number: ''
    });
  };
  const handleNextStep = () => {
    const isCurrentVehicleEmpty = Object.keys(currentVehicle).every(key => !currentVehicle[key]);
    const isCurrentVehicleIncomplete = Object.keys(currentVehicle).some(key => !currentVehicle[key]);

    if (
      (formData?.vehicle_details?.length === 0 || !formData?.vehicle_details) &&
      isCurrentVehicleEmpty
    ) {
      toast.dismiss();
      toast.error("Please add at least one vehicle with all required fields filled.");
      return;
    }

    if (isCurrentVehicleIncomplete && !isCurrentVehicleEmpty) {
      toast.dismiss();
      toast.error("Please fill all required fields for the current vehicle before proceeding.");
      return;
    }

    if (!isCurrentVehicleIncomplete && !isCurrentVehicleEmpty) {
      setFormData((prev) => ({
        ...prev,
        vehicle_details: [
          ...(prev.vehicle_details || []),
          currentVehicle
        ]
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

    if ((formData?.vehicle_details?.length || 0) === 0 && isCurrentVehicleEmpty) {
      toast.dismiss();
      toast.error("Please add at least one vehicle with all required fields filled.");
      return;
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
              <h3>{vehicle.year} {vehicle.make} {vehicle.model}</h3>
              <div className="d-flex justify-content-between gap-2">
                <p> PO Number <span>{vehicle.PO_number}</span></p>
                <p> VIN Number <span>{vehicle.vinNumber}</span></p>
                <p> Fuel type <span>{vehicle.fuelType}</span></p>
              </div>
              <button onClick={() => removeVehicle(index)}>remove</button>
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
            />
            {/* <SelectBox
              label="Year"
              options={YearOptions}
              name="year"
              value={currentVehicle.year || ""}
              onChange={(e) => handleSelect("year", e.target.value)}
            /> */}
          </Col>
          <Col lg={4}>
            <VehicleDroppDown
             currentVehicle={currentVehicle}
              setCurrentVehicle={setCurrentVehicle}
              selectType="Make"
              options={MakeOptions}
            />
            {/* <SelectBox

              label="Make"
              options={MakeOptions}
              name="make"
              value={currentVehicle.make || ""}
              onChange={(e) => handleSelect("make", e.target.value)}
            /> */}
          </Col>
          <Col lg={4}>
            <VehicleDroppDown
              currentVehicle={currentVehicle}
              setCurrentVehicle={setCurrentVehicle}
              selectType="Model"
              options={ModelOptions}
            />
            {/* <SelectBox
              label="Model"
              options={ModelOptions}
              name="model"
              value={currentVehicle.model || ""}
              onChange={(e) => handleSelect("model", e.target.value)}
            /> */}
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