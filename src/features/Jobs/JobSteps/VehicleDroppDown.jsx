import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { CheveronDownSvg } from "../../../svgFiles/CheveronDownSvg";

const VehicleDropdown = ({ selectType, options, currentVehicle, setCurrentVehicle }) => {
  const [title, setTitle] = React.useState(`Select ${selectType}`);

  // Sync title with currentVehicle changes
  React.useEffect(() => {
    const key = selectType.toLowerCase(); // "year", "make", "model"
    const value = currentVehicle[key];

    if (!value) {
      setTitle(`Select ${selectType}`);
    } else {
      const chosen = options.find((opt) => opt.value === value);
      setTitle(chosen ? chosen.label : `Select ${selectType}`);
    }
  }, [currentVehicle, options, selectType]);

  const handleSelect = (selected) => {
    const chosen = options.find((opt) => opt.value === selected);
 
    if (chosen) {
      setCurrentVehicle((prev) => ({
        ...prev,
        [selectType.toLowerCase()]: chosen.value, // updates parent state
      }));
    }
  };

  return (
    <div>
      <label htmlFor="vehicle-dropdown" className="cmn_label form-label">
        Select {selectType}
      </label>
      <Dropdown className="vehicle_dropdown">
        <Dropdown.Toggle variant="unset" id="dropdown-basic">
          {title} <CheveronDownSvg />
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
