import React from 'react'
import { IoMdClose } from "react-icons/io";

const Modal = ({isOpen, onClose, children}) => {
    if(!isOpen)
        return null;
  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
        <div className='bg-white rounded-lg p-6 max-w-md w-full mx-4'>
            <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700'>
                <IoMdClose />
            </button>
        </div>
        <div className='mt-4'>
            {children}
        </div>
    </div>
  )
}

export default Modal