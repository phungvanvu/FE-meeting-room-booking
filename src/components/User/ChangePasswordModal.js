import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import API_BASE_URL from '../../config';

const ChangePasswordModal = ({ onClose, onPasswordChange }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Các state điều khiển show/hide password
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/user/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Password changed successfully!');
        if (typeof onPasswordChange === 'function') {
          onPasswordChange();
        }
        onClose();
      } else {
        const errorMsg =
          typeof data.error === 'object' && data.error !== null
            ? data.error.message
            : data.error;
        setError(errorMsg || 'Failed to change password.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50'>
      <div className='bg-white rounded-lg shadow-xl w-full max-w-lg mx-4'>
        <div className='border-b px-6 py-4'>
          <h3 className='text-2xl font-bold text-gray-800'>Change Password</h3>
        </div>
        <div className='px-6 py-4'>
          {error && (
            <div className='mb-4 p-3 bg-red-100 text-red-700 rounded text-center'>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            {/* Old Password */}
            <div className='mb-4'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Old Password
              </label>
              <div className='relative'>
                <input
                  type={showOldPassword ? 'text' : 'password'}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                  className='w-full rounded-md border-gray-300 shadow-sm focus:border-blue-400 focus:ring-blue-400 pr-10 px-3 py-2'
                  placeholder='Enter your old password'
                />
                <button
                  type='button'
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none'
                >
                  {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            {/* New Password */}
            <div className='mb-4'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                New Password
              </label>
              <div className='relative'>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className='w-full rounded-md border-gray-300 shadow-sm focus:border-blue-400 focus:ring-blue-400 pr-10 px-3 py-2'
                  placeholder='Enter your new password'
                />
                <button
                  type='button'
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none'
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            {/* Confirm New Password */}
            <div className='mb-4'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Confirm New Password
              </label>
              <div className='relative'>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className='w-full rounded-md border-gray-300 shadow-sm focus:border-blue-400 focus:ring-blue-400 pr-10 px-3 py-2'
                  placeholder='Re-enter your new password'
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none'
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>
            {/* Action Buttons */}
            <div className='flex justify-end space-x-3'>
              <button
                type='button'
                onClick={onClose}
                className='px-4 py-2 border border-gray-300 text-gray-600 rounded hover:bg-gray-100 transition'
              >
                Cancel
              </button>
              <button
                type='submit'
                disabled={loading}
                className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition'
              >
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
