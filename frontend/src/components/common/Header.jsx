import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    {name: 'Home', path:'/'},
    {name: 'Services', path:'/services'},
    {name: 'About', path:'/about'},
    {name: 'Contact', path:'/contact'},
    {name: 'Login', path:'/login'}
  ]
  return (
    <>
      <nav className='bg-white shadow sticky top-0 z-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between h-16 items-center'>
            {/*logo*/}
            <Link to='/' className='text-2xl font-bold text-blue-600'>
             🚲 BikeRental
            </Link>

            {/*desktop nav*/}
            <div className='hidden md:flex space-x-6'>
              {navLinks.map((link)=> (
                <Link 
                key={link.name}
                to={link.path}
                className={`text-gray-700 hover:text-blue-600 ${
                  location.pathname === link.path ? 'font-semibold teext-blue-600' : ''
                }`}
                >{link.name}</Link>
              ))}
            </div>

            {/*Mobile menu button*/}
            <div className='md:hidden'>
              <button onClick={()=> setIsOpen(!isOpen)}>
                <svg 
                className='w-6 h-6 text-gray-800'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24 '
                >
                  <path strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d={isOpen ? 
                    'M6 18L18 6M6 ^l12 12' : 'M4 6h16M4 12h16M4 18h16'
                  }/>
                </svg>
              </button>
            </div>
          </div>

          {/*Mobile menu dropdown*/}
          {isOpen && (
            <div className='md:hidden mt-2 space-y-2 pb-4'>
                {navLinks.map((link)=> (
                  <Link
                  key={link.name}
                  to={link.path}
                  onClick={()=> setIsOpen(false)}
                  className={`block text-gray-700 px-3 py-2 rounded hover:bg-blue-100
                    ${location.pathname === link.path ? 'font-semibold text-blue-600': ''
                    }`}
                    >
                      {link.name}
                    </Link>
                ))}
            </div>
          )}
        </div>
      </nav>
    </>
  )
}

export default Header