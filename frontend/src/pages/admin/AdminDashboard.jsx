import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch stats
        const statsRes = await api.get('admin/stats/');
        setStats(statsRes.data);
        
        // Fetch recent bookings with expanded user and bike data
        const bookingsRes = await api.get('admin/bookings/?page_size=10');
        setRecentBookings(bookingsRes.data.results || bookingsRes.data || []);
        
        // Fetch all users
        const usersRes = await api.get('admin/users/');
        setAllUsers(usersRes.data || []);
        
      } catch (err) {
        console.error('Dashboard error:', err);
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <Spinner />;
  if (error) return <p className="text-red-500">{error}</p>;

  // Separate users by role
  const admins = allUsers.filter(user => user.is_staff || user.is_superuser);
  const customers = allUsers.filter(user => !user.is_staff && !user.is_superuser);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
      
      {/* Current Admin Info */}
      <div className="bg-blue-50 p-6 rounded-xl mb-8">
        <h2 className="text-xl font-semibold text-blue-800 mb-4">👨‍💼 Current Admin</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-gray-600">Username</p>
            <p className="font-semibold">{user?.username || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-600">Email</p>
            <p className="font-semibold">{user?.email || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-600">Role</p>
            <p className="font-semibold text-blue-600">Administrator</p>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <h2 className="text-lg font-semibold text-gray-600">Total Users</h2>
          <p className="text-4xl text-blue-600 font-bold">{stats?.total_users || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <h2 className="text-lg font-semibold text-gray-600">Total Bikes</h2>
          <p className="text-4xl text-green-600 font-bold">{stats?.total_bikes || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <h2 className="text-lg font-semibold text-gray-600">Total Bookings</h2>
          <p className="text-4xl text-purple-600 font-bold">{stats?.total_bookings || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <h2 className="text-lg font-semibold text-gray-600">Total Reviews</h2>
          <p className="text-4xl text-orange-600 font-bold">{stats?.total_reviews || 0}</p>
        </div>
      </div>

      {/* User Management Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Admins */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-blue-800">👨‍💼 Administrators ({admins.length})</h2>
            <Link to="/admin/users" className="text-blue-600 hover:underline">Manage All</Link>
          </div>
          <div className="space-y-2">
            {admins.slice(0, 5).map(admin => (
              <div key={admin.id} className="flex justify-between items-center p-3 bg-blue-50 rounded">
                <div>
                  <p className="font-semibold">{admin.username || admin.email}</p>
                  <p className="text-sm text-gray-600">{admin.email}</p>
                </div>
                <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">Admin</span>
              </div>
            ))}
            {admins.length === 0 && (
              <p className="text-gray-500 text-center py-4">No administrators found</p>
            )}
          </div>
        </div>

        {/* Customers */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-green-800">👥 Customers ({customers.length})</h2>
            <Link to="/admin/users" className="text-green-600 hover:underline">Manage All</Link>
          </div>
          <div className="space-y-2">
            {customers.slice(0, 5).map(customer => (
              <div key={customer.id} className="flex justify-between items-center p-3 bg-green-50 rounded">
                <div>
                  <p className="font-semibold">{customer.username || customer.email}</p>
                  <p className="text-sm text-gray-600">{customer.email}</p>
                </div>
                <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">Customer</span>
              </div>
            ))}
            {customers.length === 0 && (
              <p className="text-gray-500 text-center py-4">No customers found</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">📋 Recent Bookings</h2>
          <Link to="/admin/bookings" className="text-blue-600 hover:underline">View All</Link>
        </div>
        
        {recentBookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">User</th>
                  <th className="text-left p-2">Bike</th>
                  <th className="text-left p-2">Start Time</th>
                  <th className="text-left p-2">End Time</th>
                  <th className="text-left p-2">Total Price</th>
                  <th className="text-left p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map(booking => (
                  <tr key={booking.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      {booking.user?.username || booking.user?.email || 'Unknown User'}
                    </td>
                    <td className="p-2">
                      {booking.bike?.name || booking.bike?.brand + ' ' + booking.bike?.model || 'Unknown Bike'}
                    </td>
                    <td className="p-2">
                      {new Date(booking.start_time).toLocaleDateString()}
                    </td>
                    <td className="p-2">
                      {new Date(booking.end_time).toLocaleDateString()}
                    </td>
                    <td className="p-2">
                      Rs. {booking.total_price}
                    </td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No recent bookings found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
