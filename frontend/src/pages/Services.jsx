import React from 'react'

const Services = () => {
    const services = [
        {title: 'Daily Rentals', description: 'Rent bikes for a daily basis with affordable prices.'},
        {title: 'Weekly packages', description: 'Discounted weekly rental plans for longer trips.'},
        {title: 'Delivery & Pickup', description: 'We deliver bikes to your doorstep and pick them up after use.'}
    ]
  return (
    <>
        <div className='p-10 bg-gray-50 min-h-screen'>
            <h2 className='text-3xl font-bold text-center mb-8'>Our Services</h2>
            <div className='grid md:grid-cols-3 gap-6'>
                {services.map((s, index)=> (
                    <div key={index} className='bg-white p-6 rounded shadow'>
                        <h3 className='text-xl font-semibold mb-2'>{s.title}</h3>
                        <p className='text-gray-600'>{s.description}</p>
                    </div>
                ))}
            </div>
        </div>
    </>
  )
}

export default Services