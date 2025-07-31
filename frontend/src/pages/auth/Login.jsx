import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";

const Login = () => {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      console.log('Attempting login with:', form);
      const userData = await login(form);
      console.log('Login successful, user data:', userData);
      console.log('User is_staff:', userData.is_staff);
      console.log('User is_superuser:', userData.is_superuser);
      
      // Navigate based on user role
      if (userData.is_staff || userData.is_superuser) {
        console.log('User is admin, navigating to admin dashboard');
        navigate('/admin/dashboard');
      } else {
        console.log('User is customer, navigating to home');
        navigate('/');
      }
      
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.non_field_errors?.[0] || err.message || 'Invalid email or password');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <div>
          <label htmlFor="password" className="block font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded pr-10 focus:outline-none focus:ring focus:ring-blue-300"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-2.5 right-3 text-gray-600 cursor-pointer"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Login
        </button>
      </form>
      <p className='text-sm mt-4 text-center'>
        Forgot password?{' '}
        <a href='/forgot-password' className='text-blue-600 hover:text-blue-700 underline font-medium'>
          Reset here
        </a>
      </p>
    </div>
  );
};

export default Login;
