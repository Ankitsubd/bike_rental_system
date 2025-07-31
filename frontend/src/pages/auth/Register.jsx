import { useState } from 'react';
import { register } from '../../api/auth';
import { useNavigate } from 'react-router-dom';
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";

const Register = () => {
  const [form, setForm] = useState({ 
    email: '', 
    password: '', 
    confirmPassword: '',
    full_name: '',
    phone_number: ''
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [showPassword,setShowPassword]=useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e)=> {
    e.preventDefault();
    console.log('registering with:',form)
    
    // Validation
    if (!form.full_name?.trim()) {
      setError("Full name is required");
      return;
    }
    
    if (!form.phone_number?.trim()) {
      setError("Phone number is required");
      return;
    }
    
    if (!form.email?.trim()) {
      setError("Email is required");
      return;
    }
    
    if (form.password !== form.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      await register(form);
      setSuccess('Registration successful! Please check your email and click the verification link to complete your registration.');
      setForm({
        email: '', 
        password: '', 
        confirmPassword: '',
        full_name: '',
        phone_number: ''
      });
      
      // Redirect to login after successful registration
      setTimeout(() => {
        navigate('/login');
      }, 2000); // Wait 2 seconds to show success message
    } catch (err) {
      console.error("Register error:", err.response?.data || err.message);
      
      // Handle field-specific errors
      if (err.response?.data) {
        const errorData = err.response.data;
        if (errorData.full_name) {
          setError("Full name: " + errorData.full_name[0]);
        } else if (errorData.phone_number) {
          setError("Phone number: " + errorData.phone_number[0]);
        } else if (errorData.email) {
          setError("Email: " + errorData.email[0]);
        } else if (errorData.password) {
          setError("Password: " + errorData.password[0]);
        } else {
          setError("Registration failed: " + (errorData.error || "Invalid input"));
        }
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      {success && <p className="text-green-600 text-sm mb-2">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor='full_name' className='block font-medium text-gray-700'>
            Full Name
          </label>
          <input
            type="text"
            name="full_name"
            placeholder="Enter your full name"
            value={form.full_name || ''}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <label htmlFor='phone_number' className='block font-medium text-gray-700'>
            Phone Number
          </label>
          <input
            type="tel"
            name="phone_number"
            placeholder="Enter your phone number"
            value={form.phone_number || ''}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <label htmlFor='email' className='block font-medium text-gray-700'>
            Email
          </label>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email || ''}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        </div>
        <div>
          <label htmlFor='password' className='block font-medium text-gray-700'>
            Password
          </label>
         <div className="relative mb-4">
        <input
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="Password"
          value={form.password || ''}
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
      <div>
      <label htmlFor="confirmPassword" className="block font-medium text-gray-700">
            Confirm Password
        </label>
        <div className="relative mb-4">
        <input
          type={showConfirmPassword ? 'text' : 'password'}
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword || ''}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded pr-10 focus:outline-none focus:ring focus:ring-blue-300"
        />
        <span
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute top-2.5 right-3 text-gray-600 cursor-pointer"
        >
          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>
      </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Register
        </button>
      </form>
      <p className='text-sm mt-4 text-center'>
        Already have an account? <a href='/login' className='text-blue-600 underline'>Login here</a>
      </p>
    </div>
  );
};

export default Register;
