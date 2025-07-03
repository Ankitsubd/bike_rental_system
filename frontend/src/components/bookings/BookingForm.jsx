import React, { useEffect, useState } from 'react'
import {BookingsAPI} from '../../api/bookings';
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const BookingForm = ({bike, onSuccess}) => {
    const [formData, setFormData] = useState({
        startDate: new Date(),
        endDate:new Date(Date.now()+86400000),
        specialRequests:''
    })

    const [totalPrice, setTotalPrice] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(()=>{
        if(bike && formData.startDate && formData.endDate){
            const diffTime = Math.abs(formData.endDate- formData.startDate);
            const diffDays = Math.ceil(diffTime/(1000*60*60*24));
            setTotalPrice(diffDays*bike.pricePerDay);
        }
    },[formData.startDate, formData.endDate,bike]);

    const handleDateChange = (dates)=>{
        const [start, end] = dates;
        setFormData(prev=>({
            ...prev,
            startDate:start,
            endDate:end || start
        }))
    }

    const handleSubmit = async(e)=>{
        e.preventdefault();
        setIsSubmitting(true);
        setError('');

        try {
            const bookingData ={
                bike: bike._id,
                startDate: formData.startDate,
                endDate: formData.endDate,
                specialRequests: formData.specialRequests,
                totalPrice
            }
            const response = await BookingsAPI.createBooking(bookingData);
            onSuccess(response);
        } catch (err) {
            setError(err.message|| 'Failed to create booking' );
        }finally{
            setIsSubmitting(false);
        }
    }
  return (
    <>
        <div className='bg-white p-6 rounded-lg shadow-md'>
            <h3 className='text-xl font-bold mb-4'>Book {bike.model}</h3>
            {error&& (
                <div className='mb-4 p-3 bg-red-100 text-red-700 rounded'>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className='mb-4'>
                    <label className='blok text-gray-700 mb-2'>Select Dates</label>
                    <DatePicker 
                    selected={formData.startDate}
                    onChange={handleDateChange}
                    startDate={formData.startDate}
                    endDate={formData.endDate}
                    selectsRange
                    minDate={new Date()}
                    inline
                    className='w-full border rounded p-2'
                    />
                </div>

                <div className='mb-4'>
                    <label className='block text-gray-700 mb-2'>Duration</label>
                    <div className='p-2 bg-gray-50 rounded'>
                        {Math.ceil((formData.endDate - formData.startDate)/(1000*60*60*24))}
                        days
                    </div>
                </div>

                <div className='mb-4'>
                    <label className='block text-gray-700 mb-2'>Special Requests</label>
                    <textarea
                    value={formData.specialRequests}
                    onChange={(e)=> setFormData({
                        ...formData,
                        specialRequests: e.target.value
                    })}
                    rows='3'
                    className='w-full p-2 border rounded'
                    placeholder='Any special requirements...'
                    />
                </div>

                <div className='mb-6 p-4 bg-blue-50 rounded-lg'>
                    <div className='flex justify-between items-center'>
                        <span className='font-medium'>Total Price:</span>
                        <span className='text-xl font-bold'>Rs. {totalPrice.toFixed(2)}</span>
                    </div>
                    <p className='text-sm text-gray-600 mt-1'>({bike.pricePerDay}/day)</p>
                </div>

                <button
                type='submit'
                disabled={isSubmitting}
                className='w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium disabled:opacity-50'
                >{isSubmitting ? 'Processing...' : 'Confirm Booking'}
                </button>
            </form> 
        </div>
    </>
  )
}

export default BookingForm