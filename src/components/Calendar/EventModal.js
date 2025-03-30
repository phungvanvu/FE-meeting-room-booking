import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GlobalContext from '../../context/GlobalContext';
import API_BASE_URL from '../../config';

export default function EventModal({ onBookingSuccess }) {
  const { setShowEventModal, eventData, setEventData } =
    useContext(GlobalContext);
  const { roomName } = useParams();
  const accessToken = sessionStorage.getItem('accessToken');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Define default values for eventData
  const defaultEventData = {
    roomId: '',
    bookedById: '',
    startTime: '',
    endTime: '',
    purpose: '',
    description: '',
  };

  // Fetch roomId from API based on roomName
  useEffect(() => {
    const fetchRoomId = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${API_BASE_URL}/room/name/${roomName}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (response.ok) {
          const roomData = await response.json();
          if (roomData?.data?.roomId) {
            setEventData((prev) => ({ ...prev, roomId: roomData.data.roomId }));
          } else {
            console.error('Room ID not found in response');
          }
        } else {
          console.error('Failed to fetch room ID');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (roomName) fetchRoomId();
  }, [roomName, setEventData, accessToken]);

  // Fetch user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${API_BASE_URL}/user/my-info`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (response.ok) {
          const userData = await response.json();
          if (userData?.data?.userId) {
            setEventData((prev) => ({
              ...prev,
              bookedById: userData.data.userId,
            }));
          } else {
            console.error('User ID not found in response');
          }
        } else {
          console.error('Failed to fetch user info');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [setEventData, accessToken]);

  // Handle input changes and clear error message
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (error) setError('');
    setEventData((prev) => ({ ...prev, [name]: value }));
  };

  // Dedicated close handler to reset form data
  const handleClose = () => {
    setShowEventModal(false);
    // Reset eventData to default values when modal closes
    setEventData({ ...defaultEventData });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!eventData.startTime || !eventData.endTime) {
      setError('Please select both start time and end time.');
      return;
    }

    const startTimeObj = new Date(eventData.startTime);
    const endTimeObj = new Date(eventData.endTime);

    // Validate date objects
    if (isNaN(startTimeObj.getTime()) || isNaN(endTimeObj.getTime())) {
      setError('Invalid time value. Please check your input.');
      return;
    }

    if (startTimeObj >= endTimeObj) {
      setError('Start time must be before end time!');
      return;
    }

    // Adjust time to UTC+0 if needed
    startTimeObj.setHours(
      startTimeObj.getHours() - startTimeObj.getTimezoneOffset() / 60,
    );
    endTimeObj.setHours(
      endTimeObj.getHours() - endTimeObj.getTimezoneOffset() / 60,
    );

    const formattedData = {
      roomId: eventData.roomId || null,
      bookedById: eventData.bookedById || null,
      startTime: startTimeObj.toISOString(),
      endTime: endTimeObj.toISOString(),
      purpose: eventData.purpose === '' ? null : eventData.purpose,
      description: eventData.description || '',
    };

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/roombooking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formattedData),
      });

      const result = await response.json();
      if (result.success) {
        onBookingSuccess();
        // Reset form data on success before closing modal
        setEventData({ ...defaultEventData });
        setShowEventModal(false);
        setSuccessMessage('');
      } else {
        const errorMessage = result.error?.message || 'Unknown error';
        setError(errorMessage);
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
      className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity'
      onClick={handleClose}
    >
      <div
        className='bg-white w-full max-w-lg rounded-xl shadow-xl p-8 relative transform transition-all scale-100'
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className='absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition'
          onClick={handleClose}
        >
          <svg
            className='w-6 h-6'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
        </button>
        <h2 className='text-2xl font-bold text-gray-800 mb-6 text-center'>
          Book a Room
        </h2>

        {error && <p className='text-red-500 text-center mb-4'>{error}</p>}
        {successMessage && (
          <p className='text-green-500 text-center mb-4'>{successMessage}</p>
        )}
        {loading && (
          <p className='text-blue-500 text-center mb-4'>Processing...</p>
        )}

        <form className='space-y-5' onSubmit={handleSubmit}>
          <input type='hidden' name='roomId' value={eventData.roomId || ''} />

          {/* Title (Purpose) */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Title
            </label>
            <select
              name='purpose'
              value={eventData.purpose || ''}
              onChange={handleChange}
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400'
            >
              <option value=''>Choose Title</option>
              <option value='INTERVIEW'>Interview</option>
              <option value='MEETING'>Meeting</option>
              <option value='TRAINING'>Training</option>
              <option value='CLIENT_MEETING'>Meet customers/partners</option>
            </select>
          </div>

          {/* Start Time */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Start Time
            </label>
            <input
              type='datetime-local'
              name='startTime'
              value={eventData.startTime || ''}
              onChange={handleChange}
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400'
            />
          </div>

          {/* End Time */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              End Time
            </label>
            <input
              type='datetime-local'
              name='endTime'
              value={eventData.endTime || ''}
              onChange={handleChange}
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400'
            />
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
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400'
              rows='3'
              placeholder='Additional details...'
            ></textarea>
          </div>

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
