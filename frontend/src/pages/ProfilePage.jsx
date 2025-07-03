import React ,{useEffect, useState}from 'react'
import {useForm} from 'react-hook-form'
import Layout from '../components/common/Layout';
import Loading from '../components/common/Loading';
const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const {register, handleSubmit, reset, formState: { errors } } = useForm();

    //fetch user data
    useEffect(()=> {
        const fetchUser = async ()=> {
            try {
                const response = await fetch('/api/user/profile/');
                const data = await response.json();
                setUser(data);
                reset(data);
            } catch (error) {
                console.error('Error fetching profile:', error)
            }finally{
                setLoading(false);
            }
        };
        fetchUser();
    },[reset]);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/user/profile/',{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify(data),
            });
            if(response.ok){
                setSuccess(()=>setSuccess(false),3000);
            }
        } catch (error) {
            console.error('Error updating profile:',error);
        }finally{
            setIsSubmitting(false);
        }
    };

    if(loading) return <loading/>;

  return (
    <Layout>
        <div className='max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8'>
            <h1 className='text-3xl font-bold text-gray-900 mb-8'>Your Profile</h1>
            {success && (
                <div className='mb-6 p-4 bg-green-100 text-green-800 rounded-lg'>
                    Profile updated successfully!
                </div>
            )}
            <div className='bg-white shadow rounded-lg p-6 md:p-8'>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                First Name
                            </label>
                            <input 
                            type='text'
                            {...register('firstName',{required:'First name is required'})}
                            defaultValue={user?.firstName}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                                errors.firstName ? 'border-red-500' : 'border-gray-300'
                            }`}
                            />
                            {errors.firstName && (
                                <p className='mt-1 text-sm text-red-600'>
                                {errors.firstName.message}
                                </p>
                            )}
                        </div>

                         <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                Last Name
                            </label>
                            <input 
                            type='text'
                            {...register('lastName',{required:'First name is required'})}
                            defaultValue={user?.lastName}
                            className='w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500'
                            />
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                Email
                            </label>
                            <input 
                            type='email'
                            {...register('email',{required:'Email is required',
                                pattern:{
                                    value:/^\S+@\S+$/i,
                                    message:'Invalid email address',
                                },
                            })}
                            defaultValue={user?.email}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500
                            ${
                                errors.email? 'border-red-500' : 'border-gray-300'
                            }`}
                            />
                            {errors.email &&(
                                <p className='mt-1 text-sm text-red-600'>
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div className='flex justify-end'>
                            <button className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus: outline-none focus: ring-2 focus:ring-blue-500 focus:ring-offset-2
                            disabled:opacity-50'>
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </Layout>
  )
}

export default ProfilePage