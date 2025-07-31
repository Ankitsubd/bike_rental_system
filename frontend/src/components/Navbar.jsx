
import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout, loading } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  // Check if user is in admin panel
  const isInAdminPanel = location.pathname.startsWith('/admin');

  const baseLinks = [
    { name: 'Home', path: '/' },
    { name: 'Bikes', path: '/bikes' },
    { name: 'About', path: '/about' },
  ];

  const isActive = (path) => location.pathname === path;

  // Don't render navbar while loading
  if (loading) {
    return null;
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-sky-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl font-bold">🚲</span>
            </div>
            <span className="text-2xl font-bold text-slate-800">BikeRental</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Main Navigation Links */}
            <div className="flex space-x-6">
              {baseLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-slate-700 hover:text-sky-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                    isActive(link.path) ? 'text-sky-600 font-semibold' : ''
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Auth Section */}
            <div className="flex items-center space-x-4">
              {!user ? (
                <>
                  <Link
                    to="/login"
                    className="text-slate-700 hover:text-sky-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-sky-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-sky-700 transition-colors duration-300"
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                <div className="relative">
                  {/* User Menu Button */}
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 text-slate-700 hover:text-sky-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
                  >
                    <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center">
                      <span className="text-sky-600 text-sm font-semibold">
                        {user.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span>{user.username || user.email}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                      {user && (user.is_staff || user.is_superuser) && !isInAdminPanel && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-sky-50 hover:text-sky-600 transition-colors duration-300"
                        >
                          <span className="mr-2">👨‍💼</span>
                          Admin Panel
                        </Link>
                      )}
                      
                      <Link
                        to="/user/bookings"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-sky-50 hover:text-sky-600 transition-colors duration-300"
                      >
                        <span className="mr-2">📋</span>
                        My Bookings
                      </Link>
                      
                      <Link
                        to="/user/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-sky-50 hover:text-sky-600 transition-colors duration-300"
                      >
                        <span className="mr-2">👤</span>
                        Profile
                      </Link>
                      
                      <hr className="my-2" />
                      
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-300"
                      >
                        <span className="mr-2">🚪</span>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-700 hover:text-sky-600 p-2 rounded-md transition-colors duration-300"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Main Navigation Links */}
              {baseLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 ${
                    isActive(link.path) 
                      ? 'text-sky-600 bg-sky-50' 
                      : 'text-slate-700 hover:text-sky-600 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              {/* Auth Links */}
              {!user ? (
                <div className="pt-4 space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-sky-600 hover:bg-slate-50 transition-colors duration-300"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium bg-sky-600 text-white hover:bg-sky-700 transition-colors duration-300"
                  >
                    Get Started
                  </Link>
                </div>
              ) : (
                <div className="pt-4 space-y-2 border-t border-slate-200">
                  {user && (user.is_staff || user.is_superuser) && !isInAdminPanel && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-sky-600 hover:bg-slate-50 transition-colors duration-300"
                    >
                      <span className="mr-2">👨‍💼</span>
                      Admin Panel
                    </Link>
                  )}
                  
                  <Link
                    to="/user/bookings"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-sky-600 hover:bg-slate-50 transition-colors duration-300"
                  >
                    <span className="mr-2">📋</span>
                    My Bookings
                  </Link>
                  
                  <Link
                    to="/user/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-sky-600 hover:bg-slate-50 transition-colors duration-300"
                  >
                    <span className="mr-2">👤</span>
                    Profile
                  </Link>
                  
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      logout();
                    }}
                    className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 transition-colors duration-300"
                  >
                    <span className="mr-2">🚪</span>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Click outside to close user menu */}
      {isUserMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
