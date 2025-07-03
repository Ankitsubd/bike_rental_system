import React from 'react'
import { useState } from 'react'

const BikeFilters = ({onFilter}) => {
    const [filters, setFilters] = useState({
        bikeType: '',
        priceRange: [0,100],
        location:'',
        features:[]
    })

     const bikeTypes = ['Mountain', 'Road', 'hybrid', 'Electric','City'];
     const bikeFeatures = ['Suspension', 'Disc Brakes', 'Gears', 'Basket'];

     const handleChange =(e)=>{
        const {name,value} = e.target;
        setFilters(prev =>({...prev,[name]:value}))
     }

     const handleFeatureToggle = (feature)=>{
        setFilters(prev=> ({
            ...prev,
            features: prev.features.includes(feature)
            ? prev.features.filter(f=>f !== feature)
            : [...prev.features,feature]
        }))
     }

     const handleSubmit = (e)=>{
        e.preventDefault();
        onFilter(filters);
     }
  return (
    <>
        <div className='bg-white p-4 rounded-lg shadow-md'>
            <h3 className='font-bold text-lg mb-4'>Filter Bikes</h3>
            <form onSubmit={handleSubmit}>
                <div className='mb-4'>
                    <label className='block text-gray-700 mb-2'>Bike Type</label>
                    <select 
                    name='bikeType'
                    value={filters.bikeType}
                    onChange={handleChange}
                    className='w-full p-2 border rounded'
                    >
                        <option value=''>All Types</option>
                        {bikeTypes.map(type=> (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                <div className='mb-4'>
                    <label className='block text-gray-700 mb-2'>
                        Price Range: ${filters.priceRange[0]}- ${filters.priceRange[1]}
                    </label>
                    <div className='flex items-center space-x-4'>
                        <input
                        type='range'
                        min='0'
                        max='100'
                        value={filters.priceRange[1]}
                        onChange={(e)=> setFilters(prev =>({
                            ...prev,
                            priceRange: [prev.priceRange[0], parseInt(e.target.value)]
                        }))}
                        className='w-full'
                        />
                    </div>
                </div>

                <div className='mb-4'>
                    <label className='block text-gray-700 mb-2'>Features</label>
                    <div className='grid grid-cols-2 gap-2'>
                        {bikeFeatures.map(feature => (
                            <label key={feature} className='flex items-center'>
                                <input
                                type='checkbox'
                                checked={filters.features.includes(feature)}
                                onChange={()=> handleFeatureToggle(feature)}
                                className='mr-2'
                                />
                                {feature}
                            </label>
                        ))}
                    </div>
                </div>

                <button 
                    type='submit'
                    className='w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600'>
                        Apply Filters
                    </button>
            </form>
        </div>
    </>
  )
}

export default BikeFilters