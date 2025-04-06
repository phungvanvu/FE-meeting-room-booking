import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import API_BASE_URL from '../../config';
import { toast } from 'react-toastify';

const MyBookings = () => {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [editError, setEditError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [size, setSize] = useState(6);
  const [totalPages, setTotalPages] = useState(0);
  const [sort, setSort] = useState('startTime,asc');
  const accessToken = sessionStorage.getItem('accessToken');

  // Hàm helper lấy thời gian hiện tại theo local định dạng "YYYY-MM-DDTHH:mm"
  const getLocalDateTime = () => {
    const now = new Date();
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  };

  const fetchBookings = async () => {
    try {
      const url = new URL(`${API_BASE_URL}/roombooking/upcoming/my`);
      const params = {
        page: currentPage - 1,
        size: size,
        sort: sort,
      };
      if (searchTerm) params.roomName = searchTerm;
      if (startDateTime) params.fromTime = startDateTime;
      if (endDateTime) params.toTime = endDateTime;

      Object.keys(params).forEach((key) =>
        url.searchParams.append(key, params[key]),
      );

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setBookings(data.data.content);
        setTotalPages(data.data.totalPages);
      } else {
        console.error('Error fetching bookings:', data.error);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, sort]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchBookings();
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStartDateTime('');
    setEndDateTime('');
    setSelectedStatus('');
    setCurrentPage(1);
    fetchBookings();
  };

  // Các hàm xử lý chỉnh sửa và hủy booking như cũ
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
        toast.success('Update successfully!');
        setBookings(
          bookings.map((b) =>
            b.bookingId === data.data.bookingId ? data.data : b,
          ),
        );
        await fetchBookings();
        setIsEditing(false);
        setSelectedBooking(null);
      } else {
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
        toast.success('Deleted successfully!');
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
    <div className='flex flex-col min-h-screen bg-gray-50'>
      <Header />
      <main className='container mx-auto px-8 py-8 flex-grow'>
        <h2 className='text-2xl font-bold text-center mb-8'>My Bookings</h2>
        <div className='flex gap-6'>
          {/* Filter Sidebar */}
          <div className='w-1/4 bg-white p-6 rounded-2xl shadow-md border border-gray-200 h-full flex-shrink-0 flex flex-col'>
            <h2 className='text-xl font-semibold mb-5 text-gray-800'>Filter</h2>
            <div className='mb-4'>
              <label className='block text-sm font-bold text-gray-700 mb-2'>
                Room Name
              </label>
              <input
                type='text'
                placeholder='Enter the room name...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full border border-gray-300 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-gray-50 hover:bg-gray-100 transition-all shadow-sm'
              />
            </div>
            {/* DateTime Range Filter */}
            <div className='mb-4'>
              <label className='block text-sm font-bold text-gray-700 mb-2'>
                From
              </label>
              <input
                type='datetime-local'
                value={startDateTime}
                onChange={(e) => setStartDateTime(e.target.value)}
                min={getLocalDateTime()}
                className='w-full border border-gray-300 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-gray-50 hover:bg-gray-100 transition-all shadow-sm'
              />
            </div>
            <div className='mb-4'>
              <label className='block text-sm font-bold text-gray-700 mb-2'>
                To
              </label>
              <input
                type='datetime-local'
                value={endDateTime}
                onChange={(e) => setEndDateTime(e.target.value)}
                min={startDateTime || getLocalDateTime()}
                className='w-full border border-gray-300 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-gray-50 hover:bg-gray-100 transition-all shadow-sm'
              />
            </div>
            <div className='flex justify-between mt-auto pt-4 border-t border-gray-200'>
              <button
                onClick={resetFilters}
                className='w-1/2 mr-2 py-2 bg-gray-100 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-200 transition-all'
              >
                Reset
              </button>
              <button
                onClick={handleSearch}
                className='w-1/2 ml-2 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all'
              >
                Search
              </button>
            </div>
          </div>
          {/* Table hiển thị danh sách booking */}
          <div className='w-3/4 overflow-hidden'>
            <table className='min-w-full bg-white border border-gray-300 shadow-md text-sm'>
              <thead>
                <tr className='bg-gradient-to-r from-blue-500 to-blue-600 text-white'>
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
                    <td className='py-3 px-4'>
                      {(currentPage - 1) * size + index + 1}
                    </td>
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
            {/* Pagination */}
            {totalPages > 1 && (
              <div className='flex justify-center items-center mt-8 gap-2'>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${
                    currentPage === 1
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  <ChevronLeft size={18} />
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full font-medium transition-all ${
                      currentPage === index + 1
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-blue-100'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${
                    currentPage === totalPages
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
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
                  <option value='CLIENT_MEETING'>
                    Meet customers/partners
                  </option>
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

export default MyBookings;
