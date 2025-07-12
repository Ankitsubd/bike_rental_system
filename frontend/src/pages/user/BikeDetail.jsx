import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import useAuth from '../../hooks/useAuth';

const BikeDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingData, setBookingData] = useState({ start_date: '', end_date: '' });
  const [bookingMessage, setBookingMessage] = useState('');

  useEffect(() => {
    api.get(`bikes/${id}/`)
      .then(res => {
        setBike(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load bike details');
        setLoading(false);
      });
  }, [id]);

  const handleChange = e => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };

  const handleBooking = async e => {
    e.preventDefault();
    if (!user) {
      setBookingMessage('Please login to book a bike.');
      return;
    }
    try {
      await api.post('bookings/', { bike: id, ...bookingData });
      setBookingMessage('Booking successful!');
    } catch (err) {
      setBookingMessage('Booking failed: ' + (err.response?.data?.detail || 'Try again later.'));
    }
  };

  if (loading) return <Spinner />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto">
      <img src={bike.image} alt={bike.name} className="w-full h-64 object-cover rounded-xl mb-4" />
      <h2 className="text-3xl font-bold mb-2">{bike.name}</h2>
      <p className="mb-1 text-gray-600">{bike.type} - {bike.model}</p>
      <p className="mb-4 font-semibold text-blue-600">Rs. {bike.price_per_hour}/hour</p>
      <p className="mb-6">{bike.description}</p>

      <form onSubmit={handleBooking} className="space-y-4 max-w-md">
        <h3 className="text-xl font-semibold mb-2">Book this bike</h3>
        <label className="block">
          Start Date
          <input
            type="date"
            name="start_date"
            value={bookingData.start_date}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded mt-1"
          />
        </label>
        <label className="block">
          End Date
          <input
            type="date"
            name="end_date"
            value={bookingData.end_date}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded mt-1"
          />
        </label>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Book Now
        </button>
        {bookingMessage && (
          <p className={`mt-2 ${bookingMessage.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
            {bookingMessage}
          </p>
        )}
      </form>
    </div>
  );
};

export default BikeDetail;
