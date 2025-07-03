import React, { useEffect, useState } from 'react'
import Loading from '../common/Loading'

const AdminState = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        //fetch stats form Django API(replace with your endpoint)
        const fetchStats = async() => {
            try {
                const response = await fetch('api/admin/stats');
                const data = await response.json();
                setStats(data);
            } catch (error) {
                console.error('Error fetching stats:',error);
            }finally{
                setLoading(false);
            }
        };
        fetchStats();
    },[]);

    if(loading) return <Loading/>
  return (
    <div className='p-6 bg-white rounded-lg shadow-md'>
        <h2 className='text-2xl font-bold mb-6 text-gray-800'>Admin Dashboard</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {/*Total Users*/}
            <div className='bg-blue-50 p-4 rounded-lg border border-blue-100'>
                <h3 className='text-lg font-semibold text-blue-800'>Total Users</h3>
                <p className='text-3xl font-bold text-blue-600'>
                    {stats?.total_users || 0}
                </p>
            </div>

            {/*Active Booking*/}
            <div className='bg-green-50 p-4 rounded-lg border border-green-100'>
                <h3 className='text-lg font-semibold text-green-800'>Active Bookings</h3>
                <p className='text-3xl font-bold text-green-600'>
                    {stats?.active_bookings || 0}
                </p>
            </div>

            {/*Revenue*/}
            <div className='bg-purple-50 p-4 rounded-lg border border-purple-100'>
                <h3 className='text-lg font-semibold text-purple-800'>Revenue</h3>
                <p className='text-3xl font-bold text-green-600'>
                    {stats?.revenue || 0}
                </p>
            </div>   
        </div>
    </div>
  )
}

export default AdminState