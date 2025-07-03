import React, { useState } from 'react'
import {useForm} from 'react-hook-form';

const UserProfile = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const[success,setSuccess] = useState(false);
    const {register, handleSubmit, formState: {errors}}= useForm();

    //Mock initial user data(replace with api fetch)
    const[user,setUser] = useState({
        name:'Anurag Sen',
        email:'dreamgaming281@gmail.com',
    });

    const onSubmit = async(data)=>{
        setIsSubmitting(true);
        try {
            //send data to django api
            const response = await fetch('/api/user/profile/',{
                method:'POST',
                headers:{'Content-Type' : 'application/json'},
                body: JSON.stringify(data),
            });
            if(response.ok){
                setUser(data);
                setSuccess(true);
                setTimeout(()=> setSuccess(false),3000);
            }
        } catch (error) {
            console.error('Error updating profile:',error);
        }finally{
            setIsSubmitting(false);
        }
    }
  return (
   <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Profile</h2>
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
          Profile updated successfully!
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            defaultValue={user.name}
            {...register('name', { required: 'Name is required' })}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : ''
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            defaultValue={user.email}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Invalid email format',
              },
            })}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors.email ? 'border-red-500' : ''
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};


export default UserProfile