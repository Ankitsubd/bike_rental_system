import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';

const ManageBikes = () => {
  const [bikes, setBikes] = useState([]);
  const [filteredBikes, setFilteredBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingBike, setEditingBike] = useState(null);
  const [form, setForm] = useState({
    brand: '',
    model: '',
    bike_type: '',
    price_per_hour: '',
    description: '',
    image: null
  });
  
  // Filter states
  const [filters, setFilters] = useState({
    bike_type: '',
    status: '',
    priceMin: '',
    priceMax: '',
    search: ''
  });
  
  // Mobile responsive states
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBike, setSelectedBike] = useState(null);

  useEffect(() => {
    fetchBikes();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [bikes, filters]);

  const fetchBikes = async () => {
    try {
      const res = await api.get('admin/bikes/');
      setBikes(res.data.results || res.data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching bikes:', err);
      setError('Failed to load bikes.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...bikes];

    if (filters.bike_type) {
      filtered = filtered.filter(bike => bike.bike_type === filters.bike_type);
    }

    if (filters.status) {
      filtered = filtered.filter(bike => bike.status === filters.status);
    }

    if (filters.search) {
      filtered = filtered.filter(bike => 
        bike.brand?.toLowerCase().includes(filters.search.toLowerCase()) ||
        bike.model?.toLowerCase().includes(filters.search.toLowerCase()) ||
        bike.description?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.priceMin) {
      filtered = filtered.filter(bike => 
        bike.price_per_hour >= parseFloat(filters.priceMin)
      );
    }

    if (filters.priceMax) {
      filtered = filtered.filter(bike => 
        bike.price_per_hour <= parseFloat(filters.priceMax)
      );
    }

    setFilteredBikes(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      bike_type: '',
      status: '',
      priceMin: '',
      priceMax: '',
      search: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        if (form[key] !== null) {
          formData.append(key, form[key]);
        }
      });

      if (editingBike) {
        await api.put(`admin/bikes/${editingBike.id}/`, formData);
      } else {
        await api.post('admin/bikes/', formData);
      }
      fetchBikes();
      resetForm();
    } catch (err) {
      console.error('Error saving bike:', err);
      alert('Failed to save bike');
    }
  };

  const handleEdit = (bike) => {
    setEditingBike(bike);
    setForm({
      brand: bike.brand,
      model: bike.model,
      bike_type: bike.bike_type,
      price_per_hour: bike.price_per_hour,
      description: bike.description,
      image: null
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (bikeId) => {
    if (!window.confirm('Are you sure you want to delete this bike?')) return;
    
    try {
      await api.delete(`admin/bikes/${bikeId}/`);
      fetchBikes();
    } catch (err) {
      console.error('Error deleting bike:', err);
      alert('Failed to delete bike');
    }
  };

  const resetForm = () => {
    setForm({
      brand: '',
      model: '',
      bike_type: '',
      price_per_hour: '',
      description: '',
      image: null
    });
    setEditingBike(null);
    setShowForm(false);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  if (loading) return <Spinner />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-white to-emerald-50/50 border border-emerald-200/40 rounded-3xl shadow-xl p-6 md:p-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4 md:space-x-6">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center border border-emerald-200/50 shadow-lg">
              <span className="text-emerald-600 text-2xl md:text-4xl">🚲</span>
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Manage Bike
              </h1>
              <p className="text-lg md:text-xl text-emerald-600 font-medium">🚲 Manage bikes and inventory</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-xl font-medium"
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            
            {/* Add New Bike Button */}
            <button
              onClick={() => {
                setShowForm(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Add New Bike
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className={`bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6 ${showFilters ? 'block' : 'hidden md:block'}`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h3 className="text-xl font-bold text-slate-800 mb-4 md:mb-0">Advanced Filters</h3>
          <button
            onClick={clearFilters}
            className="bg-gradient-to-r from-slate-500 to-gray-500 text-white px-4 py-2 rounded-xl font-medium"
          >
            Clear Filters
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Bike Type Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Bike Type</label>
            <select
              value={filters.bike_type}
              onChange={(e) => handleFilterChange('bike_type', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">All Types</option>
              <option value="Mountain">Mountain</option>
              <option value="City ride">City ride</option>
              <option value="Road">Road</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Electric">Electric</option>
              <option value="BMX">BMX</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">All Status</option>
              <option value="available">Available</option>
              <option value="booked">Booked</option>
              <option value="in_use">In Use</option>
              <option value="returned">Returned</option>
              <option value="maintenance">Under Maintenance</option>
              <option value="reserved">Reserved</option>
              <option value="offline">Offline / Inactive</option>
            </select>
          </div>

          {/* Search Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search by brand, model, or description"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Price Range */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Min Price</label>
              <input
                type="number"
                placeholder="Min"
                value={filters.priceMin}
                onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Max Price</label>
              <input
                type="number"
                placeholder="Max"
                value={filters.priceMax}
                onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 p-3 bg-slate-50 rounded-lg">
          <p className="text-sm text-slate-600">
            Showing {filteredBikes.length} of {bikes.length} bikes
          </p>
        </div>
      </div>

      {/* Add/Edit Bike Form */}
      {showForm && (
        <div className="bg-gradient-to-br from-white to-emerald-50/30 border border-emerald-200/40 rounded-3xl shadow-xl p-6 md:p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center">
              <span className="text-emerald-600 text-xl">📝</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800">
                {editingBike ? 'Edit Bike' : 'Add New Bike'}
              </h3>
              <p className="text-slate-600">
                {editingBike ? 'Update bike information' : 'Add a new bike to inventory'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Brand</label>
                <input
                  type="text"
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Model</label>
                <input
                  type="text"
                  name="model"
                  value={form.model}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Bike Type</label>
                <select
                  name="bike_type"
                  value={form.bike_type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                >
                  <option value="">Select Type</option>
                  <option value="Mountain">Mountain</option>
                  <option value="City ride">City ride</option>
                  <option value="Road">Road</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Electric">Electric</option>
                  <option value="BMX">BMX</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Price per Hour (Rs.)</label>
                <input
                  type="number"
                  name="price_per_hour"
                  value={form.price_per_hour}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Bike Image</label>
              <input
                type="file"
                name="image"
                onChange={handleChange}
                accept="image/*"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 bg-white/80 backdrop-blur-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {editingBike ? 'Update Bike' : 'Add Bike'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 border border-slate-300 rounded-xl text-slate-700 font-semibold hover:bg-slate-50 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Bikes List */}
      {filteredBikes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBikes.map(bike => (
            <div key={bike.id} className="bg-gradient-to-br from-white to-slate-50/50 border border-slate-200/60 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              {bike.image && (
                <img
                  src={bike.image}
                  alt={`${bike.brand} ${bike.model}`}
                  className="w-full h-48 object-cover rounded-xl mb-4 shadow-md"
                />
              )}
              
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-slate-800">
                  {bike.brand} {bike.model}
                </h3>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded">
                    {bike.bike_type}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    bike.status === 'available' ? 'bg-green-100 text-green-800' :
                    bike.status === 'booked' ? 'bg-blue-100 text-blue-800' :
                    bike.status === 'in_use' ? 'bg-purple-100 text-purple-800' :
                    bike.status === 'returned' ? 'bg-emerald-100 text-emerald-800' :
                    bike.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                    bike.status === 'reserved' ? 'bg-orange-100 text-orange-800' :
                    bike.status === 'offline' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {bike.status}
                  </span>
                </div>
                
                <p className="text-slate-600 text-sm line-clamp-2">
                  {bike.description}
                </p>
                
                <div className="text-2xl font-bold text-emerald-600">
                  Rs. {bike.price_per_hour}/hr
                </div>
                
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleEdit(bike)}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(bike.id)}
                    className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No bikes found matching your filters.</p>
        </div>
      )}
    </div>
  );
};

export default ManageBikes;
