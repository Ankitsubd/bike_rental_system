import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="max-w-5xl mx-auto p-6 text-center">
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
    </div>
  );
};

export default Home;
