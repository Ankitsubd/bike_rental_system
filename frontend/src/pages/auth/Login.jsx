import { useState } from 'react';
import useAuth from '../../hooks/useAuth.js';
import { loginAPI } from '../../api/auth.js';

const Login = () => {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  setError('login failed');
  try {
    const res = await loginAPI(form);
    login(res);
   console.log('login successful!')
  } catch (err) {
    console.error("Login error:", err.response?.data || err.message);
    setError("Invalid email or password");
  }
};

  
  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email?? ''}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password ?? '' }
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Login
        </button>
      </form>
      <p className="text-sm mt-4 text-center">
        Forgot password? <a href="/reset-password" className="text-blue-600 underline">Reset here</a>
      </p>
    </div>
  );
};

export default Login;
