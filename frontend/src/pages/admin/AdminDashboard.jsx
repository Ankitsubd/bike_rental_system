import React, { useEffect, useState } from 'react'
import {fetchAdminStats} from '../../api/admin';
import {Loading} from '../../components/common/Loading';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
    const loadStats = async()=> {
        const data = await fetchAdminStats();
        try {
            const data = await fetchAdminStats();
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }finally{
            setLoading(false);
        }
    };
    loadStats();
    },[]);

    if(loading) return <Loading/>
    
  return (
    <div>AdminDashboard</div>
  )
}

export default AdminDashboard