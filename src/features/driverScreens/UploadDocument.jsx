import React, { useState, useEffect } from 'react';
import './style.css';
import Button from '../../components/shared/buttons/button';
import { Row, Col, Modal } from 'react-bootstrap';
import { RecieptSvg } from '../../svgFiles/RecieptSvg';
import {
    useUpdateTripDocumentsMutation,
    useGetAllTripDocumentsQuery
} from '../../app/driverApi/driverApi';
import { useNavigate, useParams, useLocation } from 'react-router';
import toast from "react-hot-toast";
import { appendFileOrNull } from '../../helpers/Utils';

const UploadDocument = () => {
    const [files, setFiles] = useState({
        fuel: null,
        hotel: null,
        flight: null,
        driverLog: null,
        otherReceipts: [null],
    });
    const { id, driverId } = useParams();
    const location = useLocation();
    const { request_status } = location.state || {};
    const { data: fetchTripDocuments } = useGetAllTripDocumentsQuery({ id, driverId }, { refetchOnMountOrArgChange: true });
    const [notes, setNotes] = useState("");
    const navigate = useNavigate();
    const [updateTripDocuments, { isLoading: isUpdating }] = useUpdateTripDocumentsMutation();
    const [previewFile, setPreviewFile] = useState({ url: null, type: null });

    // Handle file change
    const handleFileChange = (e, type, index = null) => {
        const file = e.target.files[0];
        if (!file) return;
        setFiles(prev => {
            if (type === "otherReceipts" && index !== null) {
                const updatedOthers = [...prev.otherReceipts];
                updatedOthers[index] = file;
                return { ...prev, otherReceipts: updatedOthers };
            }
            return { ...prev, [type]: file };
        });
    };

    const addOtherReceipt = () => {
        setFiles(prev => ({
            ...prev,
            otherReceipts: [...prev.otherReceipts, null],
        }));
    };

    const removeOtherReceiptBlock = (index) => {
        setFiles(prev => ({
            ...prev,
            otherReceipts: prev.otherReceipts.filter((_, i) => i !== index),
        }));
    };

    // Remove only a file from a field
    const removeFile = (type, index = null) => {
        setFiles(prev => {
            if (type === "otherReceipts" && index !== null) {
                const updatedOthers = [...prev.otherReceipts];
                updatedOthers[index] = null;
                return { ...prev, otherReceipts: updatedOthers };
            }
            return { ...prev, [type]: null };
        });
    };

    // Open preview for file or URL
    const openPreview = (file) => {
        if (!file) return;
        if (file instanceof File) {
            setPreviewFile({
                url: URL.createObjectURL(file),
                type: file.type
            });
        } else if (typeof file === "string") {
            const ext = file.split(".").pop()?.toLowerCase();
            let type = "";
            if (ext === "pdf") type = "application/pdf";
            else if (["jpg", "jpeg", "png", "webp"].includes(ext)) type = "image";
            setPreviewFile({
                url: file,
                type
            });
        }
    };

    const closePreview = () => {
        setPreviewFile({ url: null, type: null });
    };

    // Load existing documents
    useEffect(() => {
        if (fetchTripDocuments?.data?.length) {
            const doc = fetchTripDocuments.data[0];
            let otherReceiptsParsed = [];
            try {
                otherReceiptsParsed = JSON.parse(doc.other_receipts || "[]").map(r => r.location);
            } catch (err) {
           
            }
            const mappedFiles = {
                fuel: doc.fuel_receipt || null,
                hotel: doc.hotel_receipt || null,
                flight: doc.flight_confirmation || null,
                driverLog: doc.daily_driver_log || null,
                otherReceipts: otherReceiptsParsed.length ? otherReceiptsParsed : [null],
            };
            setFiles(mappedFiles);
            setNotes(doc.additional_notes || "");
        }
    }, [fetchTripDocuments]);

    // Render upload tile
    const renderTile = (label, file, onChange, removableBlock, onRemoveBlock, onRemoveFile) => (
        <div className="vehiclePhoto uploadDoc position-relative d-flex flex-column justify-content-center align-items-center h-100">
            <input
                type="file"
                accept="image/*,application/pdf"
                onChange={onChange}
                className='render-upload-file'
            />

            <div style={{ zIndex: 2 }}>
                <RecieptSvg />
            </div>

            <p
                className="mb-0 text-black text-center fw-bold"
                style={{
                    cursor: file ? "pointer" : "default",
                    zIndex: 2
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    if (file) openPreview(file);
                }}
            >
                {label}
            </p>

            {file && (
                <div
                    className="d-flex align-items-center justify-content-center upload-file"
                >
                    <small
                        className='upload-file-small'
                        onClick={(e) => {
                            e.stopPropagation();
                            openPreview(file);
                        }}
                    >
                        {file instanceof File ? file.name : (file ? file.split("/").pop() : "")}
                    </small>
                    <span
                        style={{
                            color: "red",
                            cursor: "pointer",
                            fontWeight: "bold"
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemoveFile();
                        }}
                    >
                        ✕
                    </span>
                </div>
            )}

            {removableBlock && (
                <button
                    type="button"
                    className="remove-receipt-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemoveBlock();
                    }}
                >
                    ×
                </button>
            )}
        </div>
    );

    const handleDocuments = async () => {
        try {
            const formData = new FormData();
            formData.append("job_id", id);
            formData.append("driver_id", driverId);
            formData.append("additional_notes", notes);
            appendFileOrNull("fuel_receipt", files.fuel, formData);
            appendFileOrNull("hotel_receipt", files.hotel, formData);
            appendFileOrNull("flight_confirmation", files.flight, formData);
            appendFileOrNull("daily_driver_log", files.driverLog, formData);

            //handle file otherreipts
            if (files.otherReceipts?.length) {
                let hasFile = false;
                files.otherReceipts.forEach((file) => {
                    if (file instanceof File) {
                        formData.append("other_receipts", file);
                        hasFile = true;
                    }
                    else if (file && files.otherReceipts[0] != null) {
                        hasFile = true;
                    }
                });
                const existingOtherReceiptsUrls = files.otherReceipts
                    .filter(f => f && !(f instanceof File))
                    .map(url => ({ location: url }));
                formData.append("existing_other_receipts", JSON.stringify(existingOtherReceiptsUrls));
                if (!hasFile) {
                    formData.append("other_receipts", "null");
                }
            }
            //update trip document
            const res = await updateTripDocuments(formData);
            if (res.data) {
                toast.success(res.data?.message || "Trip documents have been updated");
                if (request_status === "delivered") {
                    navigate(`/delivery-completed/jobId/${id}/driver/${driverId}`)
                }
                else {
                    navigate(`/ride-detail/jobId/${id}/driver/${driverId}`)
                }
            }
        } catch (error) {
            toast.error(error?.data?.message || "Update ride details failed");
        }
    };

    return (
        <div className="mobile_wrapper position-relative d-flex flex-column px-3 pt-3">
            <h3 className="mob-heading mt-1 mb-3">Upload Trip Documents</h3>
            <div className="flex-grow-1 picupForm">
                <Row className="row-gap-2 mb-2">
                    <Col xs={12}>
                    <div className='gird-inputs'>
                        {renderTile("Fuel Receipt", files.fuel, (e) => handleFileChange(e, "fuel"), false, null, () => removeFile("fuel"))}
                        {renderTile("Hotel Receipt", files.hotel, (e) => handleFileChange(e, "hotel"), false, null, () => removeFile("hotel"))}
                        {renderTile("Flight Confirmation", files.flight, (e) => handleFileChange(e, "flight"), false, null, () => removeFile("flight"))}
                        {renderTile("Daily Driver Log", files.driverLog, (e) => handleFileChange(e, "driverLog"), false, null, () => removeFile("driverLog"))}
                    {files.otherReceipts.map((file, idx) => (
                        <div key={idx}>
                            {renderTile(
                                `Other Receipt ${idx + 1}`,
                                file,
                                (e) => handleFileChange(e, "otherReceipts", idx),
                                files.otherReceipts.length > 1,
                                () => removeOtherReceiptBlock(idx),
                                () => removeFile("otherReceipts", idx)
                            )}
                        </div>
                    ))}
                    </div>
                    </Col>
                    
                    <Col xs={12}>
                        <Button
                            label="+ Add Other Receipt"
                            className="rounded w-100 bordered"
                            onClick={addOtherReceipt}
                        />
                    </Col>
                </Row>
                <label htmlFor="damageNotes" className="cmn_label form-label d-block mt-3">
                    Additional Notes
                </label>
                <textarea
                    name="damageNotes"
                    className="form-control"
                    rows={6}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value.toUpperCase())}
                    placeholder="Enter any Additional notes..."
                ></textarea>
            </div>
            <div className="text-center px-0 mt-3 pb-3 d-flex flex-column gap-2">
                <Button
                    label="Back"
                    className="rounded w-100 bordered"
                    onClick={() =>
                        request_status === "delivered"
                            ? navigate(`/delivery-completed/jobId/${id}/driver/${driverId}`)
                            : navigate(`/ride-detail/jobId/${id}/driver/${driverId}`)
                    }
                />
                <Button
                    label={
                        isUpdating ? (
                            <span>
                                <span className="spinner-border spinner-border-sm me-2" /> Submitting...
                            </span>
                        ) : (
                            "Submit"
                        )
                    }
                    className="rounded w-100"
                    disabled={isUpdating}
                    onClick={handleDocuments}
                />
            </div>
            {/* Modal Preview */}
            <Modal show={!!previewFile.url} onHide={closePreview} size="xl" fullscreen centered>
                <Modal.Header closeButton>
                    <Modal.Title>Document Preview</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ padding: 0 }}>
                    {previewFile.type === "application/pdf" ? (
                        <iframe
                            src={previewFile.url}
                            style={{ width: "100%", height: "100vh", border: "none" }}
                            title="PDF Preview"
                        />
                    ) : (
                        <img
                            src={previewFile.url}
                            alt="Preview"
                            style={{ width: "100%", height: "auto", display: "block" }}
                        />
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default UploadDocument;
