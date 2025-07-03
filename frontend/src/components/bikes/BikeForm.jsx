import React, { useState } from 'react'
import { useNavigate} from 'react-router-dom'
import {BikesAPI} from '../../api/bikes'

const BikeForm = ({bike}) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState(bike || {
        model:'',
        bikeType:'',
        pricePerDay:'',
        location:'',
        description:'',
        features:[],
        image:null
    })

    const [previewImage,setPreviewImage] = useState(bike?.image || '');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const bikeTypes = ['Mountain','Road','Hybrid','Electric','City'];
    const availableFeatures = ['Suspension','Disc Brakes', 'Gears', 'Basket'];

    const handleChange = (e)=>{
        const {name, value} = e.target;
        setFormData(prev => ({...prev,[name]:value}));
    }

    const handleFeatureToggle =(feature) => {
        setFormData(prev =>({
            ...prev,
            features:prev.features.includes(feature)
            ? prev.features.filter(f => f !== feature)
            : [...prev.features,feature]
        }))
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if(file){
            setFormData(prev => ({...prev,image:file}));
            setPreviewImage(URL.createObjectURL(file));
        }
    }

    const handleSubmit = async(e)=>{
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const formPayload= new FormData();
            Object.keys(formData).forEach(key => {
                if(key === 'features'){
                    formData[key].forEach(feature => formPayload.append('features',feature))
                }else if(formData[key]!== null){
                    formPayload.append(key,formData[key]);
                }
            })

            if(bike){
                await BikesAPI.updateBike(bike._id, formPayload);
            }else{
                await BikesAPI.createBike(formPayload);
            }
            navigate('/bikes');
        } catch (err) {
            setError(err.message || 'failed to save bike');
        }finally{
            setIsLoading(false);
        }
    }
  return (
    <>
        <div className='max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md'>
            <h2 className='text-2xl font-bold mb-6'>
                {bike? 'Edit Bike' : 'Add New Bike'}
            </h2>

            {error && (
                <div className='mb-4 p-3 bg-red-100 text-red-700 rounded'>
                    {error}
                </div>    
            )}

            <form onSubmit={handleSubmit}>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                    <div>
                        <label className='block text-gray-700 mb-2'>Model</label>
                        <input
                            type='text'
                            name='model'
                            value={formData.model}
                            onChange={handleChange}
                            required
                            className='w-full p-2 border rounded'
                        />
                    </div>
                    
                    <div>
                        <label className='block text-gray-700 mb-2'>Bike Type</label>
                        <select
                            name='bikeType'
                            value={formData.bikeType}
                            onChange={handleChange}
                            required
                            className='w-full p-2 border rounded'
                        >
                            <option value=''>Select Type</option>
                            {bikeTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                    <div>
                        <label className='block text-gray-700 mb-2'>Price Per Day (Rs.)</label>
                        <input
                        type='number'
                        name='pricePerDay'
                        value={formData.pricePerDay}
                        onChange={handleChange}
                        min='1'
                        required
                        className='w-full p-2 border rounded'
                        />
                    </div>

                    <div>
                        <label className='block text-gray-700 mb-2'>Location</label>
                        <input
                        type='text'
                        name='location'
                        value={formData.location}
                        onChange={handleChange}
                        required
                        className='w-full  p-2 border rounded'
                        />
                    </div>
                </div>

                <div className='mb-4'>
                    <label className='block text-gray-700 mb-2'>Description</label>
                    <textarea
                    name='description'
                    value={formData.description}
                    onChange={handleChange}
                    rows='3'
                    className='w-full p-2 border rounded'
                    />
                </div>

                <div className='mb-4'>
                    <label className='block text-gray-700 mb-2'>Features</label>
                    <div className='grid grid-cols-2 gap-2'>
                        {availableFeatures.map(feature => (
                            <label key={feature} className='flex items-center'>
                                <input 
                                    type='checkbox'
                                    checked={formData.features.includes(feature)}
                                    onChange={()=> handleFeatureToggle(feature)}
                                />
                                {feature}
                            </label>
                        ))}
                    </div>
                </div>

                <div className='mb-6'>
                    <label className='block text-gray-700 mb-2'>Bike Image</label>
                    {previewImage && (
                        <img 
                        src={previewImage}
                        alt='Preview'
                        className='h-32 w-auto mb-2 object-cover rounded'
                        />
                    )}
                    <input
                    type='file'
                    accept='image/*'
                    onChange={handleImageChange}
                    className='w-full'
                    />
                </div>

                <button
                type='submit'
                disabled={isLoading}
                className='w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50'>
                    {isLoading ? 'Saving...' : 'Save Bike'}
                </button>

            </form>
        </div>
    </>
  )
}

export default BikeForm