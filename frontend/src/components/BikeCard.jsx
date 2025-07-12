import {Link } from 'react-router-dom';

const BikeCard =({bike})=> {
    return (
        <div className='border rounded-2xl shadow-sm p-4 hover:shadow-md transition'>
            <img 
            src={bike.image}
            alt={bike.name}
            className='w-full h-40 object-cover rounded-xl mb-3'
            />
            <h3 className='text-xl font-semibold'>{bike.name}</h3>
            <p className='text-gray-500'>{bike.type} - {bike.model}</p>
            <p className='mt-2 font-bold text-blue-600'>Rs. {bike.price_per_hour}/hrs</p>
            <Link 
            to={`/bikes/${bike.id}`}
            className='inline-block mt-3 text-sm text-white bg-blue-600
            px-4 py-1 rounded-full hover:bg-blue-700'
            >
                View Details
            </Link>
        </div>
    )
}

export default BikeCard;