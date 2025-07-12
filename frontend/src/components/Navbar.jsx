
import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const baseLinks = [
    { name: 'Home', path: '/' },
    { name: 'Bikes', path: '/bikes' },
    { name: 'About', path: '/about' },
  ];

  const authLinks = !user
    ? [
        { name: 'Login', path: '/login' },
        { name: 'Register', path: '/register' },
      ]
    : [
        user.is_admin && { name: 'Admin', path: '/admin/dashboard' },
        { name: 'My Bookings', path: '/user/bookings' },
        { name: 'Logout', action: handleLogout },
      ].filter(Boolean); // remove false entries

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600">
            🚲 BikeRental
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-6 items-center">
            {[...baseLinks, ...authLinks].map((link) =>
              link.action ? (
                <button
                  key={link.name}
                  onClick={link.action}
                  className="text-gray-700 hover:text-red-500"
                >
                  {link.name}
                </button>
              ) : (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-gray-700 hover:text-blue-600 ${
                    isActive(link.path) ? 'font-semibold text-blue-600' : ''
                  }`}
                >
                  {link.name}
                </Link>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>
              <svg
                className="w-6 h-6 text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={
                    isOpen
                      ? 'M6 18L18 6M6 6l12 12'
                      : 'M4 6h16M4 12h16M4 18h16'
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="md:hidden mt-2 space-y-2 pb-4">
            {[...baseLinks, ...authLinks].map((link) =>
              link.action ? (
                <button
                  key={link.name}
                  onClick={() => {
                    setIsOpen(false);
                    link.action();
                  }}
                  className="block w-full text-left text-gray-700 px-3 py-2 rounded hover:bg-red-100"
                >
                  {link.name}
                </button>
              ) : (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block text-gray-700 px-3 py-2 rounded hover:bg-blue-100 ${
                    isActive(link.path) ? 'font-semibold text-blue-600' : ''
                  }`}
                >
                  {link.name}
                </Link>
              )
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
