import React, { useState } from 'react';
import CommonModal from '../modalLayout/CommonModal';
import Button from '../buttons/button';
import { Form } from 'react-bootstrap';

const AssignDriverModal = ({ show, setShow, onAssign, drivers = [] }) => {
  const [selectedDriver, setSelectedDriver] = useState('');

  const handleAssign = () => {
    if (!selectedDriver) return alert('Please select a driver.');
    onAssign(selectedDriver);
    setShow(false);
    setSelectedDriver('');
  };

  const handleClose = () => {
    setSelectedDriver('');
    setShow(false);
  };

  return (
    <CommonModal
      show={show}
      setShow={setShow}
      handleClose={handleClose}
      className="confirmationModal sm-width"
      title={'Assign Driver'}
    >
      <p className="text-secondary mb-3">Select a driver to assign them to this job</p>

      <Form.Select
        className="form-select mb-4"
        value={selectedDriver}
        onChange={(e) => setSelectedDriver(e.target.value)}
      >
        <option value="">Choose from list</option>
        {drivers.map((driver) => (
          <option key={driver.id} value={driver.id}>
            {driver.name}
          </option>
        ))}
      </Form.Select>

      <div className="d-flex justify-content-end gap-2">
        <Button label="Cancel" className="bordered px-4 py-2" onClick={handleClose} />
        <Button label="Assign" className="px-4 py-2" onClick={handleAssign} />
      </div>
    </CommonModal>
  );
};

export default AssignDriverModal;
