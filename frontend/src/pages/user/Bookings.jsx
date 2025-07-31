import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaDollarSign, FaMapMarkerAlt, FaStar, FaCheckCircle, FaTimes, FaPlay, FaStop, FaBan, FaEdit, FaBicycle } from 'react-icons/fa';
import api from '../../api/axios';
import { cancelBooking, startRide, endRide } from '../../api/bookings';
import Spinner from '../../components/Spinner';
import ConfirmationModal from '../../components/ConfirmationModal';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [actionLoading, setActionLoading] = useState({});
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    action: null,
    bookingId: null,
    title: '',
    message: '',
    confirmText: '',
    confirmColor: ''
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchBookings();
    
    // Check for success message from review page
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the state to prevent showing the message again on refresh
      window.history.replaceState({}, document.title);
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    }
  }, [location.state]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get('user/current-bookings/');
      setBookings(response.data);
      setError('');
    } catch (error) {
      setError('Failed to load your current bookings.');
      console.error('Error fetching current bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (bookingId) => {
    setConfirmationModal({
      isOpen: true,
      action: 'cancel',
      bookingId,
      title: 'Cancel Booking',
      message: 'Are you sure you want to cancel this booking?',
      confirmText: 'Yes, Cancel',
      confirmColor: 'bg-red-600 hover:bg-red-700'
    });
  };

  const handleConfirmAction = async () => {
    const { action, bookingId } = confirmationModal;
    
    try {
      setActionLoading(prev => ({ ...prev, [bookingId]: true }));
      
      if (action === 'cancel') {
        await cancelBooking(bookingId);
      } else if (action === 'start') {
        await startRide(bookingId);
      } else if (action === 'end') {
        await endRide(bookingId);
        
        // Find the booking details to pass to review page
        const completedBooking = bookings.find(booking => booking.id === bookingId);
        if (completedBooking) {
          // Navigate to review page with booking data
          navigate('/user/review', { 
            state: { 
              booking: completedBooking,
              fromEndRide: true 
            } 
          });
          return; // Don't refresh bookings since we're navigating away
        }
      }
      
      fetchBookings(); // Refresh the list
    } catch (error) {
      console.error(`Error ${action}ing booking:`, error);
      if (action === 'start') {
        alert('Failed to start ride. Please try again.');
      } else if (action === 'end') {
        alert('Failed to end ride. Please try again.');
      }
    } finally {
      setActionLoading(prev => ({ ...prev, [bookingId]: false }));
      setConfirmationModal({ isOpen: false, action: null, bookingId: null, title: '', message: '', confirmText: '', confirmColor: '' });
    }
  };

  const handleCloseModal = () => {
    setConfirmationModal({ isOpen: false, action: null, bookingId: null, title: '', message: '', confirmText: '', confirmColor: '' });
  };

  const handleStartRide = (bookingId) => {
    setConfirmationModal({
      isOpen: true,
      action: 'start',
      bookingId,
      title: 'Start Ride',
      message: 'Are you ready to start your ride?',
      confirmText: 'Yes, Start',
      confirmColor: 'bg-blue-600 hover:bg-blue-700'
    });
  };

  const handleEndRide = (bookingId) => {
    setConfirmationModal({
      isOpen: true,
      action: 'end',
      bookingId,
      title: 'End Ride',
      message: 'Are you sure you want to end your ride?',
      confirmText: 'Yes, End',
      confirmColor: 'bg-orange-600 hover:bg-orange-700'
    });
  };

  const handleWriteReview = (booking) => {
    // Navigate to dedicated review page with booking data
    navigate('/user/review', { 
      state: { 
        booking: booking,
        fromBookings: true 
      } 
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'in_use':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress':
        return 'bg-amber-100 text-amber-800 border-amber-200';
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
      case 'confirmed':
        return <FaCheckCircle className="w-5 h-5" />;
      case 'in_use':
        return <FaBicycle className="w-5 h-5" />;
      case 'in_progress':
        return <FaClock className="w-5 h-5" />;
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
            onClick={fetchBookings}
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Current Bookings</h1>
          <p className="text-gray-600">Manage your active bike rentals and track your rides</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <FaCheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-green-800 font-medium">{successMessage}</p>
            </div>
          </div>
        )}



        {/* Bookings List */}
        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 text-center">
            <div className="text-6xl mb-4">🚲</div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">
              No Current Bookings
            </h3>
            <p className="text-slate-600 mb-6">
              You don't have any active bookings at the moment. Start your adventure by booking a bike!
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
                    {booking.status.toLowerCase() === 'confirmed' && (
                      <>
                        <button
                          onClick={() => handleStartRide(booking.id)}
                          disabled={actionLoading[booking.id]}
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {actionLoading[booking.id] ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <FaPlay className="w-4 h-4" />
                          )}
                          Start Ride
                        </button>
                        <button
                          onClick={() => handleCancel(booking.id)}
                          disabled={actionLoading[booking.id]}
                          className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {actionLoading[booking.id] ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <FaTimes className="w-4 h-4" />
                          )}
                          Cancel Booking
                        </button>
                      </>
                    )}
                    
                    {booking.status.toLowerCase() === 'in_use' && (
                      <button
                        onClick={() => handleEndRide(booking.id)}
                        disabled={actionLoading[booking.id]}
                        className="bg-orange-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {actionLoading[booking.id] ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <FaStop className="w-4 h-4" />
                        )}
                        End Ride
                      </button>
                    )}
                    
                    {booking.status.toLowerCase() === 'completed' && (
                      <button
                        onClick={() => handleWriteReview(booking)}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors duration-300 flex items-center gap-2"
                      >
                        <FaEdit className="w-4 h-4" />
                        Write Review
                      </button>
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
                to="/bikes"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300"
              >
                Book Another Bike
              </Link>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={confirmationModal.isOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirmAction}
          title={confirmationModal.title}
          message={confirmationModal.message}
          confirmText={confirmationModal.confirmText}
          confirmColor={confirmationModal.confirmColor}
          isLoading={actionLoading[confirmationModal.bookingId]}
        />
      </div>
    </div>
  );
};

export default Bookings;
