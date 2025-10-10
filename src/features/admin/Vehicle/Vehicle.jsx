import React, { useState, useEffect } from 'react';
import PageHead from '../../../components/shared/pageHead/PageHead';
import { Col, Row } from 'react-bootstrap';
import { useGetVehicleQuery, useUpdateVehicleMutation } from '../../../app/settingApi/settingApi';
import { FiEdit } from "react-icons/fi";
import carImage from '../../../images/car.png';
import Image from 'react-bootstrap/Image';
import './vehicle.css';
import { showToast } from '../../../helpers/Utils';
import Button from '../../../components/shared/buttons/button'
import { CiTrash } from "react-icons/ci";
import { useNavigate } from 'react-router';
const Vehicle = () => {
    const navigate = useNavigate()
    const { data: vehiclesData } = useGetVehicleQuery();
    const [updateVehicle, { isloading: isUpdating }] = useUpdateVehicleMutation();
    const vehicles = vehiclesData?.data || [];

    const [selectedMakeId, setSelectedMakeId] = useState(null);
    const [editMakeId, setEditMakeId] = useState(null);
    const [editMakeName, setEditMakeName] = useState('');
    const [editModels, setEditModels] = useState([]);

    useEffect(() => {
        if (vehicles.length > 0 && selectedMakeId === null) {
            setSelectedMakeId(vehicles[0].id);
        }
    }, [vehicles, selectedMakeId]);

    const selectedVehicle = vehicles.find(v => v.id === selectedMakeId) || {};

    const models = Array.isArray(selectedVehicle.models)
        ? selectedVehicle.models.flatMap(m => {
            if (typeof m === 'string') return m.includes(',') ? m.split(',') : [m];
            if (typeof m === 'object' && m?.name) return [m.name];
            return [];
        }).map(m => m.trim())
        : [];

    const startEdit = (make) => {
        setEditMakeId(make.id);
        setEditMakeName(make.make);
        const normalizedModels = Array.isArray(make.models)
            ? make.models.flatMap(m => {
                if (typeof m === 'string') return m.split(',');
                if (typeof m === 'object' && m?.name) return [m.name];
                return [];
            }).map(m => m.trim())
            : [];
        setEditModels(normalizedModels);
    };

    const addModelField = () => {
        // Check if there is at least one empty field
        if (editModels.length > 0 && editModels[editModels.length - 1].trim() === '') {
            showToast('Please fill the previous model before adding a new one.', "error");
            return;
        }

        setEditModels([...editModels, '']);
    };

    const removeModelField = (idx) => {
        setEditModels(editModels.filter((_, index) => index !== idx));
    };

    const handleModelChange = (value, idx) => {
        const newModels = [...editModels];
        newModels[idx] = value;
        setEditModels(newModels);
    };

    const handleSave = () => {
        const body = {
            id: editMakeId,
            make: editMakeName,
            models: editModels.filter(m => m.trim() !== '')
        };
        updateVehicle({ body });
        setEditMakeId(null);
    };

    return (
        <div>
            <PageHead
                title="Settings"
                description="Overview of all transport operations"
                addTitle="Add Vehicle"
                addDescritpion="Add a new Vehicle"
                onClick={() => { navigate("/setting/add-vehicle") }}
            />

            <Row>
                <Col lg={3}>
                    <div className="vehicles-wraper">
                        <h3>Make</h3>
                        <ul className="p-0 d-flex flex-column gap-3">
                            {vehicles.map(item => (
                                <li
                                    key={item.id}
                                    className={`${item.id === selectedMakeId ? 'modalActive carmodal' : 'carmodal'} d-flex align-items-center gap-3 cursor-pointer`}
                                    onClick={() => setSelectedMakeId(item.id)}
                                >
                                    <Image src={carImage} alt="Car" />
                                    <span className="flex-grow-1">{item.make}</span>
                                    <div
                                        className="make-icon py-1 px-2"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            startEdit(item);
                                            setSelectedMakeId(item.id)
                                        }}
                                    >
                                        <FiEdit size={16} />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </Col>

                <Col lg={9}>
                    <div className="vehicles-wraper">
                        <h3>Model</h3>
                        <ul className="p-0 d-flex flex-column gap-2">
                            {models.length > 0
                                ? models.map((model, index) => <li key={index} className="car-modal">{model.toUpperCase()}</li>)
                                : <li className="text-muted">No models available</li>
                            }
                        </ul>
                    </div>
                </Col>
            </Row>

            {editMakeId && (
                <div className="edit-vehicle mt-4">
                    <h5 className='mb-3'>Edit Vehicle make and model</h5>
                    <Row>
                        <Col lg={3}>
                            <div className="vehicles-wraper">
                                <h3>Edit Make</h3>
                                <input
                                    className="w-100 mb-2 cmn_input form-control"
                                    value={editMakeName.toUpperCase()}
                                    onChange={(e) => setEditMakeName(e.target.value)}
                                />
                            </div>
                        </Col>

                        <Col lg={9}>
                            <div className="vehicles-wraper">
                                <h3>Edit Models</h3>
                                <ul className="p-0 d-flex flex-column gap-2">
                                    {editModels.map((model, idx) => (
                                        <div key={idx} className="d-flex gap-2 align-items-center">
                                            <input
                                                className="w-100 mb-0 cmn_input form-control"
                                                value={model.toUpperCase()}
                                                onChange={(e) => handleModelChange(e.target.value, idx)}
                                                placeholder='Add New Model'
                                            />
                                            {editModels.length > 1 && <CiTrash className='text-danger cursor-pointer' size={24} onClick={() => removeModelField(idx)} />}
                                        </div>
                                    ))}
                                </ul>
                                <Button label="+ Add Model" onClick={addModelField} className="mt-2 rounded" />
                            </div>
                        </Col>
                    </Row>
                    <div className="mt-3 text-end">
                        <Button className='rounded' label="Update" loading={isUpdating} disabled={isUpdating} onClick={handleSave} />
                        <Button className='rounded ms-3' label="Cancel" onClick={() => setEditMakeId(null)} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Vehicle;
