import React from 'react'
import CommonModal from '../modalLayout/CommonModal'
import Button from '../buttons/button'
const ConfirmationModal = ({show,handleClose,setShow,onConfirm,message}) => {
  return (
    <CommonModal setShow={setShow} show={show} handleClose={handleClose} className={'confirmationModal sm-width'}>
      <h1>Are you sure <br/>{message}</h1>
      <div className='d-flex justify-content-center gap-3'>
            <Button label="Cancel" className={'bordered rounded w-100'} onClick={handleClose}/>
      <Button label="Confirm" className={'rounded w-100'} onClick={onConfirm}/>
      </div>
    </CommonModal>
  )
}

export default ConfirmationModal