import { useState } from 'react';
import { requestPasswordReset } from '../../api/auth';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await requestPasswordReset(email);
      setMessage('Password reset link sent to your email.');
    } catch {
      setMessage('Something went wrong.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Send Reset Link
        </button>
      </form>
      {message && <p className="text-sm text-green-600 mt-4 text-center">{message}</p>}
    </div>
  );
};

export default ForgotPassword;
