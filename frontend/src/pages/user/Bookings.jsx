import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import { cancelBooking } from '../../api/bookings';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('user/bookings/')
      .then(res => {
        setBookings(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load your bookings.');
        setLoading(false);
      });
  }, []);
  const handleCancel= async (bookingId)=> {
    if(!window.confirm("Are you sure you want to cancel this booking?")) 
      return;
    await cancelBooking(bookingId);
    refreshBookings();
  }

  if (loading) return <Spinner />;
  if (error) return <p className="text-red-500">{error}</p>;

  if (bookings.length === 0) return <p>You have no bookings yet.</p>;

  return (
    <div className="max-w-4xl mx-auto p-2">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
      <table className="w-full border-collapse border border-gray-300 rounded">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Bike</th>
            {/* <th className='border border-gray-300 p-2'>Image</th> */}
            <th className="border border-gray-300 p-2">Start Date</th>
            <th className="border border-gray-300 p-2">End Date</th>
            <th className="border border-gray-300 p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 p-2">{booking.bike}</td>
              {/* <td className='border border-gray-300 p-2'>{booking.image}</td> */}
              <td className="border border-gray-300 p-2">{new Date(booking.start_time).toLocaleString()}</td>
              <td className="border border-gray-300 p-2">{new Date(booking.end_time).toLocaleString()}</td>
              <td className="border border-gray-300 p-2">{booking.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Bookings;
