import React from 'react'

const Footer = () => {
  return (
    <>
        <div>
            <footer className='bg-white mt-20 border-t py-6 text-center text-sm text-gray-500'>
                <p>© {new Date().getFullYear()} BikeRental. All rights reserved.</p>
                <p>Built as a BIT college project.</p>
            </footer>
        </div>
    </>
  )
}

export default Footer