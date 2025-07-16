import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import useAuth from '../../hooks/useAuth';

const BikeDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingData, setBookingData] = useState({ start_time: '', end_time: '' });
  const [message, setMessage] = useState('');
  const [price, setPrice] = useState(0);

  useEffect(() => {
    api.get(`bikes/${id}/`)
      .then(res => {
        setBike(res.data);
        setError('');
      })
      .catch(() => setError('Failed to load bike details'))
      .finally(() => setLoading(false));
  }, [id]);

  const calculatePrice = (start, end) => {
    if (!start || !end) return 0;
    const startTime = new Date(start);
    const endTime = new Date(end);
    if (endTime < startTime) return 0;
    const diffMs = endTime - startTime;
    const diffHours = diffMs / (1000 * 60 * 60);
    return Math.ceil(diffHours) * bike.price_per_hour;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    const newBookingData = { ...bookingData, [name]: value };
    setBookingData(newBookingData);
    if (name === 'start_time' || name === 'end_time') {
      setPrice(calculatePrice(newBookingData.start_time, newBookingData.end_time));
    }
  };

  const handleBooking = async e => {
    e.preventDefault();

    if (!user) {
      setMessage('Please login to book a bike.');
      return;
    }

    if (!bookingData.start_time || !bookingData.end_time) {
      setMessage('Please select both start and end times.');
      return;
    }

    const startDate = new Date(bookingData.start_time);
    const endDate = new Date(bookingData.end_time);
    if (endDate < startDate) {
      setMessage('End time cannot be before start time.');
      return;
    }

    try {
      await api.post('book/', { bike: id, ...bookingData });
      setMessage('Booking successful!');
    } catch (err) {
      setMessage('Booking failed: ' + (err.response?.data?.error || 'Try again later.'));
    }
  };

  if (loading) return <Spinner />;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!bike) return null;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <img src={bike.image} alt={bike.name} className="w-full h-64 object-cover rounded-lg mb-4" />
      <h1 className="text-3xl font-bold mb-2">{bike.name}</h1>
      <p className="text-gray-700 mb-2">{bike.type} - {bike.model}</p>
      <p className="font-semibold text-blue-600 mb-4">Rs. {bike.price_per_hour} / hour</p>
      <p className="mb-6">{bike.description}</p>

      <form onSubmit={handleBooking} className="max-w-md space-y-4">
        <h2 className="text-xl font-semibold">Book this Bike</h2>
        <label className="block">
          Start Time:
          <input
            type="datetime-local"
            name="start_time"
            value={bookingData.start_time}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded mt-1"
            min={new Date().toISOString().slice(0, 16)}
          />
        </label>
        <label className="block">
          End Time:
          <input
            type="datetime-local"
            name="end_time"
            value={bookingData.end_time}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded mt-1"
            min={bookingData.start_time || new Date().toISOString().slice(0, 16)}
          />
        </label>

        <p className="text-lg font-semibold">
          Total Price: <span className="text-blue-500">Rs. {price}</span>
        </p>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Book Now
        </button>
      </form>

      {message && (
        <p className={`mt-4 font-semibold ${message.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default BikeDetail;
