import { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleBackToUserView = () => {
    navigate('/');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/admin/dashboard', label: 'Admin Home', icon: '🏠' },
    { path: '/admin/analytics', label: 'Analytics', icon: '📊' },
    { path: '/admin/users', label: 'Manage User', icon: '👤' },
    { path: '/admin/bikes', label: 'Manage Bike', icon: '🚲' },
    { path: '/admin/bookings', label: 'Manage Booking', icon: '📋' },
    { path: '/admin/reviews', label: 'Review', icon: '⭐' },
    { path: '/admin/profile', label: 'Profile', icon: '👨‍💼' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-slate-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                  <span className="text-blue-600 text-xl">⚡</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    Admin Panel
                  </h1>
                  <p className="text-sm text-slate-500 font-medium">Bike Rental Management</p>
                </div>
              </div>
            </div>

            {/* Welcome Message */}
            <div className="hidden md:block bg-slate-50/80 px-5 py-3 rounded-xl border border-slate-200/50 backdrop-blur-sm">
              <p className="text-sm font-medium text-slate-700">
                Welcome, {user?.username || 'Admin'}
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleBackToUserView}
                className="hidden sm:block bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                User View
              </button>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                Logout
              </button>
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-2 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)}>
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col h-full">
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-800">Menu</h2>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-slate-500 hover:text-slate-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Mobile Navigation */}
              <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                      isActive(item.path)
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                        : 'bg-white/80 hover:bg-white text-slate-700 border border-slate-200/60 hover:border-slate-300/60 shadow-sm hover:shadow-md'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>

              {/* Mobile Action Buttons */}
              <div className="p-4 border-t border-slate-200 space-y-2">
                <button
                  onClick={() => {
                    handleBackToUserView();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300"
                >
                  User View
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Desktop Navigation Sidebar */}
        <nav className="hidden md:block w-64 bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/50 shadow-sm m-6">
          <div className="space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  isActive(item.path)
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                    : 'bg-white/80 hover:bg-white text-slate-700 border border-slate-200/60 hover:border-slate-300/60 shadow-sm hover:shadow-md'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 p-6 md:p-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
