import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import API_BASE_URL from '../../config';

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  // Lấy email truyền từ ForgotPassword qua state (nếu không có, giá trị mặc định là '')
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
      setError('Vui lòng điền đầy đủ thông tin.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu mới không khớp.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/reset-password?email=${encodeURIComponent(
          email,
        )}&otp=${encodeURIComponent(otp)}&newPassword=${encodeURIComponent(
          newPassword,
        )}`,
        { method: 'POST' },
      );
      const result = await response.json();
      if (result.success) {
        setMessage(result.data);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(result.error?.message || 'Có lỗi xảy ra.');
      }
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-100'>
      <div className='w-full max-w-md bg-white p-8 shadow-lg rounded-xl'>
        <h2 className='text-3xl font-bold text-center text-gray-700 mb-4'>
          Reset password
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
        <form onSubmit={handleResetPassword}>
          <div className='mb-4'>
            <label className='block text-gray-600 font-medium'>
              OTP<span className='text-red-500 text-2xl'>*</span>
            </label>
            <input
              type='text'
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder='Enter OTP'
              className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all'
            />
          </div>
          <div className='mb-4 relative'>
            <label className='block text-gray-600 font-medium'>
              New password<span className='text-red-500 text-2xl'>*</span>
            </label>
            <input
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder='Enter new password'
              className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all'
              autoComplete='off'
            />
            <button
              type='button'
              onClick={() => setShowNewPassword(!showNewPassword)}
              className='absolute right-3 top-9 text-gray-500 hover:text-gray-700'
            >
              {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className='mb-4 relative'>
            <label className='block text-gray-600 font-medium'>
              Confirm password<span className='text-red-500 text-2xl'>*</span>
            </label>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder='Confirm new password'
              className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all'
              autoComplete='off'
            />
            <button
              type='button'
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className='absolute right-3 top-9 text-gray-500 hover:text-gray-700'
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button
            type='submit'
            disabled={loading}
            className={`w-full ${
              loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
            } text-white font-semibold py-2 rounded-lg transition-all active:scale-95`}
          >
            {loading ? 'Processing...' : 'Reset password'}
          </button>
        </form>
        <p className='mt-4 text-center text-gray-600'>
          <button
            type='button'
            onClick={() => navigate('/login')}
            className='text-blue-500 hover:underline'
          >
            Back to login
          </button>
        </p>
      </div>
    </div>
  );
}
