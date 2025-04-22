import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GlobalContext from '../../context/GlobalContext';
import API_BASE_URL from '../../config';
import { toast } from 'react-toastify';

export default function EventModal({ onBookingSuccess }) {
  const { setShowEventModal, eventData, setEventData } =
    useContext(GlobalContext);
  const { roomId } = useParams();
  const accessToken = sessionStorage.getItem('accessToken');

  const defaultEventData = {
    roomId: '',
    bookedById: '',
    startTime: '',
    endTime: '',
    purpose: '',
    description: '',
  };

  // state mới để chứa lỗi từ API
  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // helper lấy local datetime
  const getLocalDateTime = () => {
    const now = new Date();
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  };

  // khởi tạo roomId, bookedById
  useEffect(() => {
    if (roomId) {
      setEventData((prev) => ({ ...prev, roomId }));
    }
  }, [roomId, setEventData]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/user/my-info`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await res.json();
        if (data.success && data.data?.userId) {
          setEventData((prev) => ({
            ...prev,
            bookedById: data.data.userId,
          }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserInfo();
  }, [accessToken, setEventData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // clear lỗi của field này khi user thay đổi
    setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
    setError('');
    setEventData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    setShowEventModal(false);
    setEventData({ ...defaultEventData });
    setValidationErrors({});
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setValidationErrors({});
    setError('');

    // build payload
    const payload = {
      roomId: eventData.roomId || null,
      bookedById: eventData.bookedById || null,
      startTime: eventData.startTime
        ? new Date(eventData.startTime).toISOString()
        : null,
      endTime: eventData.endTime
        ? new Date(eventData.endTime).toISOString()
        : null,
      purpose: eventData.purpose || null,
      description: eventData.description || '',
    };

    try {
      const res = await fetch(`${API_BASE_URL}/roombooking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });
      const result = await res.json();

      if (result.success) {
        toast.success('Booking successful!');
        onBookingSuccess();
        handleClose();
      } else {
        // nếu có validation errors từ API
        if (result.data && typeof result.data === 'object') {
          setValidationErrors(result.data);
        }
        // nếu có lỗi chung (không nằm trong result.data)
        const msg = result.error?.message || 'Unknown error';
        setError(msg);
      }
    } catch (err) {
      console.error('Error during booking:', err);
      setError('Network error, please try again later!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
      onClick={handleClose}
    >
      <div
        className='bg-white w-full max-w-lg rounded-xl shadow-xl p-8 relative'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close icon */}
        <button
          className='absolute top-4 right-4 text-gray-500 hover:text-gray-700'
          onClick={handleClose}
        >
          ×
        </button>

        <h2 className='text-2xl font-bold text-gray-800 mb-6 text-center'>
          Book a Room
        </h2>

        {/* lỗi chung nếu có */}
        {error && !Object.keys(validationErrors).length && (
          <p className='text-red-500 text-center mb-4'>{error}</p>
        )}
        {loading && (
          <p className='text-blue-500 text-center mb-4'>Processing...</p>
        )}

        <form className='space-y-5' onSubmit={handleSubmit}>
          <input type='hidden' name='roomId' value={eventData.roomId || ''} />

          {/* Purpose */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1 after:content-["*"] after:ml-0.5 after:text-red-500'>
              Purpose
            </label>
            <select
              name='purpose'
              value={eventData.purpose}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                validationErrors.purpose
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-400 focus:ring-blue-400'
              }`}
            >
              <option value=''>Choose Purpose</option>
              <option value='INTERVIEW'>Interview</option>
              <option value='MEETING'>Meeting</option>
              <option value='TRAINING'>Training</option>
              <option value='CLIENT_MEETING'>Meet customers/partners</option>
            </select>
            {validationErrors.purpose && (
              <p className='mt-1 text-sm text-red-600'>
                {validationErrors.purpose[0]}
              </p>
            )}
          </div>

          {/* Start Time */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1 after:content-["*"] after:ml-0.5 after:text-red-500'>
              Start Time
            </label>
            <input
              type='datetime-local'
              name='startTime'
              value={eventData.startTime || ''}
              onChange={handleChange}
              min={getLocalDateTime()}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                validationErrors.startTime
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-400 focus:ring-blue-400'
              }`}
            />
            {validationErrors.startTime && (
              <p className='mt-1 text-sm text-red-600'>
                {validationErrors.startTime[0]}
              </p>
            )}
          </div>

          {/* End Time */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1 after:content-["*"] after:ml-0.5 after:text-red-500'>
              End Time
            </label>
            <input
              type='datetime-local'
              name='endTime'
              value={eventData.endTime || ''}
              onChange={handleChange}
              min={eventData.startTime || getLocalDateTime()}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                validationErrors.endTime
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-400 focus:ring-blue-400'
              }`}
            />
            {validationErrors.endTime && (
              <p className='mt-1 text-sm text-red-600'>
                {validationErrors.endTime[0]}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Description
            </label>
            <textarea
              name='description'
              value={eventData.description || ''}
              onChange={handleChange}
              rows='3'
              placeholder='Additional details...'
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                validationErrors.description
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-400 focus:ring-blue-400'
              }`}
            />
            {validationErrors.description && (
              <p className='mt-1 text-sm text-red-600'>
                {validationErrors.description[0]}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className='flex justify-end gap-4 pt-4'>
            <button
              type='submit'
              disabled={loading}
              className={`px-6 py-2 rounded-md text-white font-semibold transition ${
                loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {loading ? 'Processing...' : 'Book a Room'}
            </button>
            <button
              type='button'
              onClick={handleClose}
              className='px-6 py-2 rounded-md bg-gray-300 text-gray-700 font-semibold hover:bg-gray-400 transition'
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
