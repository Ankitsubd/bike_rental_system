import {CalendarIcon, ClockIcon, UserIcon, CheckCircleIcon, XCircleIcon} from '@heroicons/react/outline';
import {format} from 'data-fns';
import React from 'react'

const BookingCard = ({booking, onCancel}) => {
    const statusColors = {
        confirmed: 'bg-green-100 text-green-800',
        pending:'bg-yellow-100 text-yellow-800',
        cancelled:'bg-red-100 text-red-800',
        completed:'bg-blue-100 text-blue-800',
    }
  return (
    <>
        <div className='border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow'>
            <div className='p-4 bg-white'>
                <div className='flex justify-between items-start mb-3'>
                    <h3 className='text-lg font-semibold'>{booking.bike.model}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${statusColors[booking.status]}`}>
                        {booking.status.toUpperCase()}
                    </span>
                </div>
                <div className='grid grid-cols-2 gap-4 text-sm'>
                    <div className='flex items-center'>
                        <CalendarIcon className='h-4 w-4 mr-2 text-gray-500'/>
                        <span>{format(new Date(booking.startDate),'MMM dd, yyyy')}</span>
                    </div>

                    <div className='flex items-center'>
                        <ClockIcon className='h-4 w-4 mr-2 text-gray-500'/>
                        <span>{booking.duration} days</span>
                    </div>
                    <div className='flex items-center'>
                        <UserIcon className='h-4 w-4 mr-2 text-gray-500'/>
                        <span>Booking #{booking._id.slice(-6)}</span>
                    </div>
                    <div className='flex items-center font-medium'>
                        <span>Total: Rs.{booking.totalPrice.toFixed(2)}</span>
                    </div>
                </div>
                {booking.status === 'confirmed' && (
                    <div className='mt-4 flex justify-end space-x-2'>
                        <button 
                        onClick={()=> onCancel(booking._id)}
                        className='text-sm text-red-600 hover:text-red-800 font-medium'>
                            Cancel Booking
                        </button>
                    </div>
                )}
            </div>
        </div>
    </>
  )
}

export default BookingCard