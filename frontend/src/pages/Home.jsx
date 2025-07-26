import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {fetchBikes} from '../api/bikes'
import BikeFilters from '../components/BikeFilters';
const Home = () => {
  const [bikes,setBikes] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
  const fetchBikes = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/v1/bikes/');
      const availableBikes = response.data.filter(bike => !bike.is_booked); 
      setBikes(availableBikes);
    } catch (error) {
      console.error('Failed to fetch bikes:', error);
    }
  };

  fetchBikes();
}, []);


  const handleBookNow = (bikeId)=> {
    navigate(`/bikes/${bikeId}`);
  }

  const [filters,setFilters] = useState({})

  const getBikes = async()=>{
    try {
      const {data} = await fetchBikes(filters);
      setBikes(data.bikes);
    } catch (error) {
      console.error("Failed to fetch bikes:",error)
    }
  }

  useEffect(()=>{
    getBikes()
  },[filters])
  return (
    <div className="w-5xl mx-auto p-6 text-center bg-slate-100">
      <h1 className="text-4xl font-bold mb-4">Welcome to Bike Rental System</h1>
      <p className="text-lg mb-8">
        Rent bikes easily and explore your city on two wheels. Choose from a wide variety of bikes,
        book instantly, and enjoy your ride.
      </p>
      <Link
        to="/bikes"
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700 transition"
      >
        Browse Bikes
      </Link>
     <h2 className="text-2xl font-semibold mt-10 mb-4">Available Bikes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-left">
        <BikeFilters onFilter={setFilters} />        
        {bikes.length > 0 ? (
          bikes.map((bike) => (
            <div key={bike.id} className="border rounded-lg shadow p-4">
              {bike.image && (
                <img
                  src={bike.image}
                  alt={bike.name}
                  className="w-full h-48 object-cover rounded mb-4"
                />
              )}
              <h3 className="text-xl font-bold mb-1">{bike.name}</h3>
              <p className="text-sm text-gray-700 mb-2">{bike.description}</p>
              <p className="text-green-600 font-semibold mb-1">Rs. {bike.price_per_hour}/hour</p>
             <button
                onClick={() => handleBookNow(bike.id)}
                className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Book Now
              </button>
            </div>
          ))
        ) : (
          <p className="col-span-full">No bikes available right now.</p>
        )}
      </div>

      
    </div>
  );
};

export default Home;
