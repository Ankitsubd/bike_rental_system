import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import {debounce, sortBy, update } from 'lodash';
import BikeCard from '../../components/BikeCard';

const BikeList = () => {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState(1);

  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page')) || 1;
  const typeFilter = searchParams.get('type') || '';
  const searchKeyword = searchParams.get('search')||'';
  const debouncedSearch = debounce((value)=>{
   updateFilter('search',value);
  },400);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', 1); 
    setSearchParams(newParams);
  };

  const clearFilters = ()=>{
    setSearchParams(newParams);
  }
 

 useEffect(() => {
  const fetchData =async()=>{
    try {
       setLoading(true);
        let query = `bikes/?page=${page}`;
        if (typeFilter) query += `&type=${typeFilter}`;
        if (searchKeyword) query += `&search=${searchKeyword}`;

        const res = await api.get(query);
        setBikes(res.data.results || []);
        setTotalPages(Math.ceil(res.data.count / 10));
        setError('');
    } catch (error) {
      console.error(err);
        setError('Failed to load bikes');
    }finally{
      setLoading(false);
    }
  };
  fetchData();
},[page,typeFilter,searchKeyword]);
    
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
        {/**Search */}
       <input
       type='text'
       placeholder='Search by model, name...'
       defaultValue={searchKeyword}
       onChange={e => debouncedSearch(e.target.value)}
       className='border p-2 rounded'
       />
      {/**Sort */}
      <select
      value={sortBy}
      onChange={e=> updateFilter('sort', e.target.value)}
      className='border p-2 rounded'
      >
        <option value="">Sort By</option>
        <option value="price_per_hour">Price: Low to High</option>
        <option value="-price_per_hour">Price: High to Low</option>
        <option value="rating">Rating: Low to High</option>
        <option value="-rating">Rating: High to Low</option>
      </select>
       {/**Clear filters */}
       {(typeFilter || searchKeyword) && (
        <button
      onClick={clearFilters}
      className='bg-red-100 text-red-500 px-3 py-2 rounded'
      >
        Clear Filters
      </button>
    )}
      </div>

      {/* Bike grid */}
      {bikes.length === 0 ? (
        <p className='text-gray-500'>No bikes found.</p>
      ): (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {bikes.map(bike => (
            <BikeCard key= {bike.id} bike={bike}/>
          ))}
          </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
      <div className="mt-8 flex justify-center gap-2">
        {paginationButtons}
      </div>
      )}
    </div>
  );
};

export default BikeList;
