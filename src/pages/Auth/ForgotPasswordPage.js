import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
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
    <div className='min-h-screen bg-gray-100 flex items-center justify-center px-6 py-12'>
      {/* Background Image */}
      <img
        src='/1W8A8149.jpg'
        alt='Background'
        className='absolute inset-0 w-full h-full object-cover'
      />

      <div className='relative bg-white rounded-3xl shadow-2xl overflow-hidden flex w-full max-w-4xl'>
        {/* Left Illustration */}
        <div className='relative w-1/2 hidden md:block'>
          <div className='absolute -top-12 -left-12 w-32 h-32 bg-blue-200 opacity-20 rounded-full' />
          <div className='absolute -bottom-16 -right-10 w-48 h-48 bg-blue-100 opacity-10 rounded-full' />
          <div className='absolute inset-0 bg-gradient-to-tr from-blue-600 via-blue-400 to-transparent mix-blend-multiply' />
          <img
            src='/50683d57-14c7-4a71-9c53-52ed7f27560b.jpg'
            alt='Illustration'
            className='relative object-cover w-full h-full'
          />
        </div>

        {/* Right: Form */}
        <div className='relative w-full md:w-1/2 p-12 flex flex-col justify-center'>
          <h2 className='text-3xl font-medium tracking-normal text-gray-800 text-center mb-8'>
            Forgot Password
          </h2>

          {error && (
            <div className='text-red-600 bg-red-100 p-4 rounded-lg mb-8 text-center'>
              {error}
            </div>
          )}
          {message && (
            <div className='text-green-600 bg-green-100 p-4 rounded-lg mb-8 text-center'>
              {message}
            </div>
          )}

          <form onSubmit={handleForgotPassword} className='space-y-8'>
            <div className='relative'>
              <User className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' />
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Email'
                required
                className='w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl bg-white placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition'
              />
            </div>

            <button
              type='submit'
              disabled={loading}
              className={`w-full py-4 text-white font-semibold rounded-2xl transition ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>

          {message && (
            <p className='mt-4 text-center'>
              <button
                type='button'
                onClick={() =>
                  navigate('/reset-password', { state: { email } })
                }
                className='text-blue-600 hover:underline'
              >
                Received OTP? Reset your password now
              </button>
            </p>
          )}

          <p className='mt-4 text-center text-gray-600'>
            <button
              type='button'
              onClick={() => navigate('/login')}
              className='text-blue-600 hover:underline'
            >
              Back to Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
