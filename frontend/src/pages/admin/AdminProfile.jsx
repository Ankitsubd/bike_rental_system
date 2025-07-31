import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import Spinner from '../../components/Spinner';

const AdminProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (loading) return <Spinner />;
  if (error) return <p className='text-red-500'>{error}</p>;

  return (
    <div className='bg-white shadow-md rounded-lg p-6'>
      <h1 className='text-2xl font-bold mb-4'>Admin Profile</h1>
      
      {user ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Username</p>
              <p className="font-semibold">{user.username || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-600">Email</p>
              <p className="font-semibold">{user.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-600">Role</p>
              <p className="font-semibold text-blue-600">Administrator</p>
            </div>
            <div>
              <p className="text-gray-600">User ID</p>
              <p className="font-semibold">{user.user_id || 'N/A'}</p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Admin Permissions</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Manage all bikes (add, edit, delete)</li>
              <li>• View and manage all bookings</li>
              <li>• Moderate user reviews</li>
              <li>• Access admin dashboard</li>
              <li>• View system statistics</li>
            </ul>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No admin information available.</p>
      )}
    </div>
  );
};

export default AdminProfile;