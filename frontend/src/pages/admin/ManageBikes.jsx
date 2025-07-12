import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';

const ManageBikes = () => {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    id: null,
    name: '',
    type: '',
    model: '',
    price_per_hour: '',
    description: '',
    image: null,
  });

  useEffect(() => {
    fetchBikes();
  }, []);

  const fetchBikes = async () => {
    try {
      const res = await api.get('bikes/');
      setBikes(res.data);
      setError('');
    } catch {
      setError('Failed to fetch bikes.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = e => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setForm(prev => ({ ...prev, image: files[0] }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setForm({ id: null, name: '', type: '', model: '', price_per_hour: '', description: '', image: null });
  };

  // Add or update bike
  const handleSubmit = async e => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    try {
      if (form.id) {
        // Update existing bike
        await api.put(`bikes/${form.id}/`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        // Add new bike
        await api.post('bikes/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      resetForm();
      fetchBikes();
    } catch {
      alert('Failed to save bike');
    }
  };

  // Edit bike: populate form with selected bike data
  const handleEdit = bike => {
    setForm({
      id: bike.id,
      name: bike.name,
      type: bike.type,
      model: bike.model,
      price_per_hour: bike.price_per_hour,
      description: bike.description,
      image: null, // new image can be uploaded
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete bike
  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this bike?')) return;

    try {
      await api.delete(`bikes/${id}/`);
      fetchBikes();
    } catch {
      alert('Failed to delete bike');
    }
  };

  if (loading) return <Spinner />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Bikes</h1>

      {/* Bike form */}
      <form onSubmit={handleSubmit} className="mb-8 max-w-md space-y-4 bg-white p-6 rounded-xl shadow-md">
        <input
          type="text"
          name="name"
          placeholder="Bike Name"
          value={form.name}
          onChange={handleInputChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="type"
          placeholder="Bike Type"
          value={form.type}
          onChange={handleInputChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="model"
          placeholder="Model"
          value={form.model}
          onChange={handleInputChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="price_per_hour"
          placeholder="Price per Hour"
          value={form.price_per_hour}
          onChange={handleInputChange}
          required
          className="w-full p-2 border rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="file"
          name="image"
          onChange={handleInputChange}
          accept="image/*"
          className="w-full"
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          {form.id ? 'Update Bike' : 'Add Bike'}
        </button>
        {form.id && (
          <button
            type="button"
            onClick={resetForm}
            className="w-full mt-2 border border-gray-400 rounded py-2 text-center hover:bg-gray-100"
          >
            Cancel Edit
          </button>
        )}
      </form>

      {/* Bikes list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {bikes.map(bike => (
          <div key={bike.id} className="border rounded-xl p-4 bg-white shadow-sm">
            <img src={bike.image} alt={bike.name} className="w-full h-40 object-cover rounded-lg mb-2" />
            <h3 className="text-lg font-semibold">{bike.name}</h3>
            <p className="text-gray-500">{bike.type} - {bike.model}</p>
            <p className="font-bold text-blue-600">Rs. {bike.price_per_hour}/hr</p>
            <div className="mt-2 flex justify-between">
              <button
                onClick={() => handleEdit(bike)}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(bike.id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageBikes;
