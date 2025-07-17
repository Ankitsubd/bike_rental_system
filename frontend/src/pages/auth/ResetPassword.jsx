import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { resetPassword } from '../../api/auth';
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
const ResetPassword = () => {
  const [params] = useSearchParams();
  const token = params.get('token');
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword]= useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  

  const handleChange = (e) => {
   setForm({...form, [e.target.name]:e.target.value})
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!token){
      setMessage('Missing reset token');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setMessage("Passwords don't match.");
      return;
    }

    try {
      await resetPassword( token, {new_password: form.password });
      setMessage('Password reset successful!');
      setTimeout(()=>{
        navigate('/login');
      },1000);
    } catch (err){
      console.error(err);
      setMessage('Reset failed.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
      {message && <p className="text-sm text-blue-600 text-center mb-2">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
        type='email'
        name='email'
        placeholder='Email'
        value={form.email}
        onChange={handleChange}
        className='w-full p-2 border rounded'
        />
        <div className='relative'>
           <input
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="New Password"
          value={form.password}
          onChange={handleChange}
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
          value={form.confirmPassword}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <span
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute top-2.5 right-3 text-gray-600 cursor-pointer"
          >
          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
