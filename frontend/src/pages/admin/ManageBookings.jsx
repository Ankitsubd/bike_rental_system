import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('bookings/')
      .then(res => {
        setBookings(res.data);
        setError('');
      })
      .catch(() => {
        setError('Failed to load bookings.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Bookings</h1>
      <table className="w-full border-collapse border border-gray-300 rounded">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">User</th>
            <th className="border border-gray-300 p-2">Bike</th>
            <th className="border border-gray-300 p-2">Start Date</th>
            <th className="border border-gray-300 p-2">End Date</th>
            <th className="border border-gray-300 p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => (
            <tr key={b.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 p-2">{b.user.email}</td>
              <td className="border border-gray-300 p-2">{b.bike.name}</td>
              <td className="border border-gray-300 p-2">{b.start_date}</td>
              <td className="border border-gray-300 p-2">{b.end_date}</td>
              <td className="border border-gray-300 p-2">{b.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageBookings;
