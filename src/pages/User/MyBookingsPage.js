import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import API_BASE_URL from '../../config';
import { toast } from 'react-toastify';

const MyBookingsPage = () => {
  // State quản lý booking và thao tác liên quan
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedBookingIds, setSelectedBookingIds] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [editError, setEditError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  // Các state phân trang và sắp xếp
  const [currentPage, setCurrentPage] = useState(1);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [sort] = useState('startTime,asc');
  const accessToken = sessionStorage.getItem('accessToken');

  // Hàm trả về thời gian hiện tại định dạng "YYYY-MM-DDTHH:mm" theo local time
  const getLocalDateTime = () => {
    const now = new Date();
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  };

  // Lấy danh sách booking của chính user
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
  }, [currentPage, sort]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchBookings();
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStartDateTime('');
    setEndDateTime('');
    setCurrentPage(1);
    fetchBookings();
  };

  const handleEdit = (booking) => {
    setSelectedBooking(booking);
    setEditError(null);
    setIsEditing(true);
  };

  const handleDelete = (booking) => {
    setSelectedBooking(booking);
    setIsConfirming(true);
  };

  const handleSelectBooking = (bookingId) => {
    setSelectedBookingIds((prevSelected) =>
      prevSelected.includes(bookingId)
        ? prevSelected.filter((id) => id !== bookingId)
        : [...prevSelected, bookingId],
    );
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
      status: selectedBooking.status,
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
        toast.success('Cancel successfully!');
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

  const cancelMultipleBookings = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/roombooking/cancel-multiple`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(selectedBookingIds),
        },
      );

      const data = await response.json();
      if (data.success) {
        toast.success(data.data);
        setBookings(
          bookings.filter((b) => !selectedBookingIds.includes(b.bookingId)),
        );
        setSelectedBookingIds([]);
        setIsConfirming(false);
      } else {
        console.error('Cancel multiple bookings failed:', data.error);
        toast.error('Batch cancellation failed.');
      }
    } catch (error) {
      console.error('Error cancelling multiple bookings:', error);
      toast.error('An error occurred while cancelling bookings.');
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
    <div className='min-h-screen flex flex-col bg-gray-50'>
      <Header />
      <div className='flex-grow mx-auto mt-10 flex gap-4 mb-10 px-6 w-full'>
        {/* Filter Sidebar */}
        <div className='w-1/5 bg-white p-6 rounded-2xl shadow-md border border-gray-200 flex flex-col'>
          <h2 className='text-xl font-semibold mb-5 text-gray-800'>Filter</h2>
          <div className='mb-4'>
            <label className='block text-sm font-bold text-gray-700 mb-2'>
              Room Name
            </label>
            <input
              type='text'
              placeholder='Enter room name...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full border border-gray-300 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-blue-400 bg-gray-50 hover:bg-gray-100 transition-all shadow-sm'
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
              className='w-full border border-gray-300 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-blue-400 bg-gray-50 hover:bg-gray-100 transition-all shadow-sm'
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
              className='w-full border border-gray-300 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-blue-400 bg-gray-50 hover:bg-gray-100 transition-all shadow-sm'
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
        {/* Booking List */}
        <div className='w-4/5'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-2xl font-bold text-gray-800'>My Bookings</h2>
            {/* Always visible Cancel Selected button */}
            <button
              className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow transition'
              onClick={() => {
                if (selectedBookingIds.length === 0) {
                  toast.error('Please select at least one booking to cancel.');
                  return;
                }
                setIsConfirming(true);
              }}
            >
              Cancel Selected
            </button>
          </div>
          <div className='overflow-x-auto bg-white rounded-xl shadow-md'>
            <table className='min-w-full table-fixed'>
              <thead className='bg-gray-200'>
                <tr>
                  <th className='px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    <input
                      type='checkbox'
                      onChange={(e) => {
                        if (e.target.checked) {
                          const allIds = bookings.map((b) => b.bookingId);
                          setSelectedBookingIds(allIds);
                        } else {
                          setSelectedBookingIds([]);
                        }
                      }}
                      checked={
                        bookings.length > 0 &&
                        selectedBookingIds.length === bookings.length
                      }
                      className='h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                    />
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    No.
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Room Name
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Start Time
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    End Time
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Booked At
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Purpose
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Description
                  </th>
                  <th className='px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {bookings.map((booking, index) => (
                  <tr
                    key={booking.bookingId}
                    className='hover:bg-gray-100 transition'
                  >
                    <td className='px-4 py-3 text-center'>
                      <input
                        type='checkbox'
                        checked={selectedBookingIds.includes(booking.bookingId)}
                        onChange={() => handleSelectBooking(booking.bookingId)}
                        className='h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                      />
                    </td>
                    <td className='px-4 py-3'>
                      {(currentPage - 1) * size + index + 1}
                    </td>
                    <td className='px-4 py-3'>{booking.roomName}</td>
                    <td className='px-4 py-3'>{booking.startTime}</td>
                    <td className='px-4 py-3'>{booking.endTime}</td>
                    <td className='px-4 py-3'>{booking.createdAt}</td>
                    <td className='px-4 py-3'>{booking.purpose}</td>
                    <td className='px-4 py-3'>{booking.description}</td>
                    <td className='px-4 py-3 text-center'>
                      <button
                        onClick={() => handleEdit(booking)}
                        className='text-blue-600 font-semibold hover:underline mr-2 text-sm'
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(booking)}
                        className='text-red-600 font-semibold hover:underline text-sm'
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Phân trang */}
          {totalPages > 1 && (
            <div className='flex justify-center items-center mt-8 gap-2'>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${
                  currentPage === 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                <ChevronLeft size={18} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full font-medium transition-all ${
                      currentPage === page
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-blue-100'
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}
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

      {/* Modal Edit Booking */}
      {isEditing && selectedBooking && (
        <div className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50'>
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
                  min={getLocalDateTime()}
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
                  min={selectedBooking.startTime || getLocalDateTime()}
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

      {/* Modal Confirm Cancel */}
      {isConfirming && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50'>
          <div className='bg-white rounded-xl shadow-xl p-8 max-w-sm w-full'>
            <h3 className='text-2xl font-semibold text-gray-800 text-center mb-4'>
              Confirm Cancel
            </h3>
            <p className='text-center text-gray-600 mb-6'>
              {selectedBookingIds.length > 0
                ? 'Are you sure you want to cancel the selected bookings?'
                : `Are you sure you want to cancel the booking for room "${selectedBooking?.roomName}"?`}
            </p>
            <div className='flex justify-center space-x-4'>
              <button
                className='px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition'
                onClick={() => {
                  if (selectedBookingIds.length > 0) {
                    cancelMultipleBookings();
                  } else if (selectedBooking) {
                    cancelBooking();
                  }
                }}
              >
                Yes
              </button>
              <button
                className='px-5 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 transition'
                onClick={() => {
                  setIsConfirming(false);
                  if (!selectedBookingIds.length) setSelectedBooking(null);
                }}
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

export default MyBookingsPage;
