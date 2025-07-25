import React, { useEffect, useState } from 'react'
import { getUserProfile, updateUserProfile } from '../../api/auth'
import { useAsyncError } from 'react-router-dom';
const Profile = () => {
    const [profile, setProfile] = useState({name :'',email:''});
    const [editMode, setEditMode] = useState(false);

    useEffect(() =>{
        const loadProfile = async()=>{
            const data = await getUserProfile();
            setProfile(data);
        };
        loadProfile();
    },[]);

    const handleChange =(e)=>{
        setProfile({
            ...profile,
            [e.target.name]: e.target.value
        })
    };
    const handleUpdate = async(e)=>{
        await updateUserProfile(profile);
        setEditMode(false);
    }
  return ( 
    <div className='max-w-md mx-auto p-6 bg-white rounded shadow'>
        <h2 className='text-xl font-semibold mb-4'>My Profile</h2>
        <input
        name='name'
        value={profile.name}
        onChange={handleChange}
        disabled={!editMode}
        className='w-full p-2 mb-2 border'
        />
        <input
        name='email'
        value={profile.email}
        onChange={handleChange}
        disabled
        className='w-full p-2 mb-2 border'
        />
        {editMode ? (
            <button onClick={handleUpdate} className='btn'>Save</button>
        ) : (
            <button onClick={()=> setEditMode(true)} className='btn'>Edit</button>
        )
        }
        </div>
  )
}

export default Profile