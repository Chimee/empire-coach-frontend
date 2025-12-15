import React from "react";
import "./button.css";
import Spinner from "react-bootstrap/Spinner";

const Button = ({
  size = "medium",
  label,
  onClick,
  loading,
  className = "",
  icon,
  disabled = false
}) => {
  return (
    <button
      disabled={disabled || loading}
      className={`cmn_btn btn-${size} ${className} ${disabled ? "disabled" : ""} ${
        loading || icon ? "d-flex align-items-center justify-content-center gap-2" : ""
      }`}
      onClick={onClick}
    >
      <span className="btn-text">{label}</span>
      {loading && (
        <Spinner animation="border" role="status" size="sm">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      )}
    </button>
  );
};

export default Button;
