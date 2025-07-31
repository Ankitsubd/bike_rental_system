import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import { FaCheckCircle, FaClock, FaBicycle, FaStar, FaArrowLeft, FaInfoCircle, FaCog, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCalendarAlt, FaDollarSign } from 'react-icons/fa';

const BikeDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingData, setBookingData] = useState({ start_time: '', end_time: '' });
  const [price, setPrice] = useState(0);
  const [message, setMessage] = useState('');
  const [isAvailable, setIsAvailable] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    fetchBike();
  }, [id]);

  const fetchBike = async () => {
    try {
      setLoading(true);
      const response = await api.get(`bikes/${id}/`);
      setBike(response.data);
      setIsAvailable(response.data.status === 'available');
      setError('');
    } catch (error) {
      setError('Failed to load bike details.');
      console.error('Error fetching bike:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePrice = (start, end) => {
    if (!start || !end) {
      setPrice(0);
      return;
    }
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffHours = Math.ceil((endDate - startDate) / (1000 * 60 * 60));
    const calculatedPrice = diffHours * bike.price_per_hour;
    setPrice(calculatedPrice);
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setMessage('');

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
      setBookingData({ start_time: '', end_time: '' });
      setPrice(0);
    } catch (err) {
      setMessage('Booking failed: ' + (err.response?.data?.error || 'Try again later.'));
    }
  };

  // Status configuration
  const getStatusConfig = (status) => {
    const configs = {
      'available': {
        label: 'Available',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        icon: <FaCheckCircle className="w-5 h-5" />,
        badgeColor: 'bg-green-100 text-green-800',
        pulse: 'animate-pulse'
      },
      'booked': {
        label: 'Booked',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        icon: <FaClock className="w-5 h-5" />,
        badgeColor: 'bg-orange-100 text-orange-800',
        pulse: ''
      },
      'in_use': {
        label: 'In Use',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        icon: <FaBicycle className="w-5 h-5" />,
        badgeColor: 'bg-blue-100 text-blue-800',
        pulse: 'animate-bounce'
      }
    };
    return configs[status] || configs['available'];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bike details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            to="/bikes"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
          >
            Back to Bikes
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(bike.status);
  const isAvailableForBooking = isAvailable;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-4 transition-all duration-300 transform hover:scale-105"
          >
            <FaArrowLeft className="w-4 h-4" />
            Back to Bikes
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2 animate-fade-in">{bike.name}</h1>
              <p className="text-xl text-gray-600">
                {bike.brand} - {bike.model}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Enhanced Bike Image */}
          <div className="relative group">
            {bike.image ? (
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img 
                  src={bike.image}
                  alt={bike.name}
                  className="w-full h-96 object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
              </div>
            ) : (
              <div className="w-full h-96 bg-gradient-to-br from-blue-100 via-blue-200 to-purple-200 rounded-2xl shadow-2xl flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                <FaBicycle className="w-32 h-32 text-blue-400 transition-all duration-500 group-hover:scale-125 group-hover:rotate-12" />
              </div>
            )}

            {/* Enhanced Status Badge - Fixed z-index and visibility */}
            <div className={`absolute top-4 right-4 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${statusConfig.badgeColor} backdrop-blur-sm transition-all duration-300 group-hover:scale-110 shadow-lg z-20 ${statusConfig.pulse}`}>
              {statusConfig.icon}
              {statusConfig.label}
            </div>

            {/* Enhanced Price Badge - Fixed z-index and visibility */}
            <div className="absolute top-4 left-4 px-4 py-2 rounded-full text-sm font-semibold bg-white/90 backdrop-blur-sm text-blue-600 shadow-md transition-all duration-300 group-hover:scale-110 z-20">
              Rs. {bike.price_per_hour}/hr
            </div>

            {/* Rating Badge - Fixed z-index and visibility */}
            <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800 backdrop-blur-sm shadow-md z-20">
              <div className="flex items-center gap-1">
                <FaStar className="w-4 h-4" />
                4.5
              </div>
            </div>
          </div>

          {/* Enhanced Bike Details */}
          <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6">
              {[
                { key: 'details', label: 'Details', icon: <FaInfoCircle className="w-4 h-4" /> },
                { key: 'specs', label: 'Specifications', icon: <FaCog className="w-4 h-4" /> },
                { key: 'contact', label: 'Contact', icon: <FaPhone className="w-4 h-4" /> }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === tab.key
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'details' && (
              <div className="space-y-6">
                {/* Enhanced Status Information */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Status Information
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Current Status:</span>
                    <div className="flex items-center gap-2">
                      <div className="transition-all duration-300 hover:scale-110">
                        {statusConfig.icon}
                      </div>
                      <span className={`font-semibold ${statusConfig.color}`}>
                        {statusConfig.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Enhanced Specifications */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Specifications
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <FaBicycle className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-600">Brand:</span>
                      <span className="font-semibold">{bike.brand}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <FaCog className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-600">Model:</span>
                      <span className="font-semibold">{bike.model}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <FaInfoCircle className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-600">Type:</span>
                      <span className="font-semibold">{bike.bike_type}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Technical Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                    <h4 className="font-semibold text-gray-800 mb-2">Performance</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• High-quality frame construction</li>
                      <li>• Smooth gear shifting</li>
                      <li>• Responsive braking system</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
                    <h4 className="font-semibold text-gray-800 mb-2">Features</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Comfortable seating</li>
                      <li>• Adjustable handlebars</li>
                      <li>• LED lighting system</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <FaPhone className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-semibold">{bike.phone_number || '+977 9841234567'}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <FaEnvelope className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-600">Email:</span>
                    <span className="font-semibold">rentbike@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <FaMapMarkerAlt className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-600">Location:</span>
                    <span className="font-semibold">Chitwan, Nepal</span>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Booking Form */}
            {isAvailableForBooking ? (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Book This Bike
                </h3>
                <form onSubmit={handleBooking} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <FaCalendarAlt className="w-4 h-4 text-blue-600" />
                        Start Time
                      </label>
                      <input
                        type="datetime-local"
                        value={bookingData.start_time}
                        onChange={(e) => {
                          setBookingData({ ...bookingData, start_time: e.target.value });
                          calculatePrice(e.target.value, bookingData.end_time);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <FaCalendarAlt className="w-4 h-4 text-blue-600" />
                        End Time
                      </label>
                      <input
                        type="datetime-local"
                        value={bookingData.end_time}
                        onChange={(e) => {
                          setBookingData({ ...bookingData, end_time: e.target.value });
                          calculatePrice(bookingData.start_time, e.target.value);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        required
                      />
                    </div>
                  </div>

                  {price > 0 && (
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 font-medium flex items-center gap-2">
                          <FaDollarSign className="w-4 h-4 text-blue-600" />
                          Total Price:
                        </span>
                        <span className="text-2xl font-bold text-blue-600">Rs. {price}</span>
                      </div>
                    </div>
                  )}

                  {message && (
                    <div className={`p-4 rounded-xl transition-all duration-300 ${
                      message.includes('successful') ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                      {message}
                    </div>
                  )}

    <button
      type="submit"
                    className="w-full bg-green-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-300 border border-green-600 shadow-lg"
    >
      Book Now
    </button>
  </form>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 text-center">
                <div className="text-6xl mb-4 animate-pulse">🚫</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Currently Unavailable</h3>
                <p className="text-gray-600">
                  This bike is not available for booking at the moment.
                </p>
  </div>
)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BikeDetail;
