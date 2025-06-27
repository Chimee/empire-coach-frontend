import React from "react";
import "./button.css"; // Import styles
import Spinner from 'react-bootstrap/Spinner';
const Button = ({ size = "medium", label, onClick,loading, className,icon }) => {
  return (
    <button className={`${className} cmn_btn btn-${size} ${(loading || icon) && "d-flex gap-2 align-items-center"}`} onClick={onClick}>
    {icon && icon}  {label} {loading &&   <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>}  
    </button>
  );
};

export default Button;
