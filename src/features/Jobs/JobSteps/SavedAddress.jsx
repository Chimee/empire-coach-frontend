import React, { useState, useRef } from 'react'
import { TogglerSvg } from '../../../svgFiles/TogglerSvg'
import { AddressLocationSvg } from '../../../svgFiles/AddressLocationSvg'
import { useGetDeliveryAddressesQuery, useDeleteDeliveryAddressMutation } from '../../../app/customerApi/customerApi'
import useClickOutside from '../../../helpers/Utils'
import ConfirmationModal from '../../../components/shared/modalContent/ConfirmationModal'
const SavedAddress = ({
    addressType,
    onSelectAddress,
}) => {
    const [toggle, setToggle] = useState(null)
    console.log(onSelectAddress, "onSelectAddress");

    const toggleRef = useRef()

    const { data: savedLocations, isLoading, error } = useGetDeliveryAddressesQuery({ addressType })
    const [deleteDeliveryAddress, { isLoading: isDeleting }] = useDeleteDeliveryAddressMutation()
    const [showConfirmationModal, setShowConfirmationModal] = useState(false)
    const [selectedAddressId, setSelectedAddressId] = useState(null)

    useClickOutside(toggleRef, () => setToggle(null))

    const handleToggle = (idx) => {
        setToggle(toggle === idx ? null : idx)
    }
    const confirmDelete = (addressId) => {
        setSelectedAddressId(addressId)
        setShowConfirmationModal(true)
    }

    const handleDeleteAddress = async () => {
        try {
            await deleteDeliveryAddress({ addressId: selectedAddressId }).unwrap()
            setShowConfirmationModal(false)
        } catch (err) {
            alert('Failed to delete address.')
        }
    }

    if (isLoading) return <div>Loading addresses...</div>
    if (error) return <div>Failed to load addresses.</div>

    return (
        <div className="d-flex flex-column gap-3">
            <ConfirmationModal
                show={showConfirmationModal}
                setShow={setShowConfirmationModal}
                handleClose={() => setShowConfirmationModal(false)}
                onConfirm={handleDeleteAddress}
                message="you want to delete this address?" />
            {savedLocations?.data?.data?.length > 0 ? (
                savedLocations.data.data.map((addr, idx) => {
                    const addressId = addr._id || addr.id || idx
                    return (
                        <div className="d-flex gap-3 saved_address align-items-center position-relative" key={addressId}>
                            <AddressLocationSvg className="flex-shrink-0" />
                            <div className="address_wrapper flex-grow-1">
                                <div className="toggle position-absolute">
                                    <TogglerSvg onClick={() => handleToggle(idx)} />
                                    {toggle === idx && (
                                        <div className="toggle_items position-absolute" ref={toggleRef}>
                                            <span className='d-block'>Edit</span>
                                            <span
                                                onClick={() => confirmDelete(addressId)}
                                                className='d-block'
                                            >
                                                {isDeleting ? 'Deleting...' : 'Delete'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                {addr.label && <h3>{addr.label}</h3>}
                                <p
                                    className={addressType}
                                    style={{ cursor: "pointer" }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const mergedAddress = addr?.address;
                                        const mergedLabel = addr?.label;
                                        onSelectAddress(addressType, mergedAddress, mergedLabel);
                                    }}
                                >
                                    {addr.address}
                                </p>
                            </div>
                        </div>
                    )
                })
            ) : (
                <div>No saved addresses found.</div>
            )}

        </div>
    )
}

export default SavedAddress
