import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import API_BASE_URL from '../../config';

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!email || !otp || !newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/auth/reset-password?email=${encodeURIComponent(
          email,
        )}&otp=${encodeURIComponent(otp)}&newPassword=${encodeURIComponent(
          newPassword,
        )}`,
        { method: 'POST' },
      );
      const result = await res.json();
      if (result.success) {
        setMessage(result.data || 'Your password has been reset successfully.');
        setTimeout(() => navigate('/login'), 2000);
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
        src='/picture1.png'
        alt='Background'
        className='absolute inset-0 w-full h-full object-cover'
      />

      <div className='relative bg-white rounded-3xl shadow-2xl overflow-hidden flex w-full max-w-4xl'>
        {/* Left Illustration */}
        <div className='relative w-1/2 hidden md:block max-h-[600px] overflow-hidden self-center'>
          <div className='absolute -top-12 -left-12 w-32 h-32 bg-blue-200 opacity-20 rounded-full' />
          <div className='absolute -bottom-16 -right-10 w-48 h-48 bg-blue-100 opacity-10 rounded-full' />
          <div className='absolute inset-0 bg-gradient-to-tr from-blue-600 via-blue-400 to-transparent mix-blend-multiply' />
          <img
            src='/50683d57-14c7-4a71-9c53-52ed7f27560b.jpg'
            alt='Illustration Reset Password'
            className='relative object-cover w-full h-full'
          />
        </div>

        {/* Right: Form */}
        <div className='relative w-full md:w-1/2 p-12 flex flex-col justify-center'>
          <h2 className='text-3xl font-medium tracking-normal text-gray-800 text-center mb-8'>
            Reset Password
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

          <form onSubmit={handleResetPassword} className='space-y-8'>
            <div className='relative'>
              <label className='block text-sm font-medium text-gray-700 mb-1 after:content-["*"] after:ml-0.5 after:text-red-500 after:text-base'>
                OTP:
              </label>
              <input
                type='text'
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder='Enter OTP'
                required
                className='w-full pl-4 pr-4 py-4 border border-gray-300 rounded-2xl bg-white placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition'
              />
            </div>

            {/* New Password */}
            <div className='mb-6'>
              <label className='block text-sm font-medium text-gray-700 mb-1 after:content-["*"] after:ml-0.5 after:text-red-500 after:text-base'>
                New Password:
              </label>
              <div className='relative'>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder='Enter new password'
                  required
                  autoComplete='off'
                  className='w-full pl-4 pr-12 py-4 border border-gray-300 
                 rounded-2xl bg-white placeholder-gray-400 
                 text-gray-800 focus:outline-none focus:ring-2 
                 focus:ring-blue-400 transition'
                />
                <button
                  type='button'
                  onClick={() => setShowNewPassword((v) => !v)}
                  className='absolute inset-y-0 right-4 flex items-center px-2 
                 text-gray-500 hover:text-gray-700'
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className='mb-6'>
              <label className='block text-sm font-medium text-gray-700 mb-1 after:content-["*"] after:ml-0.5 after:text-red-500 after:text-base'>
                Confirm Password:
              </label>
              <div className='relative'>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder='Confirm new password'
                  required
                  autoComplete='off'
                  className='w-full pl-4 pr-12 py-4 border border-gray-300 
                 rounded-2xl bg-white placeholder-gray-400 
                 text-gray-800 focus:outline-none focus:ring-2 
                 focus:ring-blue-400 transition'
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className='absolute inset-y-0 right-4 flex items-center px-2 
                 text-gray-500 hover:text-gray-700'
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
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
              {loading ? 'Processing...' : 'Reset Password'}
            </button>
          </form>

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
