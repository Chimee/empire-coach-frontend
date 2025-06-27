import React from "react";
import { Form } from "react-bootstrap";

const SelectBox = ({ label, name, value, onChange, options = [], required = false, className = "" }) => {
  return (
    <Form.Group className={`mb-3 ${className}`}>
      <Form.Label className="cmn_label ">
        {label} {required && <span className="text-danger">*</span>}
      </Form.Label>
      <Form.Select className="cmn_select" name={name} value={value} onChange={onChange} required={required}>
        <option value="">Select an option</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
};

export default SelectBox;
