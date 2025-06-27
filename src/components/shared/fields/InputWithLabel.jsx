import React from "react";
import { Form } from "react-bootstrap";

const InputWithLabel = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  disabled = false,
  required = false,
  className = "",
  readOnly = false, 
}) => {
  return (
    <Form.Group className={`mb-3 ${className}`}>
      <Form.Label className="input-label">
        {label} {required && <span className="text-danger">*</span>}
      </Form.Label>
      <Form.Control
        className={`${disabled ? 'disabled_input' : 'cmn_input'}`}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        readOnly={readOnly} // ✅ correctly applied
      />
    </Form.Group>
  );
};

export default InputWithLabel;
