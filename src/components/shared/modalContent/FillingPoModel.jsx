import React, { useState, useImperativeHandle, forwardRef } from "react";
import CommonModal from "../modalLayout/CommonModal";
import Button from "../buttons/button";
import { Row, Col, Form } from "react-bootstrap";
import toast from 'react-hot-toast';

const VehicleDetailsModal = forwardRef(({ onConfirm }, ref) => {
   const [show, setShow] = useState(false);
  const [poNumber, setPoNumber] = useState("");

  const [rowData, setRowData] = useState(null); 


   useImperativeHandle(ref, () => ({
    open: (row) => {
      setRowData(row);
      setShow(true);
    },
    close: () => {
      setShow(false);
    },
  }));

 const handleSubmit = async () => {
  if (poNumber.trim() === "") {
    toast.error("Please enter a PO Number");
    return;
  }

  try {
    await onConfirm(rowData.id, poNumber); 
    toast.success("PO Number added successfully");
    setShow(false);   
    setPoNumber(""); 
  } catch (err) {
    toast.error(err?.data?.message || "Failed to fill PO Number");
    console.error(err);
  }
};
    const handleClose = () => {
    setShow(false);
    setPoNumber("");
   };

  if (!show) return null;
  

  return (
    <CommonModal show={show} setShow={setShow} handleClose={handleClose}>
      <div className="p-4 px-5" style={{ maxWidth: 700 }}>
        <h2 className="text-lg font-semibold text-[#0D0C22] mb-4">Vehicle Details</h2>

        <div className="bg-[#f5f7fa] p-4 rounded-md">
          <Row className="mb-3">
            <Col>
              <label className="form-label">Year</label>
              <div className="form-control-plaintext">{rowData.vehicle_year}</div>
            </Col>
            <Col>
              <label className="form-label">Make</label>
              <div className="form-control-plaintext">{rowData.vehicle_make}</div>
            </Col>
            <Col>
              <label className="form-label">Model</label>
              <div className="form-control-plaintext">{rowData.vehicle_model}</div>
            </Col>
          </Row>

          <div className="mb-3">
            <label className="form-label">VIN Number</label>
            <div className="form-control-plaintext">{rowData.vin_number}</div>
          </div>

          <div className="mb-3">
            <label className="form-label">Fuel Type</label>
            <div className="form-control-plaintext">{rowData.fuel_type}</div>
          </div>

          <div>
            <label className="form-label">PO Number</label>
            <Form.Control
              value={poNumber}
              onChange={(e) => setPoNumber(e.target.value)}
              placeholder="Enter PO Number"
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end g ap-3">
          <Button
           label="Cancel"
           className="bg-[#f0f0f0] text-gray-700 rounded px-4 py-2"
           onClick={handleClose}
       />
          <Button
            label="Next"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </CommonModal>
  );
});

export default VehicleDetailsModal;
