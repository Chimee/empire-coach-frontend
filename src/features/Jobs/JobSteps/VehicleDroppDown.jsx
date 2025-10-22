import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { CheveronDownSvg } from "../../../svgFiles/CheveronDownSvg";

const VehicleDropdown = ({ selectType, options, currentVehicle, setCurrentVehicle,label }) => {

  const key = selectType.toLowerCase();
  const selectedValue = currentVehicle[key] || "";
  const selectedOption = options.find((opt) => opt.value === selectedValue);

  const handleSelect = (selected) => {
    const chosen = options.find((opt) => opt.value === selected);
    if (chosen) {
      setCurrentVehicle((prev) => ({
        ...prev,
        [key]: chosen.value,
      }));
    }
  };

  return (
    <div className="mb-3">
      <label htmlFor={`vehicle-${key}`} className="cmn_label form-label">
        Select {label}
      </label>
      <Dropdown className="vehicle_dropdown">
        <Dropdown.Toggle variant="unset" id={`vehicle-${key}`}>
          {selectedOption ? selectedOption.label : `Select ${selectType}`} <CheveronDownSvg />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {options.map((option, index) => (
            <Dropdown.Item
              key={index}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default VehicleDropdown;
