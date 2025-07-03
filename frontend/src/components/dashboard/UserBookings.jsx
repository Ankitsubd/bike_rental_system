import React, { useEffect, useState } from 'react'
import Loading from '../common/Loading';

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=> {
    //fetch bookings from django api
    const fetchBookings = async()=> {
      try {
        const response = await fetch('api/user/bookings/');
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }finally{
        setLoading(false);
      }
    };
    fetchBookings();
  },[]);
  if(loading) return <Loading/>
  return (
    <div className='p-6 bg-white rounded-lg shadow-md'>
      <h2 className='text-2xl font-bold mb-6 text-gray-800'>Your Bookings</h2>
      {bookings.length === 0 ? (
        <p className='text-gray-500'>No bookings found.</p>
      ) : (
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  ID 
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Date
                </th>
                 <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Status
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {bookings.map((booking)=>(
                <tr key={booking._id}>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {booking._id}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {new Date(booking.data).toLocaleDateString()}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span className={`px-2 py-1 text-xs rounded-full ${booking.status== 'confirmed' ? 
                      'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
      )}
    </div>
  )
}

export default UserBookings