import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthAPI from '../../api/auth'
import PrimaryButton  from '../ui/buttons/PrimaryButton';
import InputField from '../ui/forms/InputField';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [error,setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
        const handleSubmit = async(e)=> {
            e.preventDefault();
            setLoading(true);
            setError('');
            try {
                const {access, refresh } = await AuthAPI.login
                (formData.email,formData.password);
                localStorage.setItem('access_token',access);
                localStorage.setItem('refresh_token', refresh);
                navigate('/dashboard'); //redirect after login
            } catch (err) {
                setError(err.message || 'Invalid email or password')
            }finally{
                setLoading(false)
            }
        }
    
  return (
    <>
        <div className='max-w-md mx-auto p-6 bg-white rounded-lg shadow-md'>
            <h2 className='text-2xl font-bold mb-6 text-center'>Login</h2>
            {error && (
                <div className='mb-4 p-3 bg-red-100 text-red-700 rounded'>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className='space-y-4'>
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
                />

                <PrimaryButton
                type='submit'
                disabled={loading}
                className='w-full'
                >
                    {loading ? 'Logging in...' : 'Login'}
                </PrimaryButton>
            </form>

            <div className='mt-4 text-center'>
                <p className='text-gray-600'>
                    Don't have an account?{' '}
                    <a href='/register' className='text-blue-500 hover:underline'>
                        Register
                    </a>
                </p>
            </div>
        </div>
    </>
  )
}

export default LoginForm