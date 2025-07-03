import React from 'react'
import {Link} from 'react-router-dom'
import {LocationMarkerIcon, StarIcon, locationMarkerIcon} from '@heroicons/react/solid'

const BikeCard = ({bike}) => {
  return (
    <>
        <div className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300'>
            <div className='relative pb-2/3 h-48'>
            <img
            src={bike.image}
            alt={bike.model}
            className='absolute h-full w-full object-cover'
            />
            {bike.isFeatured && (
                <div className='absolute top-2 left-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded'>
                    Featured
                </div>
            )}
            </div>

            <div className='p-4'>
                <div className='flex justify-between items-start'>
                    <h3 className='text-lg font-bold'>{bike.model}</h3>
                    <div className='flex items-center'>
                        <StarIcon className='h-5 w-5 text-yellow-400'/>
                        <span className='ml-1'>{bike.rating}</span>
                    </div>
                </div>

                <div className='flex items-center mt-1 text-gray-600'>
                    <LocationMarkerIcon className='h-4 w-4 mr-1'/>
                    <span className='text-sm'>{bike.location}</span>
                </div>

                <div className='mt-3 flex justify-between items-center'>
                    <div>
                        <span className='text-xl font-bold'>Rs. {bike.pricePerDay}</span>

                        <span className='text-gray-500 text-sm'>/day/</span>
                    </div>
                    <Link
                    to={`/bike/${bike._id}`}
                    className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors'>
                        Book Now
                    </Link>
                </div>
            </div>
        </div>
    </>
  )
}

export default BikeCard