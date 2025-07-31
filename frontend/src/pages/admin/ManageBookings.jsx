import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter states
  const [filters, setFilters] = useState({
    status: '',
    user: '',
    bike: '',
    dateFrom: '',
    dateTo: '',
    priceMin: '',
    priceMax: ''
  });
  
  // Mobile responsive states
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [bookings, filters]);

  const fetchBookings = async () => {
    try {
      const res = await api.get('admin/bookings/');
      setBookings(res.data.results || res.data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...bookings];

    if (filters.status) {
      filtered = filtered.filter(booking => booking.status === filters.status);
    }

    if (filters.user) {
      filtered = filtered.filter(booking => 
        booking.user?.username?.toLowerCase().includes(filters.user.toLowerCase()) ||
        booking.user?.email?.toLowerCase().includes(filters.user.toLowerCase())
      );
    }

    if (filters.bike) {
      filtered = filtered.filter(booking => 
        booking.bike?.name?.toLowerCase().includes(filters.bike.toLowerCase()) ||
        (booking.bike?.brand + ' ' + booking.bike?.model)?.toLowerCase().includes(filters.bike.toLowerCase())
      );
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(booking => 
        new Date(booking.start_time) >= new Date(filters.dateFrom)
      );
    }

    if (filters.dateTo) {
      filtered = filtered.filter(booking => 
        new Date(booking.start_time) <= new Date(filters.dateTo)
      );
    }

    if (filters.priceMin) {
      filtered = filtered.filter(booking => 
        booking.total_price >= parseFloat(filters.priceMin)
      );
    }

    if (filters.priceMax) {
      filtered = filtered.filter(booking => 
        booking.total_price <= parseFloat(filters.priceMax)
      );
    }

    setFilteredBookings(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      user: '',
      bike: '',
      dateFrom: '',
      dateTo: '',
      priceMin: '',
      priceMax: ''
    });
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await api.patch(`admin/bookings/${bookingId}/update/`, {
        status: newStatus
      });
      fetchBookings(); // Refresh the list
    } catch (err) {
      console.error('Error updating booking:', err);
      alert('Failed to update booking status');
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    
    try {
      await api.delete(`admin/bookings/${bookingId}/delete/`);
      fetchBookings(); // Refresh the list
    } catch (err) {
      console.error('Error deleting booking:', err);
      alert('Failed to delete booking');
    }
  };

  if (loading) return <Spinner />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-white to-purple-50/50 border border-purple-200/40 rounded-3xl shadow-xl p-6 md:p-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4 md:space-x-6">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-100 to-violet-100 rounded-2xl flex items-center justify-center border border-purple-200/50 shadow-lg">
              <span className="text-purple-600 text-2xl md:text-4xl">📋</span>
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Manage Booking
              </h1>
              <p className="text-lg md:text-xl text-purple-600 font-medium">👁️ View All Bookings and manage reservations</p>
            </div>
          </div>
          
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden bg-gradient-to-r from-purple-500 to-violet-500 text-white px-4 py-2 rounded-xl font-medium"
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className={`bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6 ${showFilters ? 'block' : 'hidden md:block'}`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h3 className="text-xl font-bold text-slate-800 mb-4 md:mb-0">Advanced Filters</h3>
          <button
            onClick={clearFilters}
            className="bg-gradient-to-r from-slate-500 to-gray-500 text-white px-4 py-2 rounded-xl font-medium"
          >
            Clear Filters
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* User Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">User</label>
            <input
              type="text"
              placeholder="Search by username or email"
              value={filters.user}
              onChange={(e) => handleFilterChange('user', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* Bike Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Bike</label>
            <input
              type="text"
              placeholder="Search by bike name"
              value={filters.bike}
              onChange={(e) => handleFilterChange('bike', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* Date From */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">From Date</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* Date To */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">To Date</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* Price Range */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Min Price</label>
              <input
                type="number"
                placeholder="Min"
                value={filters.priceMin}
                onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Max Price</label>
              <input
                type="number"
                placeholder="Max"
                value={filters.priceMax}
                onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 p-3 bg-slate-50 rounded-lg">
          <p className="text-sm text-slate-600">
            Showing {filteredBookings.length} of {bookings.length} bookings
          </p>
        </div>
      </div>
      
      {/* Bookings List */}
      {filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 rounded-lg">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-3 text-left">User</th>
                  <th className="border border-gray-300 p-3 text-left">Bike</th>
                  <th className="border border-gray-300 p-3 text-left">Start Time</th>
                  <th className="border border-gray-300 p-3 text-left">End Time</th>
                  <th className="border border-gray-300 p-3 text-left">Total Price</th>
                  <th className="border border-gray-300 p-3 text-left">Status</th>
                  <th className="border border-gray-300 p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map(booking => (
                  <tr key={booking.id} className="border-b hover:bg-gray-50">
                    <td className="border border-gray-300 p-3">
                      {booking.user?.username || booking.user?.email || 'Unknown User'}
                    </td>
                    <td className="border border-gray-300 p-3">
                      {booking.bike?.name || booking.bike?.brand + ' ' + booking.bike?.model || 'Unknown Bike'}
                    </td>
                    <td className="border border-gray-300 p-3">
                      {new Date(booking.start_time).toLocaleDateString()}
                    </td>
                    <td className="border border-gray-300 p-3">
                      {new Date(booking.end_time).toLocaleDateString()}
                    </td>
                    <td className="border border-gray-300 p-3">
                      Rs. {booking.total_price}
                    </td>
                    <td className="border border-gray-300 p-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="border border-gray-300 p-3">
                      <div className="flex gap-2">
                        <select
                          value={booking.status}
                          onChange={(e) => handleStatusUpdate(booking.id, e.target.value)}
                          className="text-xs border rounded px-2 py-1"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button
                          onClick={() => handleDeleteBooking(booking.id)}
                          className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {filteredBookings.map(booking => (
              <div key={booking.id} className="bg-white rounded-xl shadow-lg border border-slate-200 p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800">
                      {booking.user?.username || booking.user?.email || 'Unknown User'}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {booking.bike?.name || booking.bike?.brand + ' ' + booking.bike?.model || 'Unknown Bike'}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {booking.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                  <div>
                    <p className="text-slate-500">Start Date</p>
                    <p className="font-medium">{new Date(booking.start_time).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">End Date</p>
                    <p className="font-medium">{new Date(booking.end_time).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Total Price</p>
                    <p className="font-medium text-green-600">Rs. {booking.total_price}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <select
                    value={booking.status}
                    onChange={(e) => handleStatusUpdate(booking.id, e.target.value)}
                    className="flex-1 text-sm border border-slate-300 rounded-lg px-3 py-2"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <button
                    onClick={() => handleDeleteBooking(booking.id)}
                    className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No bookings found matching your filters.</p>
        </div>
      )}
    </div>
  );
};

export default ManageBookings;
