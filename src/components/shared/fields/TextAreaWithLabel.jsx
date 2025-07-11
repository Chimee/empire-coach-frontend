import React from "react";
import { Form } from "react-bootstrap";

const TextAreaWithLabel = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  disabled = false,
  required = false,
  className = "",
  readOnly = false,
  rows = 3,
}) => {
  return (
    <Form.Group className={`mb-3 ${className}`}>
      <Form.Label className="cmn_label  form-label">
        {label} {required && <span className="text-danger">*</span>}
      </Form.Label>
      <Form.Control
        as="textarea"
        rows={rows}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        className={`${disabled ? "disabled_input" : "cmn_input"}`}
      />
    </Form.Group>
  );
};

export default TextAreaWithLabel;
