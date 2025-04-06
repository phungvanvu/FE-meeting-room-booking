import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { isAccessTokenValid } from '../utils/auth';
import API_BASE_URL from '../../config';

export default function RoomBookingsModal({ roomId, onClose }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBookings() {
      const isValid = await isAccessTokenValid();
      if (!isValid) {
        navigate('/Login');
        return;
      }
      try {
        const accessToken = sessionStorage.getItem('accessToken');
        const response = await fetch(
          `${API_BASE_URL}/roombooking/by-room-id/${roomId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          setBookings(result.data);
        } else {
          setError(result.error?.message || 'Unable to load booking data');
        }
      } catch (err) {
        setError('Error loading booking data');
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, [roomId, navigate]);

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='relative bg-white rounded-xl shadow-lg max-w-3xl w-full p-6'>
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-gray-600 hover:text-gray-800'
        >
          <X size={24} />
        </button>
        {/* Tiêu đề */}
        <h2 className='text-2xl font-bold mb-6 text-gray-800'>
          Danh sách Booking
        </h2>

        {/* Trạng thái tải hoặc lỗi */}
        {loading ? (
          <div className='text-center text-gray-600'>Loading data...</div>
        ) : error ? (
          <div className='text-center text-red-500'>{error}</div>
        ) : bookings.length === 0 ? (
          <div className='text-center text-gray-500'>
            There is no booking for this room yet.
          </div>
        ) : (
          <div className='space-y-4 overflow-y-auto max-h-[400px]'>
            {bookings.map((booking) => (
              <div
                key={booking.bookingId}
                className='border rounded-lg p-4 shadow hover:shadow-md transition'
              >
                <div className='flex justify-between items-center'>
                  <div className='text-lg font-semibold text-gray-800'>
                    {booking.roomName}
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'CONFIRMED'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {booking.status}
                  </div>
                </div>
                <div className='mt-2 text-gray-600'>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <span className='font-medium'>Booking by:</span>{' '}
                      {booking.userName} ({booking.userEmail})
                    </div>
                    <div>
                      <span className='font-medium'>Time:</span>{' '}
                      {new Date(booking.startTime).toLocaleTimeString()} -{' '}
                      {new Date(booking.endTime).toLocaleTimeString()}
                    </div>
                    <div>
                      <span className='font-medium'>Day:</span>{' '}
                      {new Date(booking.startTime).toLocaleDateString()}
                    </div>
                    <div>
                      <span className='font-medium'>Purpose:</span>{' '}
                      {booking.purpose}
                    </div>
                  </div>
                  {booking.description && (
                    <div className='mt-2'>
                      <span className='font-medium'>Describe:</span>{' '}
                      {booking.description}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
