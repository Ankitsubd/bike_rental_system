import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaDollarSign, FaMapMarkerAlt, FaStar, FaCheckCircle, FaTimes, FaArrowLeft } from 'react-icons/fa';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';

const RentalHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchRentalHistory();
  }, []);

  const fetchRentalHistory = async () => {
    try {
      setLoading(true);
      const response = await api.get('user/rental-history/');
      setBookings(response.data);
      setError('');
    } catch (error) {
      setError('Failed to load your rental history.');
      console.error('Error fetching rental history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <FaCheckCircle className="w-5 h-5" />;
      case 'cancelled':
        return <FaTimes className="w-5 h-5" />;
      default:
        return <FaClock className="w-5 h-5" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateDuration = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end - start;
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
    return diffHours;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Oops!</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <button
            onClick={fetchRentalHistory}
            className="bg-sky-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-sky-700 transition-colors duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/user/profile')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 transition-colors"
          >
            <FaArrowLeft className="w-4 h-4" />
            Back to Profile
          </button>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Rental History</h1>
          <p className="text-gray-600">View your completed and cancelled bike rentals</p>
        </div>

        {/* Rental History List */}
        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">No Rental History</h3>
            <p className="text-slate-600 mb-6">
              You haven't completed any rentals yet. Start your journey by booking a bike!
            </p>
            <Link
              to="/bikes"
              className="inline-block bg-sky-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-sky-700 transition-colors duration-300"
            >
              Browse Bikes
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">{getStatusIcon(booking.status)}</div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-800">
                          {booking.bike_name || 'Bike Rental'}
                        </h3>
                        <p className="text-slate-600">
                          Booking #{booking.id}
                        </p>
                      </div>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold border flex items-center gap-2 ${getStatusColor(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      {booking.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-slate-50 rounded-xl p-4">
                      <p className="text-sm text-slate-600 mb-1">Start Time</p>
                      <p className="font-semibold text-slate-800">{formatDate(booking.start_time)}</p>
                    </div>
                    
                    <div className="bg-slate-50 rounded-xl p-4">
                      <p className="text-sm text-slate-600 mb-1">End Time</p>
                      <p className="font-semibold text-slate-800">{formatDate(booking.end_time)}</p>
                    </div>
                    
                    <div className="bg-slate-50 rounded-xl p-4">
                      <p className="text-sm text-slate-600 mb-1">Duration</p>
                      <p className="font-semibold text-slate-800">
                        {calculateDuration(booking.start_time, booking.end_time)} hours
                      </p>
                    </div>
                    
                    <div className="bg-slate-50 rounded-xl p-4">
                      <p className="text-sm text-slate-600 mb-1">Total Price</p>
                      <p className="font-semibold text-sky-600">
                        Rs. {booking.total_price || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    {booking.status.toLowerCase() === 'completed' && (
                      <Link
                        to={`/user/review`}
                        state={{ booking: booking }}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors duration-300 flex items-center gap-2"
                      >
                        <FaStar className="w-4 h-4" />
                        Write Review
                      </Link>
                    )}
                    
                    <Link
                      to={`/bikes/${booking.bike}`}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300"
                    >
                      View Bike Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        {bookings.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/user/bookings"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300"
              >
                View Current Bookings
              </Link>
              <Link
                to="/bikes"
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors duration-300"
              >
                Book Another Bike
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RentalHistory; 