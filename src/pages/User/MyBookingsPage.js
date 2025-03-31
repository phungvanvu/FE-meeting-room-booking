import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import API_BASE_URL from '../../config';

const MyRooms = () => {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [editError, setEditError] = useState(null);

  const accessToken = sessionStorage.getItem('accessToken');

  const fetchBookings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/roombooking/upcoming/my`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setBookings(data.data);
      } else {
        console.error('Error fetching bookings:', data.error);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleEdit = (booking) => {
    setSelectedBooking(booking);
    setEditError(null);
    setIsEditing(true);
  };

  const handleDelete = (booking) => {
    setSelectedBooking(booking);
    setIsConfirming(true);
  };

  const saveBooking = async () => {
    setEditError(null);
    const updatedBooking = {
      bookingId: selectedBooking.bookingId,
      roomId: selectedBooking.roomId,
      bookedById: selectedBooking.bookedById,
      startTime: selectedBooking.startTime,
      endTime: selectedBooking.endTime,
      purpose: selectedBooking.purpose,
      description: selectedBooking.description,
    };

    try {
      const response = await fetch(
        `${API_BASE_URL}/roombooking/${selectedBooking.bookingId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(updatedBooking),
        },
      );
      const data = await response.json();
      if (data.success) {
        setBookings(
          bookings.map((b) =>
            b.bookingId === data.data.bookingId ? data.data : b,
          ),
        );
        await fetchBookings();
        setIsEditing(false);
        setSelectedBooking(null);
      } else {
        // Display error message from API
        setEditError(data.error.message);
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      setEditError('An error occurred while updating the booking.');
    }
  };

  const cancelBooking = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/roombooking/cancel/${selectedBooking.bookingId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const data = await response.json();
      if (data.success) {
        setBookings(
          bookings.filter((b) => b.bookingId !== selectedBooking.bookingId),
        );
        setIsConfirming(false);
        setSelectedBooking(null);
      } else {
        console.error('Cancel booking failed:', data.error);
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
    }
  };

  const cancelDelete = () => {
    setIsConfirming(false);
    setSelectedBooking(null);
  };

  const closeEditForm = () => {
    setIsEditing(false);
    setSelectedBooking(null);
    setEditError(null);
  };

  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <main className='container mx-auto px-4 py-8 flex-grow'>
        <h2 className='text-2xl font-bold text-center mb-8'>My Bookings</h2>
        <div className='overflow-x-auto shadow-lg rounded-lg'>
          <table className='min-w-full bg-white'>
            <thead className='bg-gradient-to-r from-blue-500 to-blue-600 text-white'>
              <tr>
                <th className='py-3 px-4 text-left'>No.</th>
                <th className='py-3 px-4 text-left'>Room Name</th>
                <th className='py-3 px-4 text-left'>Start Time</th>
                <th className='py-3 px-4 text-left'>End Time</th>
                <th className='py-3 px-4 text-left'>Booked At</th>
                <th className='py-3 px-4 text-left'>Purpose</th>
                <th className='py-3 px-4 text-left'>Description</th>
                <th className='py-3 px-4 text-center'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {bookings.map((booking, index) => (
                <tr
                  key={booking.bookingId}
                  className='hover:bg-gray-100 transition'
                >
                  <td className='py-3 px-4'>{index + 1}</td>
                  <td className='py-3 px-4'>{booking.roomName}</td>
                  <td className='py-3 px-4'>{booking.startTime}</td>
                  <td className='py-3 px-4'>{booking.endTime}</td>
                  <td className='py-3 px-4'>{booking.createdAt}</td>
                  <td className='py-3 px-4'>{booking.purpose}</td>
                  <td className='py-3 px-4'>{booking.description}</td>
                  <td className='py-3 px-4 text-center'>
                    <button
                      className='text-blue-600 font-semibold hover:underline mr-2'
                      onClick={() => handleEdit(booking)}
                    >
                      Edit
                    </button>
                    <button
                      className='text-red-600 font-semibold hover:underline'
                      onClick={() => handleDelete(booking)}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Edit Booking Modal */}
      {isEditing && selectedBooking && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
          <div className='bg-white rounded-lg shadow-xl w-full max-w-lg p-8 transform transition-all'>
            <h3 className='text-2xl font-bold text-center mb-6'>
              Edit Booking
            </h3>
            {editError && (
              <div className='bg-red-100 text-red-600 p-3 rounded mb-4 text-center'>
                {editError}
              </div>
            )}
            <form>
              <div className='mb-4'>
                <label className='block text-gray-700 font-medium mb-2'>
                  Start Time:
                </label>
                <input
                  type='datetime-local'
                  value={selectedBooking.startTime}
                  onChange={(e) =>
                    setSelectedBooking({
                      ...selectedBooking,
                      startTime: e.target.value,
                    })
                  }
                  className='w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>
              <div className='mb-4'>
                <label className='block text-gray-700 font-medium mb-2'>
                  End Time:
                </label>
                <input
                  type='datetime-local'
                  value={selectedBooking.endTime}
                  onChange={(e) =>
                    setSelectedBooking({
                      ...selectedBooking,
                      endTime: e.target.value,
                    })
                  }
                  className='w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>
              <div className='mb-4'>
                <label className='block text-gray-700 font-medium mb-2'>
                  Purpose:
                </label>
                <select
                  value={selectedBooking.purpose}
                  onChange={(e) =>
                    setSelectedBooking({
                      ...selectedBooking,
                      purpose: e.target.value,
                    })
                  }
                  className='w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value=''>-- Select Purpose --</option>
                  <option value='INTERVIEW'>Interview</option>
                  <option value='MEETING'>Meeting</option>
                  <option value='TRAINING'>Training</option>
                  <option value='CLIENT_MEETING'>Meet customers/partners</option>
                </select>
              </div>
              <div className='mb-4'>
                <label className='block text-gray-700 font-medium mb-2'>
                  Description:
                </label>
                <input
                  type='text'
                  value={selectedBooking.description}
                  onChange={(e) =>
                    setSelectedBooking({
                      ...selectedBooking,
                      description: e.target.value,
                    })
                  }
                  className='w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>
              <div className='flex justify-center space-x-4 mt-6'>
                <button
                  type='button'
                  className='bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded transition'
                  onClick={saveBooking}
                >
                  Save
                </button>
                <button
                  type='button'
                  className='bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-2 rounded transition'
                  onClick={closeEditForm}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Booking Confirmation Modal */}
      {isConfirming && selectedBooking && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
          <div className='bg-white rounded-lg shadow-xl w-full max-w-md p-8 transform transition-all'>
            <h3 className='text-2xl font-bold text-center mb-6'>
              Confirm Cancellation
            </h3>
            <p className='text-center text-gray-700 mb-6'>
              Are you sure you want to cancel the booking for room "
              {selectedBooking.roomName}"?
            </p>
            <div className='flex justify-center space-x-4'>
              <button
                className='bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded transition'
                onClick={cancelBooking}
              >
                Yes
              </button>
              <button
                className='bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-2 rounded transition'
                onClick={cancelDelete}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default MyRooms;
