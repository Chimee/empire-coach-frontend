import React from "react";
import "./button.css";
import Spinner from "react-bootstrap/Spinner";

const Button = ({ size = "medium", label, onClick, loading, className = "", icon, disabled = false }) => {
  return (
    <button
      disabled={disabled}
      className={`cmn_btn btn-${size} ${className} ${disabled ? "disabled" : ""} ${(loading || icon) ? "d-flex gap-2 align-items-center" : ""}`}
      onClick={onClick}
    >
      {icon && icon} {label}
      {loading && (
        <Spinner animation="border" role="status" size="sm">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      )}
    </button>
  );
};

export default Button;
