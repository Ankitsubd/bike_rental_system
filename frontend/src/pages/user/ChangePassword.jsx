import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaEye, FaEyeSlash, FaArrowLeft, FaEnvelope } from 'react-icons/fa';
import { changePassword } from '../../api/auth';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
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

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.old_password.trim()) {
      newErrors.old_password = 'Current password is required';
    }
    
    if (!formData.new_password.trim()) {
      newErrors.new_password = 'New password is required';
    } else if (formData.new_password.length < 8) {
      newErrors.new_password = 'Password must be at least 8 characters long';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.new_password)) {
      newErrors.new_password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    
    if (!formData.confirm_password.trim()) {
      newErrors.confirm_password = 'Please confirm your new password';
    } else if (formData.new_password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setMessage('');
      setErrors({});
      
      await changePassword({
        old_password: formData.old_password,
        new_password: formData.new_password
      });
      
      setMessage('Password changed successfully!');
      
      // Clear form
      setFormData({
        old_password: '',
        new_password: '',
        confirm_password: ''
      });
      
      // Navigate back after 3 seconds
      setTimeout(() => {
        navigate('/user/profile');
      }, 3000);
      
    } catch (error) {
      console.error('Error changing password:', error);
      if (error.response?.data?.old_password) {
        setErrors({ old_password: error.response.data.old_password[0] });
      } else if (error.response?.data?.new_password) {
        setErrors({ new_password: error.response.data.new_password[0] });
      } else if (error.response?.data?.detail) {
        setMessage(error.response.data.detail);
      } else {
        setMessage('Failed to change password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/user/profile')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 transition-colors"
          >
            <FaArrowLeft className="w-4 h-4" />
            Back to Profile
          </button>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Change Password</h1>
          <p className="text-xl text-gray-600">Update your password securely</p>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl ${
            message.includes('successfully') 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            <div className="flex items-center gap-2">
              {message.includes('successfully') ? (
                <FaLock className="w-5 h-5 text-green-600" />
              ) : (
                <FaEnvelope className="w-5 h-5 text-red-600" />
              )}
              <p>{message}</p>
            </div>
          </div>
        )}

        {/* Password Change Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <FaLock className="text-blue-600 w-6 h-6" />
              <h2 className="text-2xl font-bold text-gray-800">Security Settings</h2>
            </div>
            <p className="text-gray-600 mt-2">Change your password to keep your account secure</p>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.old ? 'text' : 'password'}
                    name="old_password"
                    value={formData.old_password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300 ${
                      errors.old_password ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 hover:bg-white'
                    }`}
                    placeholder="Enter your current password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('old')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.old ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.old_password && (
                  <p className="text-red-500 text-sm mt-1">{errors.old_password}</p>
                )}
              </div>
              
              {/* New Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    name="new_password"
                    value={formData.new_password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300 ${
                      errors.new_password ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 hover:bg-white'
                    }`}
                    placeholder="Enter your new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.new ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.new_password && (
                  <p className="text-red-500 text-sm mt-1">{errors.new_password}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  Password must be at least 8 characters with uppercase, lowercase, and number
                </p>
              </div>
              
              {/* Confirm New Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300 ${
                      errors.confirm_password ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 hover:bg-white'
                    }`}
                    placeholder="Confirm your new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.confirm ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirm_password && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirm_password}</p>
                )}
              </div>
              
              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Changing Password...
                    </>
                  ) : (
                    <>
                      <FaLock className="w-4 h-4" />
                      Change Password
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Security Tips */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">Security Tips</h3>
          <ul className="space-y-2 text-sm text-blue-700">
            <li>• Use a strong password with at least 8 characters</li>
            <li>• Include uppercase and lowercase letters, numbers, and symbols</li>
            <li>• Don't reuse passwords from other accounts</li>
            <li>• You'll receive an email verification after changing your password</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword; 