import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getUserBookings } from '../api/axios';
import { CalculatorIcon, ClockIcon, CurrencyDollarIcon } from '@heroicons/react/solid';

const Dashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    const fetchBookings = async ()=>{
      try {
        const response = await getUserBookings();
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }finally{
        setLoading(false);
      }
    }
    fetchBookings();
  },[])

  if(loading){
    return <div className='text-center py-8'>Loading...</div>
  }

  return (
    <>
      <div className='container mx-auto px-4 py-8'>
        <div className='mb-8'>
          <h2 className='text-xl font-semibold mb-4'>Your Bookings</h2>

          {bookings.length === 0 ? (
            <p className='text-gray-600'>You don't have any bookings yet.</p>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {bookings.map((booking) => (
                  <div key={booking._id} className='bg-white p-4 rounded-lg shadow'>
                    <h3 className='font-bold'>{booking.bike.name}</h3>
                    <p className='text-gray-600 mb-2'>{booking.bike.model}</p>

                    <div className='flex items-center text-gray-700 mb-1'>
                        <CalculatorIcon className='h-4 w-4 mr-1'/>
                        <span>
                          {new Date(booking.start_time).toLocaleDateString()} - {new Date(booking.end_time).toLocaleTimeString()}
                        </span>
                    </div>
                    <div className='flex items-center text-gray-700 mb-1'>
                      <ClockIcon className='h-4 w-4 mr-1'/>
                      <span>
                        {new Date(booking.start_time).toLocaleDateString()} to {new Date(booking.end_time).toLocaleTimeString()}
                      </span>
                    </div>

                    <div className='flex items-center text-gray-700 mb-2'>
                      <CurrencyDollarIcon className='h-4 w-4 mr-1'/>
                      <span>Total: Rs. {booking.total_price}</span>
                    </div>

                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800' 
                    : booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'}`}>
                        {booking.status}
                      </span>
                  </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Dashboard