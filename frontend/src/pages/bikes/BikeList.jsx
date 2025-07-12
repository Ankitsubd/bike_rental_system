import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';

const BikeList = () => {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page')) || 1;
  const typeFilter = searchParams.get('type') || '';
  const modelFilter = searchParams.get('model')||'';

  const [totalPages, setTotalPages] = useState(1);

 useEffect(() => {
    setLoading(true);
    let query = `bikes/?page=${page}`;
    if (typeFilter) query += `&type=${typeFilter}`;
    if (modelFilter) query += `&model=${modelFilter}`;

    api.get(query)
      .then(res => {
        setBikes(res.data.results);
        setTotalPages(Math.ceil(res.data.count / 10)); // assuming 10 per page
        setError('');
      })
      .catch(() => setError('Failed to load bikes'))
      .finally(() => setLoading(false));
  }, [page, typeFilter, modelFilter]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', 1); // reset page on filter change
    setSearchParams(newParams);
  };

   const paginationButtons = [];
  for (let i = 1; i <= totalPages; i++) {
    paginationButtons.push(
      <button
        key={i}
        onClick={() => setSearchParams(prev => {
          const np = new URLSearchParams(prev);
          np.set('page', i);
          return np;
        })}
        className={`px-3 py-1 rounded ${i === page ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
      >
        {i}
      </button>
    );
  }
  if (loading) return <Spinner />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Available Bikes</h1>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <select
          value={typeFilter}
          onChange={e => updateFilter('type', e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Types</option>
          <option value="mountain">Mountain</option>
          <option value="road">Road</option>
          <option value="electric">Electric</option>
          
        </select>

        <input
          type="text"
          placeholder="Search Model"
          value={modelFilter}
          onChange={e => updateFilter('model', e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {/* Bike grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {bikes.map(bike => (
          <Link
            key={bike.id}
            to={`/bikes/${bike.id}`}
            className="block border rounded-lg shadow hover:shadow-lg transition p-4 bg-white"
          >
            <img src={bike.image} alt={bike.name} className="w-full h-48 object-cover rounded-md mb-3" />
            <h2 className="text-xl font-semibold">{bike.name}</h2>
            <p className="text-gray-600">{bike.type} - {bike.model}</p>
            <p className="text-blue-600 font-bold mt-1">Rs. {bike.price_per_hour} / hour</p>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center gap-2">
        {paginationButtons}
      </div>
    </div>
  );
};

export default BikeList;
