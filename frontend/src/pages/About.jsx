import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBicycle, FaShieldAlt, FaClock, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import api from '../api/axios';

const About = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Track page visit
    const trackPageVisit = async () => {
      try {
        await api.post('analytics/track-about-click/', {
          action: 'about_page_visited',
          page: 'about',
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error tracking page visit:', error);
      }
    };

    trackPageVisit();
  }, []);

  const handleBrowseBikes = async () => {
    setIsLoading(true);
    try {
      // Track the button click in backend
      await api.post('analytics/track-about-click/', {
        action: 'browse_bikes_clicked',
        page: 'about',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error tracking analytics:', error);
    } finally {
      setIsLoading(false);
    }
    
    // Scroll to top and navigate to bikes page
    window.scrollTo(0, 0);
    navigate('/bikes');
  };

  const features = [
    {
      icon: <FaBicycle className="w-8 h-8" />,
      title: "Wide Selection",
      description: "Choose from mountain bikes, city cruisers, electric bikes, and more to match your needs."
    },
    {
      icon: <FaShieldAlt className="w-8 h-8" />,
      title: "Safety First",
      description: "All our bikes undergo regular maintenance and safety checks to ensure your peace of mind."
    },
    {
      icon: <FaClock className="w-8 h-8" />,
      title: "24/7 Support",
      description: "Our customer support team is available round the clock to assist you with any queries."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">About BikeRental</h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed">
            We're passionate about making bike rentals accessible, affordable, and enjoyable for everyone. 
            Our mission is to provide quality bikes and exceptional service to help you explore your city with freedom.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              At BikeRental, we believe that everyone should have access to quality bikes for transportation, 
              recreation, and exploration. Our platform makes bike rentals quick, affordable, and convenient.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Whether you're commuting to work, exploring the city, or enjoying a leisurely ride, 
              our wide range of bikes and reliable service ensure a smooth experience every time.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-6xl mb-4">🚲</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Why Choose Us?</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                Easy online booking system
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                Competitive pricing with no hidden fees
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                Regular maintenance and safety checks
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                24/7 customer support
              </li>
            </ul>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-gray-800 text-center mb-12">What Makes Us Different</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Values</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Customer Satisfaction</h3>
                <p className="text-gray-600">We prioritize your experience and satisfaction above everything else.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Safety & Reliability</h3>
                <p className="text-gray-600">All our bikes are regularly maintained and safety checked for your peace of mind.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Transparency</h3>
                <p className="text-gray-600">No hidden fees, clear pricing, and honest communication with our customers.</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-6">Get Started Today</h3>
            <p className="text-blue-100 mb-6 leading-relaxed">
              Ready to explore your city on two wheels? Join our community of bike enthusiasts and start your journey today.
            </p>
            <button onClick={handleBrowseBikes} className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-300">
              {isLoading ? 'Loading...' : 'Browse Bikes'}
            </button>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-4xl font-bold text-gray-800 text-center mb-12">Get in Touch</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-blue-600 mb-4 flex justify-center">
                <FaMapMarkerAlt className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Location</h3>
              <p className="text-gray-600">Chitwan, Nepal</p>
            </div>
            <div className="text-center">
              <div className="text-blue-600 mb-4 flex justify-center">
                <FaPhone className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Phone</h3>
              <p className="text-gray-600">+977-56-123456</p>
            </div>
            <div className="text-center">
              <div className="text-blue-600 mb-4 flex justify-center">
                <FaEnvelope className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Email</h3>
              <p className="text-gray-600">rentbike@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
