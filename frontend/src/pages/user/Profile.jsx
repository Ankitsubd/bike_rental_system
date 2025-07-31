import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getUserProfile, updateUserProfile } from '../../api/auth';
import Spinner from '../../components/Spinner';
import { FaUser, FaEnvelope, FaEdit, FaSave, FaTimes, FaBicycle, FaHistory, FaCog, FaPhone } from 'react-icons/fa';

const Profile = () => {
  const [profile, setProfile] = useState({ full_name: '', email: '', username: '', first_name: '', last_name: '' });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  // Memoized load profile function
  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setMessage('');
      setErrors({});
      const data = await getUserProfile();
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
      setMessage('Failed to load profile information. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!profile.full_name?.trim()) {
      newErrors.full_name = 'Full name is required';
    }
    
    if (!profile.username?.trim()) {
      newErrors.username = 'Username is required';
    } else if (profile.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!profile.phone_number?.trim()) {
      newErrors.phone_number = 'Phone number is required';
    } else {
      // Basic phone number validation
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(profile.phone_number)) {
        newErrors.phone_number = 'Please enter a valid phone number';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      setMessage('');
      setErrors({});
      
      await updateUserProfile(profile);
      setEditMode(false);
      setMessage('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = useCallback(() => {
    setEditMode(false);
    loadProfile(); // Reload original data
    setMessage('');
    setErrors({});
  }, [loadProfile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const quickActions = [
    {
      icon: <FaBicycle className="w-6 h-6" />,
      title: "My Bookings",
      description: "View and manage your current bike rentals",
      link: "/user/bookings",
      color: "bg-blue-500"
    },
    {
      icon: <FaHistory className="w-6 h-6" />,
      title: "Rental History",
      description: "Check your completed and cancelled rentals",
      link: "/user/rental-history",
      color: "bg-green-500"
    },
    {
      icon: <FaCog className="w-6 h-6" />,
      title: "Change Password",
      description: "Update your password securely",
      link: "/user/change-password",
      color: "bg-purple-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Profile</h1>
          <p className="text-xl text-gray-600">Manage your personal information and preferences</p>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl ${
            message.includes('successfully') 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <FaUser className="text-blue-600 w-6 h-6" />
                  <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
                </div>
                <p className="text-gray-600 mt-2">Update your profile details</p>
              </div>
              
              <div className="p-6">
                {editMode ? (
                  <form onSubmit={handleUpdate} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="full_name"
                        value={profile.full_name}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300 ${
                          errors.full_name ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 hover:bg-white'
                        }`}
                        placeholder="Enter your full name"
                        required
                      />
                      {errors.full_name && (
                        <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={profile.username}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300 ${
                          errors.username ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 hover:bg-white'
                        }`}
                        placeholder="Enter your username"
                        required
                      />
                      {errors.username && (
                        <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone_number"
                        value={profile.phone_number || ''}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300 ${
                          errors.phone_number ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 hover:bg-white'
                        }`}
                        placeholder="Enter your phone number"
                        required
                      />
                      {errors.phone_number && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          value={profile.email}
                          disabled
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed"
                          placeholder="Email address"
                        />
                        <FaEnvelope className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Email address cannot be changed for security reasons
                      </p>
                    </div>
                    
                    <div className="flex gap-4 pt-4">
                      <button
                        type="submit"
                        disabled={saving}
                        className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {saving ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <FaSave className="w-4 h-4" />
                            Save Changes
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        disabled={saving}
                        className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-300 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <FaTimes className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                      <div className="flex items-center gap-3">
                        <FaUser className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Full Name</p>
                          <p className="font-semibold text-gray-800">{profile.full_name || 'Not set'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                      <div className="flex items-center gap-3">
                        <FaUser className="w-4 h-4 text-green-600" />
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Username</p>
                          <p className="font-semibold text-gray-800">{profile.username || 'Not set'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                      <div className="flex items-center gap-3">
                        <FaPhone className="w-4 h-4 text-purple-600" />
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Phone Number</p>
                          <p className="font-semibold text-gray-800">{profile.phone_number || 'Not set'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                      <div className="flex items-center gap-3">
                        <FaEnvelope className="w-4 h-4 text-orange-600" />
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Email</p>
                          <p className="font-semibold text-gray-800">{profile.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setEditMode(true)}
                      className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center gap-2"
                    >
                      <FaEdit className="w-4 h-4" />
                      Edit Profile
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-4">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.link}
                    className="block p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`${action.color} text-white p-2 rounded-lg group-hover:scale-110 transition-transform duration-200`}>
                        {action.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
                          {action.title}
                        </h4>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Account Stats */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Account Overview</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-semibold text-gray-800">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-gray-600">Total Rentals</span>
                  <span className="font-semibold text-gray-800">0</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-gray-600">Account Status</span>
                  <span className="font-semibold text-green-600">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;