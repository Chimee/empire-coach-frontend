import React, { useState } from 'react';
import CommonModal from '../modalLayout/CommonModal';
import Button from '../buttons/button';
import { Form } from 'react-bootstrap';
import { useGetDriversListQuery, useAssignDriverMutation } from '../../../app/driverApi/driverApi';
import { showToast } from '../../../helpers/Utils';
const AssignDriverModal = ({ show, setShow, jobId }) => {
  const [selectedDriver, setSelectedDriver] = useState('');
  const { data: drivers, isLoading } = useGetDriversListQuery();
  const [assignDriver, { isLoading: isAssigning }] = useAssignDriverMutation();
  debugger;
  console.log(drivers)
  const handleAssign = async () => {
    if (!selectedDriver) return alert('Please select a driver.');
    try {
      const res = await assignDriver({ jobId, driverId: selectedDriver });
     
      setShow(false);
      setSelectedDriver('');
    }
    catch (error) {
      showToast(error?.data?.message || "Assign driver process failed",'error');
    }

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
        {drivers?.data?.data?.map((driver) => (
          <option key={driver.id} value={driver.id}>
            {driver.name}
          </option>
        ))}
      </Form.Select>

      <div className="d-flex justify-content-end gap-2">
        <Button label="Cancel" className="bordered px-4 py-2" onClick={handleClose} />
        <Button disabled={isAssigning} loading={isAssigning} label="Assign" className="px-4 py-2" onClick={handleAssign} />
      </div>
    </CommonModal>
  );
};

export default AssignDriverModal;
