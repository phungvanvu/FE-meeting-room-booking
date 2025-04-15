import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!email) {
      setError('Please enter your email.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/forgot-password?email=${encodeURIComponent(
          email,
        )}`,
        { method: 'POST' },
      );
      const result = await response.json();
      if (result.success) {
        setMessage(result.data);
      } else {
        setError(result.error?.message || 'An error occurred.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-100'>
      <div className='w-full max-w-md bg-white p-8 shadow-lg rounded-xl'>
        <h2 className='text-3xl font-bold text-center text-gray-700 mb-4'>
          Forgot Password
        </h2>
        {error && (
          <p className='bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-md text-sm mb-4 text-center'>
            {error}
          </p>
        )}
        {message && (
          <p className='bg-green-100 border-l-4 border-green-500 text-green-700 p-3 rounded-md text-sm mb-4 text-center'>
            {message}
          </p>
        )}
        <form onSubmit={handleForgotPassword}>
          <div className='mb-4'>
            <label className='block text-gray-600 font-medium'>
              Email:<span className='text-red-500 text-2xl'>*</span>
            </label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Enter your email'
              className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all'
            />
          </div>
          <button
            type='submit'
            disabled={loading}
            className={`w-full ${
              loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
            } text-white font-semibold py-2 rounded-lg transition-all active:scale-95`}
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>
        {message && (
          <p className='mt-4 text-center'>
            <button
              type='button'
              onClick={() => navigate('/reset-password', { state: { email } })}
              className='text-blue-500 hover:underline'
            >
              OTP received? Reset your password now
            </button>
          </p>
        )}
        <p className='mt-4 text-center text-gray-600'>
          <button
            type='button'
            onClick={() => navigate('/login')}
            className='text-blue-500 hover:underline'
          >
            Back to Login
          </button>
        </p>
      </div>
    </div>
  );
}
