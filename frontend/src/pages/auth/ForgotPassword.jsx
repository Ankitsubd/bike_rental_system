import { useState } from 'react';
import { requestPasswordReset } from '../../api/auth';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaEnvelope } from 'react-icons/fa';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setMessage('Please enter your email address.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await requestPasswordReset(email); 
      setMessage('Password reset link sent to your email. Please check your inbox and click the link to reset your password.');
    } catch (err) {
      console.error('Password reset error:', err);
      setMessage(err.response?.data?.error || 'Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded-xl shadow-md">
      {/* Back button */}
      <Link
        to="/login"
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 transition-colors"
      >
        <FaArrowLeft className="w-4 h-4" />
        Back to Login
      </Link>

      <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
      <p className="text-gray-600 text-center mb-6">
        Enter your email address and we'll send you a link to reset your password.
      </p>

      {message && (
        <div className={`p-4 rounded-lg mb-4 ${
          message.includes('sent') 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          <p className="text-sm text-center">{message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg pl-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Remember your password?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
