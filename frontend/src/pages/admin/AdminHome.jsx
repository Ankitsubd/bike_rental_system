import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import { FaUsers, FaBicycle, FaClipboardList, FaStar, FaMoneyBillWave, FaChartLine, FaCheckCircle, FaClock, FaTools, FaExclamationTriangle } from 'react-icons/fa';

const AdminHome = () => {
  const [stats, setStats] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch stats
        const statsRes = await api.get('admin/stats/');
        setStats(statsRes.data);
        
        // Fetch all users
        const usersRes = await api.get('admin/users/');
        setAllUsers(usersRes.data || []);
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Spinner />;
  if (error) return <p className="text-red-500">{error}</p>;

  // Separate users by role
  const admins = allUsers.filter(user => user.is_staff || user.is_superuser);
  const customers = allUsers.filter(user => !user.is_staff && !user.is_superuser);

  return (
    <div className="space-y-10">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-white to-slate-50/50 border border-slate-200/60 rounded-3xl shadow-xl p-10">
        <div className="flex items-center space-x-6 mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center border border-blue-200/50 shadow-lg">
            <span className="text-blue-600 text-4xl">👨‍💼</span>
          </div>
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-3">
              Welcome back, {user?.username || user?.email}!
            </h1>
            <p className="text-xl text-slate-600 font-medium mb-2">Manage your bike rental system with ease and precision</p>
            <p className="text-lg text-slate-500 font-medium">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3 text-slate-500">
          <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-sm"></div>
          <span className="text-sm font-medium">System Status: Online & Secure</span>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-gradient-to-br from-white to-blue-50/50 border border-blue-200/40 text-slate-900 p-8 rounded-3xl shadow-lg transform hover:scale-105 transition-all duration-500 hover:shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-semibold uppercase tracking-wide">Total Users</p>
              <p className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{stats?.total_users || 0}</p>
              <p className="text-sm text-slate-500 mt-1">
                {stats?.customer_users || 0} customers, {stats?.admin_users || 0} admins
              </p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center border border-blue-200/50 shadow-lg">
              <FaUsers className="text-blue-600 text-3xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-white to-emerald-50/50 border border-emerald-200/40 text-slate-900 p-8 rounded-3xl shadow-lg transform hover:scale-105 transition-all duration-500 hover:shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-semibold uppercase tracking-wide">Total Bikes</p>
              <p className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{stats?.total_bikes || 0}</p>
              <p className="text-sm text-slate-500 mt-1">
                {stats?.available_bikes || 0} available
              </p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center border border-emerald-200/50 shadow-lg">
              <FaBicycle className="text-emerald-600 text-3xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-white to-purple-50/50 border border-purple-200/40 text-slate-900 p-8 rounded-3xl shadow-lg transform hover:scale-105 transition-all duration-500 hover:shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-semibold uppercase tracking-wide">Total Bookings</p>
              <p className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">{stats?.total_bookings || 0}</p>
              <p className="text-sm text-slate-500 mt-1">
                {stats?.completed_bookings || 0} completed
              </p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-violet-100 rounded-2xl flex items-center justify-center border border-purple-200/50 shadow-lg">
              <FaClipboardList className="text-purple-600 text-3xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-white to-amber-50/50 border border-amber-200/40 text-slate-900 p-8 rounded-3xl shadow-lg transform hover:scale-105 transition-all duration-500 hover:shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-semibold uppercase tracking-wide">Total Revenue</p>
              <p className="text-5xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Rs. {stats?.total_revenue || 0}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Avg. Rating: {stats?.avg_rating || 0}/5
              </p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center border border-amber-200/50 shadow-lg">
              <FaMoneyBillWave className="text-amber-600 text-3xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bike Status Breakdown */}
        <div className="bg-gradient-to-br from-white to-slate-50/50 rounded-3xl shadow-xl border border-slate-200/60 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-200/40 p-6">
            <div className="flex items-center space-x-3">
              <FaBicycle className="text-emerald-600 text-2xl" />
              <h3 className="text-2xl font-bold text-slate-800">Bike Status Overview</h3>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-center space-x-3">
                <FaCheckCircle className="text-green-600" />
                <span className="font-semibold text-green-800">Available</span>
              </div>
              <span className="text-2xl font-bold text-green-600">{stats?.available_bikes || 0}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-200">
              <div className="flex items-center space-x-3">
                <FaClock className="text-orange-600" />
                <span className="font-semibold text-orange-800">Booked</span>
              </div>
              <span className="text-2xl font-bold text-orange-600">{stats?.booked_bikes || 0}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center space-x-3">
                <FaBicycle className="text-blue-600" />
                <span className="font-semibold text-blue-800">In Use</span>
              </div>
              <span className="text-2xl font-bold text-blue-600">{stats?.in_use_bikes || 0}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200">
              <div className="flex items-center space-x-3">
                <FaTools className="text-red-600" />
                <span className="font-semibold text-red-800">Maintenance</span>
              </div>
              <span className="text-2xl font-bold text-red-600">{stats?.maintenance_bikes || 0}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center space-x-3">
                <FaExclamationTriangle className="text-gray-600" />
                <span className="font-semibold text-gray-800">Offline</span>
              </div>
              <span className="text-2xl font-bold text-gray-600">{stats?.offline_bikes || 0}</span>
            </div>
          </div>
        </div>

        {/* Booking Status & Recent Activity */}
        <div className="bg-gradient-to-br from-white to-slate-50/50 rounded-3xl shadow-xl border border-slate-200/60 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-50 to-violet-50 border-b border-purple-200/40 p-6">
            <div className="flex items-center space-x-3">
              <FaClipboardList className="text-purple-600 text-2xl" />
              <h3 className="text-2xl font-bold text-slate-800">Booking Status & Activity</h3>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-sm text-blue-600 font-semibold">Pending</p>
                <p className="text-2xl font-bold text-blue-800">{stats?.pending_bookings || 0}</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
                <p className="text-sm text-green-600 font-semibold">Confirmed</p>
                <p className="text-2xl font-bold text-green-800">{stats?.confirmed_bookings || 0}</p>
              </div>
              <div className="text-center p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <p className="text-sm text-emerald-600 font-semibold">Completed</p>
                <p className="text-2xl font-bold text-emerald-800">{stats?.completed_bookings || 0}</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-xl border border-red-200">
                <p className="text-sm text-red-600 font-semibold">Cancelled</p>
                <p className="text-2xl font-bold text-red-800">{stats?.cancelled_bookings || 0}</p>
              </div>
            </div>
            
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-600">Recent Bookings (7 days)</span>
                <span className="font-semibold text-slate-800">{stats?.recent_bookings || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-600">New Users (7 days)</span>
                <span className="font-semibold text-slate-800">{stats?.recent_users || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-600">New Reviews (7 days)</span>
                <span className="font-semibold text-slate-800">{stats?.recent_reviews || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-gradient-to-br from-white to-blue-50/50 border border-blue-200/40 text-slate-900 p-6 rounded-3xl shadow-lg">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center border border-blue-200/50 shadow-lg">
              <FaChartLine className="text-blue-600 text-xl" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-semibold">Bike Utilization</p>
              <p className="text-3xl font-bold text-blue-600">{stats?.bike_utilization_rate || 0}%</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-white to-emerald-50/50 border border-emerald-200/40 text-slate-900 p-6 rounded-3xl shadow-lg">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center border border-emerald-200/50 shadow-lg">
              <FaCheckCircle className="text-emerald-600 text-xl" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-semibold">Completion Rate</p>
              <p className="text-3xl font-bold text-emerald-600">{stats?.booking_completion_rate || 0}%</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-white to-purple-50/50 border border-purple-200/40 text-slate-900 p-6 rounded-3xl shadow-lg">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-violet-100 rounded-xl flex items-center justify-center border border-purple-200/50 shadow-lg">
              <FaUsers className="text-purple-600 text-xl" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-semibold">Verification Rate</p>
              <p className="text-3xl font-bold text-purple-600">{stats?.user_verification_rate || 0}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Management Section */}
      <div className="bg-gradient-to-br from-white to-slate-50/50 rounded-3xl shadow-xl border border-slate-200/60 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200/40 p-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center border border-blue-200/50 shadow-lg">
                <span className="text-blue-600 text-2xl">👨‍💼</span>
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Administrators ({admins.length})
                </h2>
                <p className="text-slate-600 font-medium">Manage system administrators and permissions</p>
              </div>
            </div>
            <Link 
              to="/admin/users" 
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              ➕ Add New Admin
            </Link>
          </div>
        </div>
        
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {admins.map(admin => (
              <div key={admin.id} className="bg-gradient-to-br from-slate-50 to-blue-50/30 border border-slate-200/60 rounded-2xl p-6 hover:shadow-lg transition-all duration-500 transform hover:scale-105">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-xl">
                        {(admin.username || admin.email).charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-lg">{admin.username || admin.email}</p>
                      <p className="text-sm text-slate-600">{admin.email}</p>
                    </div>
                  </div>
                  <span className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-xs px-4 py-2 rounded-full font-semibold border border-blue-200/50">
                    Admin
                  </span>
                </div>
                <div className="flex gap-3">
                  <Link 
                    to={`/admin/users`} 
                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center py-3 rounded-xl text-sm font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;