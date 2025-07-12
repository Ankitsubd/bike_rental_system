import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { verifyEmail } from '../../api/auth';

const VerifyEmail = () => {
  const [params] = useSearchParams();
  const [message, setMessage] = useState('Verifying...');
  const token = params.get('token');

  useEffect(() => {
    if (token) {
      verifyEmail(token)
        .then(() => setMessage('Email verified successfully!'))
        .catch(() => setMessage('Verification failed. Invalid or expired token.'));
    }
  }, [token]);

  return (
    <div className="max-w-md mx-auto mt-32 text-center text-lg text-blue-700">
      {message}
    </div>
  );
};

export default VerifyEmail;
