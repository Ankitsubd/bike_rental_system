import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('reviews/pending/')
      .then(res => {
        setReviews(res.data);
        setError('');
      })
      .catch(() => {
        setError('Failed to load reviews.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleModerate = async (id, approve) => {
    try {
      await api.patch(`reviews/${id}/`, { approved: approve });
      setReviews(reviews.filter(r => r.id !== id));
    } catch {
      alert('Failed to update review');
    }
  };

  if (loading) return <Spinner />;
  if (error) return <p className="text-red-500">{error}</p>;

  if (reviews.length === 0) return <p>No pending reviews to moderate.</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Moderate Reviews</h1>
      <ul className="space-y-4">
        {reviews.map(r => (
          <li key={r.id} className="bg-white p-4 rounded-xl shadow-md">
            <p><strong>{r.user.email}</strong> on <em>{r.bike.name}</em></p>
            <p className="mb-2">{r.comment}</p>
            <div className="space-x-4">
              <button
                onClick={() => handleModerate(r.id, true)}
                className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Approve
              </button>
              <button
                onClick={() => handleModerate(r.id, false)}
                className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageReviews;
