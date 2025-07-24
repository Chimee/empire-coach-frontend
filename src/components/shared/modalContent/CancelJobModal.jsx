import React, { useState } from 'react';
import CommonModal from '../modalLayout/CommonModal';
import Button from '../buttons/button';

const CancelConfirmationModal = ({
  show,
  setShow,
  handleClose,
  onConfirm,
  message = "you want to cancel this job? This action cannot be undone.",
  type
}) => {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    if (!reason.trim()) return alert("Please enter a reason for cancellation");
    onConfirm({reason,type});
    setReason('');
  };

  const onClose = () => {
    setReason('');
    handleClose();
  };

  return (
    <CommonModal show={show} setShow={setShow} handleClose={onClose} className="confirmationModal sm-width" title={'Cancel Job'} >
  
      <p className="text-secondary">{`Are you sure ${message}`}</p>

      <label className="fw-semibold mt-3">Reason for Cancellation</label>
      <textarea
        className="form-control mt-1 mb-3"
        rows="4"
        placeholder="Please provide a reason for Cancellation"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />

      <div className="d-flex justify-content-end gap-2 mt-3">
        <Button label="Cancel" className="bordered rounded " onClick={onClose} />
        <Button label="Confirm" className="rounded " onClick={handleConfirm} />
      </div>
    </CommonModal>
  );
};

export default CancelConfirmationModal;
