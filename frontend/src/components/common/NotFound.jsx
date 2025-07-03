import React from 'react'
import {Link} from 'react-router-dom';

const NotFound = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen text-center p-4'>
        <h1 className='text-6xl font-bold text-red-400 mb-4'>404</h1>
        <p className='text-2xl mb-6'>Oops! Page not found.</p>
        <Link
        to='/'
        className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition'>
            Go Home
        </Link>
    </div>
  )
}

export default NotFound