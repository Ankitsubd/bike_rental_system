import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { resetPassword } from '../../api/auth';
import { FaEyeSlash, FaEye, FaArrowLeft } from "react-icons/fa";

const ResetPassword = () => {
  const [params] = useSearchParams();
  const token = params.get('token');
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Check if token exists
  useEffect(() => {
    if (!token) {
      setMessage('Invalid reset link. Please request a new password reset.');
    }
  }, [token]);

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token) {
      setMessage('Missing reset token');
      return;
    }
    
    if (form.password !== form.confirmPassword) {
      setMessage("Passwords don't match.");
      return;
    }

    if (form.password.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await resetPassword(token, {new_password: form.password});
      setMessage('Password reset successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error(err);
      setMessage('Reset failed. Please try again or request a new reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded-xl shadow-md">
      {/* Back button */}
      <button
        onClick={() => navigate('/forgot-password')}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 transition-colors"
      >
        <FaArrowLeft className="w-4 h-4" />
        Back to Forgot Password
      </button>

      <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
      
      {message && (
        <div className={`p-4 rounded-lg mb-4 ${
          message.includes('successful') 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          <p className="text-sm text-center">{message}</p>
        </div>
      )}

      {token ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className='relative'>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="New Password"
              value={form.password || ''}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-2.5 right-3 text-gray-600 cursor-pointer"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          
          <div className='relative'>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword || ''}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute top-2.5 right-3 text-gray-600 cursor-pointer"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      ) : (
        <div className="text-center">
          <p className="text-gray-600 mb-4">Invalid reset link.</p>
          <button
            onClick={() => navigate('/forgot-password')}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Request New Reset Link
          </button>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
