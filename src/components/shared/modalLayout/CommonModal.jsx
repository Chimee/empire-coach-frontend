import React from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from '../buttons/button';
import { CancelSvg } from '../../../svgFiles/CancelSvg';
import './commonModal.css'
const CommonModal = ({ children, show, setShow, className, title, headerInfo }) => {
  const handleClose = () => setShow(false);
  return (
    <Modal show={show} onHide={handleClose} setShow={setShow} className={className}>
      <Modal.Header className='border-0'>

        {title && <Modal.Title className='text-center'>{title}</Modal.Title>}
        <Button onClick={handleClose} icon={CancelSvg} className={'bg-white ms-auto'}></Button>
      </Modal.Header>
      <Modal.Body className='p-4'>{children}</Modal.Body>
    </Modal>
  )
}

export default CommonModal