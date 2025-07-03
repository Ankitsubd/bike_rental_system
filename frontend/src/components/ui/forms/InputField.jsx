import React from 'react'

const InputField = ({label, type, name, value, onChange, required, ...props }) => {
  return (
    <div>
      <label className='block text-gray-700 mb-1'>
        {label} {required && <span className='text-red-500'>*</span>}
      </label>
      <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className='w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent'
      {...props}/>
    </div>
  )
}

export default InputField;