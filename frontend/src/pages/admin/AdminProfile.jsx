import React,{useState, useEffect} from 'react';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';

const AdminProfile = () => {
    const [admin,setAdmin] = useState(null);
    const [loading,setLoading] = useState(true);
    const [error,setError]= useState('');

    useEffect(()=>{
        api.get('admin/profile/')
        .then(res => {
            setAdmin(res.data);
            setLoading(false);
        })
        .catch(()=>{
            setError('Failed to load admin profile.');
            setLoading(false);
        })
    },[]);

    if(loading) return <Spinner/>;
    if(error) return <p className='text-red-500'>{error}</p>;

  return (
    <div className='bg-white shadow-md rounded-lg p-6'>
        <h1 className='text-2xl font-bold mb-4'>Admin Profile</h1>
        <p><strong>Name:</strong>{admin.name}</p>
        <p><strong>Email:</strong>{admin.email}</p>
        <p><strong>Role:</strong>{admin.role}</p>
        <p><strong>Joined</strong>{new Date(admin.created_at).toLocaleDateString()}</p>
    </div>
  )
}

export default AdminProfile