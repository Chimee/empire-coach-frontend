import React from "react";
import { Form, InputGroup } from "react-bootstrap";

const InputWithIcon = ({ label, type = "text", name, value, onChange, placeholder, required = false, icon, disabled = false }) => {
  return (
    <Form.Group className="mb-3">
      <Form.Label className="cmn_label">
        {label} {required && <span className="text-danger">*</span>}
      </Form.Label>
      <InputGroup>
    
        <Form.Control
        disable={disabled}
        className={`${disabled && 'disabled_input'}`}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
        />    {icon && <InputGroup.Text>{icon}</InputGroup.Text>}
      </InputGroup>
    </Form.Group>
  );
};

export default InputWithIcon;
