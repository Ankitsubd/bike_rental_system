import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthAPI from '../../api/auth';
import { PrimaryButton } from '../ui/buttons/primaryButton'
import {InputField} from '../ui/forms/InputField'

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password:'',
        confirmPassword: '',
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name] : value
        })
    }

    const handleSubmit= async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        //validate passwords match
        if(formData.password !== formData.confirmPassword) {
            setError('Passwords donot match');
            setLoading(false);
            return
        }

        try {
            await AuthAPI.register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
            })
            navigate('/login'); // redirect to login after successful registration
        } catch (err) {
            setError(err.message || 'Registration failed');
        }finally{
            setLoading(false)
        }
    }
  return (
    <>
      <div className='max-w-md mx-auto p-6 bg-white rounded-lg shadow-md'>
        <h2 className='text-2xl font-bold mb-6 text-center'>Register</h2>
          {error && (
            <div className='mb-4 p-3 bg-red-100 text-red-700 rounded'>
                {error}
            </div>
            )}
      
        <form onSubmit={handleSubmit} className='space-y-4'>
            <InputField
                label='Full Name'
                type='text'
                name='name'
                value={formData.name}
                onChange={handleChange}
                required
                />
            <InputField
                label='Email'
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                required
                />
                
            <InputField 
                label='Password'
                type='password'
                name='password'
                value={formData.password}
                onChange={handleChange}
                required
                minLength='6'
                />
            
            <InputField
            label='Confirm Password'
            type='password'
            name='confirmPassword'
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            />
      
            <PrimaryButton
                type='submit'
                disabled={loading}
                className='w-full'
             >
              {loading ? 'Registering...' : 'Register'}
            </PrimaryButton>
        </form>
      
        <div className='mt-4 text-center'>
            <p className='text-gray-600'>
                Don't have an account?{' '}
                <a href='/login' className='text-blue-500 hover:underline'>
                 Login
                </a>
            </p>
        </div>
        </div>  
    </>
  )
}

export default RegisterForm