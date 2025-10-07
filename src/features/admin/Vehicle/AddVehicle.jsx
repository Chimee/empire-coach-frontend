import React, { useState } from 'react';
import Breadcrumb from '../../../components/shared/breadcrumb/Breadcrumb';
import { AddSvg } from '../../../svgFiles/AddSvg';
import InputWithLabel from '../../../components/shared/fields/InputWithLabel';
import Button from '../../../components/shared/buttons/button';
import { useCreateVehicleMutation } from '../../../app/settingApi/settingApi';
import { showToast } from '../../../helpers/Utils';
import { useNavigate } from 'react-router';
const AddVehicle = () => {
    const navigate = useNavigate();
    const breadcrumbItems = [
        { name: 'Settings', path: '/setting' },
        { name: 'Create Vehicle' },
    ];

    const [make, setMake] = useState('');
    const [models, setModels] = useState(['']);
    const [createVehicle] = useCreateVehicleMutation();

    const handleModelChange = (value, idx) => {
        const updated = [...models];
        updated[idx] = value;
        setModels(updated);
    };

    const addModelField = () => {
        if (models[models.length - 1].trim() === '') {
            showToast('Please fill the previous model before adding a new one.', "error");
            return;
        }
        setModels([...models, '']);
    };

    const handleSave = async () => {
        if (!make.trim()) {
            showToast('Please enter make.', "error");
            return;
        }
        const filteredModels = models.filter(m => m.trim() !== '');
        if (filteredModels.length === 0) {
            showToast('Please add at least one model.', 'error');
            return;
        }

        const body = {
            make: make.trim(),
            models: filteredModels
        };

        try {
            await createVehicle({ body });
            setMake('');
            setModels(['']);
            navigate('/setting')
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <Breadcrumb
                items={breadcrumbItems}
                title={'Admin'}
                description={'Overview of all transport operations'}
            />
            <div className='form-frame'>
                <div className='AddForm mt-5'>
                    <h2 className='d-flex gap-2 align-items-center'>
                        <AddSvg /> {'Create Vehicle'}
                    </h2>
                    <div className='form-card mt-4'>
                        <InputWithLabel
                            label='Make'
                            placeholder='Make Label'
                            type='text'
                            value={make}
                            onChange={(e) => setMake(e.target.value.toUpperCase())}
                        />

                        <div className="mt-3">
                            {models.map((model, idx) => (
                                <div key={idx} className="mb-2">
                                    <InputWithLabel
                                        label={idx === 0 ? 'Model' : `Model ${idx + 1}`}
                                        placeholder='Model Label'
                                        type='text'
                                        value={model}
                                        onChange={(e) => handleModelChange(e.target.value.toUpperCase(), idx)}
                                    />
                                </div>
                            ))}
                        </div>

                        <Button
                            label={"Add Model"}
                            onClick={addModelField}
                        />
                    </div>
                </div>
                <div className='d-flex gap-3 justify-content-end mt-4'>
                    <Button
                        label={"Save"}
                        onClick={handleSave}
                    />
                </div>
            </div>
        </>
    );
};

export default AddVehicle;
