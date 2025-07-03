import React, { useEffect, useState } from 'react'
import { BookingsAPI } from '../../api/bookings'
import {CheckCircleIcon, ClockIcon, XCircleIcon, TruckIcon} from '@heroicons/react/outline';

const statusStages = [
    {id: 'pending', name: 'Pending', icon:ClockIcon, color: 'text-yellow-500'},
    {id: 'confirmed', name: 'Confirmed', icon: CheckCircleIcon, color: 'text-green-500'},
    {id: 'in_progress', name: 'In Progress', icon: TruckIcon, color: 'text-blue-500'},
    {id: 'completed', name: 'Completed', icon: CheckCircleIcon, color: 'text-green-500'},
    {id: 'cancelled', name: 'Cancelled', icon: XCircleIcon, color: 'text-red-500'}
];

const BookingStatus = ({bookingId}) => {
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(()=>{
        const fetchBooking = async()=> {
            try {
                const data = await BookingsAPI.getBookingById(bookingId);
                setBooking(data);
            } catch (err) {
                setError(err.message || 'Failed to load booking');
            }finally{
                setLoading(false);
            }
        };
        fetchBooking();
    },[bookingId]);

    const currentStageIndex = statusStages.findIndex(stage => stage.id === booking?.status);
  return (
    <>
        <div className='bg-white p-6 rounded-lg shadow-md'>
            <h3 className='text-xl font-semibold mb-6'>Booking Status</h3>
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div className='text-red-500'>{error}</div>
            ) : (
                <>
                <div className='relative'>
                    <div className='absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2'>
                    </div>
                    <div className='flex justify-between relative'>
                        {statusStages.map((stage, index)=> {
                            const Icon = stage.icon;
                            const isCompleted = index < currentStageIndex;
                            const isCurrent = index === currentStageIndex;
                            const isPending = index > currentStageIndex;

                            return(
                                <div key={stage.id} className='flex flex-col items-center z-10'>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center
                                        ${isCompleted ? 'bg-green-100' : ''}
                                        ${isCurrent ? 'bg-blue-100' : ''}
                                        ${isPending ? 'bg-gray-100' : ''}
                                    `}>
                                        <Icon className={`w-6 h-6 ${isCompleted ? 'text-green-500' : ''}
                                        ${isCurrent ? 'text-blue-500' : ''}
                                        ${isPending ? 'text-gray-400' : ''}`}
                                        />
                                    </div>
                                    <span className={`text-xs mt-2 ${isCurrent ? 'font-bold' : ''}`}>
                                        {stage.name}
                                    </span>
                                </div>        
                            );
                        })}
                    </div>
                </div>

                <div className='mt-8 space-y-4'>
                    <div className='flex justify-between'>
                        <span className='text-gray-600'>Booking ID:</span>
                        <span className='font-medium'>{booking._id}</span>
                    </div>
                    <div className='flex justify-between'>
                        <span className='text-gray-600'>Bike Model:</span>
                        <span className='font-medium'>{booking.bike.model}</span>
                    </div>
                    <div className='flex justify-between'>
                        <span className='text-gray-600'>Dates:</span>
                        <span className='font-medium'>
                            {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleTimeString()}
                        </span>
                    </div>
                    <div className='flex justify-between'>
                        <span className='text-gray-600'>Total Amount:</span>
                        <span className='font-medium'>Rs.{booking.totalPrice.toFixed(2)}</span>
                    </div>
                </div>
                </>
            )}
        </div>
    </>
  )
}

export default BookingStatus