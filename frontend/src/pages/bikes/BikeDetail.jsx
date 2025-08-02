import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import ConfirmationModal from '../../components/ConfirmationModal';
import { FaCheckCircle, FaClock, FaBicycle, FaStar, FaArrowLeft, FaInfoCircle, FaCog, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCalendarAlt, FaDollarSign, FaComments } from 'react-icons/fa';

const BikeDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingData, setBookingData] = useState({ start_time: '', booked_end_time: '' });
  const [message, setMessage] = useState('');
  const [isAvailable, setIsAvailable] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);

  useEffect(() => {
    fetchBike();
  }, [id]);

  useEffect(() => {
    if (bike) {
      fetchReviews();
    }
  }, [bike]);

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

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const response = await api.get(`reviews/?bike=${id}`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const getMinDateTime = () => {
    const now = new Date();
    const bufferTime = new Date(now.getTime() - 5 * 60 * 1000); // 5 minutes ago
    const localDateTime = new Date(bufferTime.getTime() - bufferTime.getTimezoneOffset() * 60000);
    return localDateTime.toISOString().slice(0, 16);
  };

  const getMaxDateTime = () => {
    const now = new Date();
    const maxTime = new Date(now.getTime() + 36 * 60 * 60 * 1000); // 36 hours from now
    const localDateTime = new Date(maxTime.getTime() - maxTime.getTimezoneOffset() * 60000);
    return localDateTime.toISOString().slice(0, 16);
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!user) {
      setMessage('Please login to book a bike.');
      return;
    }

    if (!bookingData.start_time || !bookingData.booked_end_time) {
      setMessage('Please select both start time and end time.');
      return;
    }

    const startDate = new Date(bookingData.start_time);
    const endDate = new Date(bookingData.booked_end_time);
    const now = new Date();
    const bufferTime = new Date(now.getTime() - 5 * 60 * 1000); // 5 minutes ago
    
    if (startDate < bufferTime) {
      setMessage('Start time cannot be more than 5 minutes in the past.');
      return;
    }

    if (endDate <= startDate) {
      setMessage('End time must be after start time.');
      return;
    }

    try {
      await api.post('book/', { 
        bike: id, 
        start_time: bookingData.start_time,
        booked_end_time: bookingData.booked_end_time
      });
      setBookingData({ start_time: '', booked_end_time: '' });
      setShowBookingSuccess(true);
    } catch (err) {
      if (err.response?.status === 409) {
        setMessage('This bike is already booked for the selected time period. Please choose a different time or bike.');
      } else {
        setMessage('Booking failed: ' + (err.response?.data?.error || 'Try again later.'));
      }
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
                { key: 'reviews', label: 'Reviews', icon: <FaComments className="w-4 h-4" /> },
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

            {activeTab === 'reviews' && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaComments className="w-5 h-5 text-blue-600" />
                  Customer Reviews
                </h3>
                
                {reviewsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading reviews...</p>
                  </div>
                ) : reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {review.user_name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">{review.user_name || 'Anonymous'}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(review.created_at).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, index) => (
                              <FaStar
                                key={index}
                                className={`w-4 h-4 ${
                                  index < review.rating ? 'text-yellow-500' : 'text-gray-300'
                                }`}
                              />
                            ))}
                            <span className="ml-2 text-sm font-semibold text-gray-600">
                              {review.rating}/5
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">💬</div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">No Reviews Yet</h4>
                    <p className="text-gray-600">Be the first to review this bike!</p>
                  </div>
                )}
              </div>
            )}

            {/* Enhanced Booking Form */}
            {isAvailableForBooking ? (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Book This Bike
                </h3>
                <form onSubmit={handleBooking} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <FaCalendarAlt className="w-4 h-4 text-blue-600" />
                      Start Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={bookingData.start_time}
                      onChange={(e) => {
                        setBookingData({ ...bookingData, start_time: e.target.value });
                      }}
                      min={getMinDateTime()}
                      max={getMaxDateTime()}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Select a time within 36 hours from now
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <FaCalendarAlt className="w-4 h-4 text-green-600" />
                      End Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={bookingData.booked_end_time}
                      onChange={(e) => {
                        setBookingData({ ...bookingData, booked_end_time: e.target.value });
                      }}
                      min={bookingData.start_time || getMinDateTime()}
                      max={getMaxDateTime()}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Select when you want to end your ride
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-200">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 font-medium flex items-center gap-2">
                        <FaInfoCircle className="w-4 h-4 text-green-600" />
                        Pricing Information:
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      <p>• Price per hour: <span className="font-semibold">Rs. {bike.price_per_hour}</span></p>
                      <p>• Minimum charge: <span className="font-semibold">1 hour</span></p>
                      <p>• If you end early: Pay for <span className="font-semibold">booked duration</span></p>
                      <p>• If you end late: Pay for <span className="font-semibold">actual duration</span></p>
                      <p>• Final cost calculated when ride ends</p>
                    </div>
                  </div>

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

      {/* Booking Success Confirmation Modal */}
      <ConfirmationModal
        isOpen={showBookingSuccess}
        onClose={() => setShowBookingSuccess(false)}
        onConfirm={() => {
          setShowBookingSuccess(false);
          navigate('/user/bookings');
        }}
        title="🎉 Booking Successful!"
        message="Your booking has been confirmed! Here are the important rules to remember:

• Start and end times cannot be changed once booked
• If you end early: Pay for booked duration
• If you end late: Pay for actual duration
• Minimum charge is 1 hour regardless of actual ride time
• Final cost is calculated when you end your ride
• You can start your ride anytime after your booked start time

Click 'OK' to view your bookings."
        confirmText="OK, Got It!"
        cancelText="Close"
        type="success"
      />
    </div>
  );
};

export default BikeDetail;
