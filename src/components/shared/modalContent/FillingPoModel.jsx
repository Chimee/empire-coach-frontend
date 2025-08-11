import React, { useState, useEffect } from "react";
import CommonModal from "../modalLayout/CommonModal";
import Button from "../buttons/button";
import { Row, Col, Form } from "react-bootstrap";
import toast from "react-hot-toast";
import { useFillingPoNumberMutation } from "../../../app/customerApi/customerApi";

const VehicleDetailsModal = ({ show, setShow, vehicleData = {}, job }) => {
  const [poNumber, setPoNumber] = useState("");

  const [addPONumber, { isLoading: isFilling }] = useFillingPoNumberMutation();

  useEffect(() => {
    if (show) {
      setPoNumber("");
    }
  }, [show]);

  const handleSubmit = async () => {
    if (!poNumber.trim()) {
      toast.error("Please enter a PO Number");
      return;
    }

    try {
      await addPONumber({ jobId: job?.id, po_number: poNumber }).unwrap();
      toast.success("PO Number submitted successfully");
      setShow(false);
    } catch (error) {

      toast.error(error?.data?.message || "Failed to submit PO Number");
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
              <div className="form-control-plaintext">{vehicleData?.vehicle_year}</div>
            </Col>
            <Col>
              <label className="form-label">Make</label>
              <div className="form-control-plaintext">{vehicleData?.vehicle_make}</div>
            </Col>
            <Col>
              <label className="form-label">Model</label>
              <div className="form-control-plaintext">{vehicleData?.vehicle_model}</div>
            </Col>
          </Row>

          <div className="mb-3">
            <label className="form-label">VIN Number</label>
            <div className="form-control-plaintext">{vehicleData?.vin_number}</div>
          </div>

          <div className="mb-3">
            <label className="form-label">Fuel Type</label>
            <div className="form-control-plaintext">{vehicleData?.fuel_type}</div>
          </div>

          <div>
            <label className="form-label">PO Number</label>
            <Form.Control
              value={poNumber}
              onChange={(e) => setPoNumber(e.target.value)}
              placeholder="Enter PO Number"
              disabled={isFilling}
            />
          </div>
        </div>

        <div className="mt-4 d-flex justify-content-end gap-2">
          <Button
            label="Cancel"
            className="bg-[#f0f0f0] text-gray-700 rounded px-4 py-2"
            onClick={handleClose}
            disabled={isFilling}
          />
          <Button
            label={isFilling ? "Submitting..." : "Next"}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2"
            onClick={handleSubmit}
            disabled={isFilling}
          />
        </div>
      </div>
    </CommonModal>
  );
};

export default VehicleDetailsModal;
