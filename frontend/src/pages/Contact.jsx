import React, { useState } from 'react'

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email:"",
        message:""
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Message sent successfully!");
        setFormData({
            name:"",
            email:"",
            message:""
        })
    }
  return (
    <>
    <div className='bg-gray-50 min-h-screen p-10 max-w-xl mx-auto'>
        <h2 className='text-3xl font-bold mb-6 text-center'>Contact Us</h2>
        <form className='space-y-4' onSubmit={handleSubmit}>
            <input
            className='w-full p-3 border rounded'
            placeholder='Your Name'
            name='name'
            value={formData.name}
            onChange={handleChange}
            required
            />
            <input
            type='email'
            className='w-full p-3 border rounded'
            placeholder='Your Email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            required
            />
            <textarea
            className='w-full p-3 border rounded'
            placeholder='Your Message'
            name='message'
            rows='5'
            value={formData.message}
            onChange={handleChange}
            required
            />
            <button className='bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 w-full'>
                Send Message
            </button>
        </form>
    </div>
    </>
  )
}

export default Contact