import React, { useState, useEffect } from 'react';
import DeleteConfirmModal from '../../components/DeleteConfirmModal';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import API_BASE_URL from '../../config';
import { toast } from 'react-toastify';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ManageBookings = () => {
  // --- Filters & data ---
  const [roomName, setRoomName] = useState('');
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [bookedByNameFilter, setBookedByNameFilter] = useState('');
  const [bookings, setBookings] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // --- Bulk selection ---
  const [selectedBookingIds, setSelectedBookingIds] = useState([]);

  // --- Edit/Create Form ---
  const [showForm, setShowForm] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [currentBooking, setCurrentBooking] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    roomId: '',
    roomName: '',
    bookedById: '',
    userName: '',
    startTime: '',
    endTime: '',
    purpose: 'MEETING',
    description: '',
    status: 'CONFIRMED',
  });

  // --- Search autocomplete ---
  const [roomSearchQuery, setRoomSearchQuery] = useState('');
  const [roomSuggestions, setRoomSuggestions] = useState([]);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userSuggestions, setUserSuggestions] = useState([]);

  // --- Confirm modals state ---
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [pendingCancelId, setPendingCancelId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [showBulkCancelConfirm, setShowBulkCancelConfirm] = useState(false);

  // Hàm helper lấy thời gian hiện tại theo local định dạng "YYYY-MM-DDTHH:mm"
  const getLocalDateTime = () => {
    const now = new Date();
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  };

  const accessToken = sessionStorage.getItem('accessToken');
  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: accessToken ? `Bearer ${accessToken}` : '',
  });

  // --- Fetch bookings API: endpoint /roombooking/search ---
  const fetchBookings = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (roomName) queryParams.append('roomName', roomName);
      if (fromTime) queryParams.append('fromTime', fromTime);
      if (toTime) queryParams.append('toTime', toTime);
      if (selectedStatus) queryParams.append('status', selectedStatus);
      if (bookedByNameFilter)
        queryParams.append('bookedByName', bookedByNameFilter);
      // API pagination starts from 0
      queryParams.append('page', currentPage - 1);
      queryParams.append('size', itemsPerPage);

      const response = await fetch(
        `${API_BASE_URL}/roombooking/search?${queryParams.toString()}`,
        { headers: getAuthHeaders() },
      );
      const data = await response.json();
      if (data.success) {
        setBookings(data.data.content);
        setTotalPages(data.data.totalPages);
        setSelectedBookingIds([]);
      } else {
        const errorMsg =
          data.error && typeof data.error === 'object'
            ? data.error.message
            : data.error;
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Error fetching bookings');
    }
  };

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    roomName,
    fromTime,
    toTime,
    selectedStatus,
    bookedByNameFilter,
    currentPage,
  ]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchBookings();
  };

  const resetFilters = () => {
    setRoomName('');
    setFromTime('');
    setToTime('');
    setSelectedStatus('');
    setBookedByNameFilter('');
    setCurrentPage(1);
    fetchBookings();
  };

  // --- CRUD: Create / Update Booking ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Khi nhấn nút Edit, điền dữ liệu của booking hiện tại vào form (bao gồm luôn bookingId)
  const handleEditBooking = (booking) => {
    setCurrentBooking(booking);
    setFormData({
      bookingId: booking.bookingId, // Thêm bookingId để payload update đầy đủ
      roomId: booking.roomId,
      roomName: booking.roomName,
      bookedById: booking.bookedById,
      userName: booking.userName,
      startTime: booking.startTime,
      endTime: booking.endTime,
      purpose: booking.purpose,
      description: booking.description,
      status: booking.status || 'CONFIRMED',
    });
    // Pre-fill search input
    setRoomSearchQuery(booking.roomName);
    setUserSearchQuery(booking.userName);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationErrors({});
    setErrorMessage('');

    try {
      const method = currentBooking ? 'PUT' : 'POST';
      const url = currentBooking
        ? `${API_BASE_URL}/roombooking/${currentBooking.bookingId}`
        : `${API_BASE_URL}/roombooking`;

      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(
          currentBooking
            ? 'Booking updated successfully'
            : 'Booking created successfully',
        );
        setShowForm(false);
        setCurrentBooking(null);
        setFormData({
          roomId: '',
          roomName: '',
          bookedById: '',
          userName: '',
          startTime: '',
          endTime: '',
          purpose: 'MEETING',
          description: '',
          status: 'CONFIRMED',
        });
        setRoomSearchQuery('');
        setUserSearchQuery('');
        fetchBookings();
      } else {
        if (data.data) {
          setValidationErrors(data.data);
          return;
        }
        const errorMsg =
          data.error && typeof data.error === 'object'
            ? data.error.message
            : data.error || 'Error saving booking';
        setErrorMessage(errorMsg);
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      setErrorMessage('Server error');
    }
  };

  // --- Prompt modals ---
  const promptCancelBooking = (id) => {
    setPendingCancelId(id);
    setShowCancelModal(true);
  };
  const promptDeleteBooking = (id) => {
    setPendingDeleteId(id);
    setShowDeleteModal(true);
  };

  // --- Confirm cancellation ---
  const handleConfirmCancel = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/roombooking/cancel/${pendingCancelId}`,
        { method: 'PUT', headers: getAuthHeaders() },
      );
      const data = await res.json();
      if (data.success) {
        toast.success('Booking cancelled successfully');
      } else {
        toast.error(
          data.error?.message || data.error || 'Error cancelling booking',
        );
      }
      fetchBookings();
    } catch (err) {
      console.error('Error cancelling booking:', err);
      toast.error('Error cancelling booking');
    } finally {
      setShowCancelModal(false);
      setPendingCancelId(null);
    }
  };

  // --- Confirm delete ---
  const handleConfirmDelete = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/roombooking/${pendingDeleteId}`,
        { method: 'DELETE', headers: getAuthHeaders() },
      );
      const data = await res.json();
      if (data.success) {
        toast.success('Booking deleted successfully');
      } else {
        toast.error(
          data.error?.message || data.error || 'Error deleting booking',
        );
      }
      fetchBookings();
    } catch (err) {
      console.error('Error deleting booking:', err);
      toast.error('Error deleting booking');
    } finally {
      setShowDeleteModal(false);
      setPendingDeleteId(null);
    }
  };

  // --- Cancel modal handler ---
  const handleCancelModal = () => {
    setShowCancelModal(false);
    setShowDeleteModal(false);
    setPendingCancelId(null);
    setPendingDeleteId(null);
  };

  // --- Bulk Cancel ---
  const handleBulkCancel = () => {
    if (selectedBookingIds.length === 0) {
      toast.error('Please select at least one booking to cancel.');
      return;
    }
    setShowBulkCancelConfirm(true);
  };
  const confirmBulkCancel = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/roombooking/cancel-multiple`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(selectedBookingIds),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Selected bookings cancelled successfully');
        fetchBookings();
      } else {
        toast.error(
          data.error?.message || data.error || 'Error cancelling bookings',
        );
      }
    } catch (err) {
      console.error('Error in bulk cancellation:', err);
      toast.error('Error in bulk cancellation');
    } finally {
      setShowBulkCancelConfirm(false);
    }
  };

  // --- Export Excel ---
  const handleExportExcel = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/roombooking/export-bookings-excel`,
        {
          headers: getAuthHeaders(),
        },
      );
      if (!response.ok) throw new Error('Error downloading file');
      const disposition = response.headers.get('Content-Disposition');
      const filenameMatch =
        disposition && disposition.match(/filename=([^;]+)/);
      let filename = filenameMatch && filenameMatch[1];
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Error exporting excel');
    }
  };

  // --- Toggle select/deselect booking ---
  const toggleSelectBooking = (bookingId) => {
    setSelectedBookingIds((prev) =>
      prev.includes(bookingId)
        ? prev.filter((id) => id !== bookingId)
        : [...prev, bookingId],
    );
  };

  // --- Fetch Room Suggestions ---
  const fetchRoomSuggestions = async (query) => {
    if (!query) {
      setRoomSuggestions([]);
      return;
    }
    try {
      const params = new URLSearchParams();
      params.append('roomName', query);
      params.append('size', 6);
      params.append('page', 0);
      const response = await fetch(
        `${API_BASE_URL}/room/search?${params.toString()}`,
        { headers: getAuthHeaders() },
      );
      const data = await response.json();
      if (data.success) {
        setRoomSuggestions(data.data.content);
      }
    } catch (error) {
      console.error('Error fetching room suggestions:', error);
    }
  };

  // --- Fetch User Suggestions ---
  const fetchUserSuggestions = async (query) => {
    if (!query) {
      setUserSuggestions([]);
      return;
    }
    try {
      const params = new URLSearchParams();
      // Giả sử API có hỗ trợ tìm kiếm theo fullName hoặc userName
      params.append('fullName', query);
      params.append('size', 10);
      params.append('page', 0);
      const response = await fetch(
        `${API_BASE_URL}/user/search?${params.toString()}`,
        { headers: getAuthHeaders() },
      );
      const data = await response.json();
      if (data.success) {
        setUserSuggestions(data.data.content);
      }
    } catch (error) {
      console.error('Error fetching user suggestions:', error);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setValidationErrors({});
    setErrorMessage('');
    setCurrentBooking(null);
    setRoomSearchQuery('');
    setUserSearchQuery('');
    setFormData({
      roomId: '',
      roomName: '',
      bookedById: '',
      userName: '',
      startTime: '',
      endTime: '',
      purpose: 'MEETING',
      description: '',
      status: 'CONFIRMED',
    });
  };

  return (
    <div className='min-h-screen flex flex-col bg-gray-50'>
      <Header />
      <div className='flex-grow mx-auto mt-10 flex gap-4 mb-10 px-6 w-full'>
        {/* Filter Sidebar */}
        <div className='w-1/5 bg-white p-6 rounded-2xl shadow-md border border-gray-200 flex flex-col'>
          <h2 className='text-xl font-semibold mb-5 text-gray-800'>
            Filter Bookings
          </h2>
          <div className='mb-4'>
            <label className='block text-sm font-bold text-gray-700 mb-2'>
              Booked By
            </label>
            <input
              type='text'
              placeholder='Enter user name...'
              value={bookedByNameFilter}
              onChange={(e) => setBookedByNameFilter(e.target.value)}
              className='w-full border border-gray-300 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-blue-400'
            />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-bold text-gray-700 mb-2'>
              Room Name
            </label>
            <input
              type='text'
              placeholder='Enter room name...'
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className='w-full border border-gray-300 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-blue-400'
            />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-bold text-gray-700 mb-2'>
              From Time
            </label>
            <input
              type='datetime-local'
              value={fromTime}
              onChange={(e) => setFromTime(e.target.value)}
              className='w-full border border-gray-300 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-blue-400'
            />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-bold text-gray-700 mb-2'>
              To Time
            </label>
            <input
              type='datetime-local'
              value={toTime}
              onChange={(e) => setToTime(e.target.value)}
              className='w-full border border-gray-300 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-blue-400'
            />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-bold text-gray-700 mb-2'>
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className='w-full border border-gray-300 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-blue-400'
            >
              <option value=''>Select status</option>
              <option value='CONFIRMED'>CONFIRMED</option>
              <option value='CANCELLED'>CANCELLED</option>
            </select>
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

        {/* Booking List & Actions */}
        <div className='w-4/5'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-2xl font-bold text-gray-800'>Booking List</h2>
            <div className='flex gap-3'>
              <button
                onClick={() => {
                  setCurrentBooking(null);
                  setFormData({
                    roomId: '',
                    roomName: '',
                    bookedById: '',
                    userName: '',
                    startTime: '',
                    endTime: '',
                    purpose: 'MEETING',
                    description: '',
                    status: 'CONFIRMED',
                  });
                  setRoomSearchQuery('');
                  setUserSearchQuery('');
                  setRoomSuggestions([]);
                  setUserSuggestions([]);
                  setShowForm(true);
                }}
                className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow transition'
              >
                Create Booking
              </button>
              <button
                onClick={handleBulkCancel}
                className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow transition'
              >
                Cancel Selected
              </button>
              <button
                onClick={handleExportExcel}
                className='bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow transition'
              >
                Export Excel
              </button>
            </div>
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
                      className='h-5 w-5 text-blue-600 border-gray-300 rounded'
                    />
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Room
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Booked By
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Start Time
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    End Time
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Purpose
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Status
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Description
                  </th>
                  <th className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {bookings.map((booking) => (
                  <tr key={booking.bookingId} className='hover:bg-gray-50'>
                    <td className='px-4 py-4 text-center'>
                      <input
                        type='checkbox'
                        checked={selectedBookingIds.includes(booking.bookingId)}
                        onChange={() => toggleSelectBooking(booking.bookingId)}
                        className='h-5 w-5 text-blue-600 border-gray-300 rounded'
                      />
                    </td>
                    <td className='px-6 py-4'>{booking.roomName}</td>
                    <td className='px-6 py-4'>{booking.userName}</td>
                    <td className='px-6 py-4'>{booking.startTime}</td>
                    <td className='px-6 py-4'>{booking.endTime}</td>
                    <td className='px-6 py-4'>{booking.purpose}</td>
                    <td className='px-6 py-4'>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'CONFIRMED'
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'CANCELLED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className='px-6 py-4'>{booking.description}</td>
                    <td className='px-6 py-4 text-center space-x-2'>
                      <button
                        onClick={() => handleEditBooking(booking)}
                        className='text-blue-500 hover:text-blue-700 text-sm font-medium'
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => promptCancelBooking(booking.bookingId)}
                        className='text-orange-500 hover:text-orange-600 text-sm font-medium'
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => promptDeleteBooking(booking.bookingId)}
                        className='text-red-500 hover:text-red-700 text-sm font-medium'
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
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

      {/* Modal Form cho Create/Update Booking */}
      {showForm && (
        <div className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50'>
          <div className='bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4'>
            <div className='border-b px-6 py-4'>
              <h2 className='text-2xl font-bold text-gray-800'>
                {currentBooking ? 'Edit Booking' : 'Add Booking'}
              </h2>
              {errorMessage && (
                <div className='mt-3 p-3 bg-red-100 text-red-700 rounded text-sm text-center'>
                  {errorMessage}
                </div>
              )}
            </div>
            <form className='px-6 py-4' onSubmit={handleSubmit}>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* Select Room (searchable) */}
                <div className='relative'>
                  <label className='block text-sm font-medium text-gray-700 mb-1 after:content-["*"] after:ml-0.5 after:text-red-500 after:text-base'>
                    Select Room
                  </label>
                  <input
                    type='text'
                    placeholder='Enter room keyword...'
                    value={roomSearchQuery}
                    onChange={(e) => {
                      setRoomSearchQuery(e.target.value);
                      fetchRoomSuggestions(e.target.value);
                    }}
                    className={`block w-full rounded-md shadow-sm focus:ring-2 ${
                      validationErrors.roomId
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-blue-400 focus:ring-blue-400'
                    }`}
                  />
                  {roomSuggestions.length > 0 && (
                    <ul className='absolute bg-white w-full border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto z-10'>
                      {roomSuggestions.map((room) => (
                        <li
                          key={room.roomId}
                          className='px-3 py-2 hover:bg-blue-100 cursor-pointer'
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              roomId: room.roomId,
                              roomName: room.roomName,
                            }));
                            setRoomSearchQuery(room.roomName);
                            setRoomSuggestions([]);
                          }}
                        >
                          {room.roomName} (Capacity: {room.capacity}, Location:{' '}
                          {room.location})
                        </li>
                      ))}
                    </ul>
                  )}
                  {validationErrors.roomId && (
                    <p className='mt-1 text-sm text-red-600'>
                      {validationErrors.roomId[0]}
                    </p>
                  )}
                </div>

                {/* Select User (searchable) */}
                <div className='relative'>
                  <label className='block text-sm font-medium text-gray-700 mb-1 after:content-["*"] after:ml-0.5 after:text-red-500 after:text-base'>
                    Select User
                  </label>
                  <input
                    type='text'
                    placeholder='Enter user keyword...'
                    value={userSearchQuery}
                    onChange={(e) => {
                      setUserSearchQuery(e.target.value);
                      fetchUserSuggestions(e.target.value);
                    }}
                    className={`block w-full rounded-md shadow-sm focus:ring-2 ${
                      validationErrors.bookedById
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-blue-400 focus:ring-blue-400'
                    }`}
                  />
                  {userSuggestions.length > 0 && (
                    <ul className='absolute bg-white w-full border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto z-10'>
                      {userSuggestions.map((user) => (
                        <li
                          key={user.userId}
                          className='px-3 py-2 hover:bg-blue-100 cursor-pointer'
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              bookedById: user.userId,
                              userName: user.userName
                                ? `${user.userName} - ${user.fullName}`
                                : user.fullName,
                            }));
                            setUserSearchQuery(
                              user.userName
                                ? `${user.userName} - ${user.fullName}`
                                : user.fullName,
                            );
                            setUserSuggestions([]);
                          }}
                        >
                          {user.userName
                            ? `${user.userName} - ${user.fullName}`
                            : user.fullName}{' '}
                          ({user.department})
                        </li>
                      ))}
                    </ul>
                  )}
                  {validationErrors.bookedById && (
                    <p className='mt-1 text-sm text-red-600'>
                      {validationErrors.bookedById[0]}
                    </p>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1 after:content-["*"] after:ml-0.5 after:text-red-500'>
                    Start Time
                  </label>
                  <input
                    type='datetime-local'
                    name='startTime'
                    value={formData.startTime}
                    onChange={handleInputChange}
                    min={getLocalDateTime()}
                    className={`block w-full rounded-md py-2 px-3 focus:ring-2 ${
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
                  <label className='block text-sm font-medium text-gray-700 mb-1 after:content-["*"] after:ml-0.5 after:text-red-500 after:text-base'>
                    End Time
                  </label>
                  <input
                    type='datetime-local'
                    name='endTime'
                    value={formData.endTime}
                    onChange={handleInputChange}
                    min={formData.startTime || getLocalDateTime()}
                    className={`block w-full rounded-md shadow-sm py-2 px-3 focus:ring-2 ${
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

                {/* Purpose */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1 after:content-["*"] after:ml-0.5 after:text-red-500 after:text-base'>
                    Purpose
                  </label>
                  <select
                    name='purpose'
                    value={formData.purpose}
                    onChange={handleInputChange}
                    className={`block w-full rounded-md shadow-sm py-2 px-3 focus:ring-2 ${
                      validationErrors.purpose
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-blue-400 focus:ring-blue-400'
                    }`}
                  >
                    <option value='INTERVIEW'>INTERVIEW</option>
                    <option value='MEETING'>MEETING</option>
                    <option value='TRAINING'>TRAINING</option>
                    <option value='CLIENT_MEETING'>CLIENT_MEETING</option>
                  </select>
                  {validationErrors.purpose && (
                    <p className='mt-1 text-sm text-red-600'>
                      {validationErrors.purpose[0]}
                    </p>
                  )}
                </div>

                {/* Status Toggle */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1 after:content-["*"] after:ml-0.5 after:text-red-500 after:text-base'>
                    Status
                  </label>
                  <select
                    name='status'
                    value={formData.status}
                    onChange={handleInputChange}
                    className={`block w-full rounded-md shadow-sm py-2 px-3 focus:ring-2 ${
                      validationErrors.status
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-blue-400 focus:ring-blue-400'
                    }`}
                  >
                    <option value='CONFIRMED'>CONFIRMED</option>
                    <option value='CANCELLED'>CANCELLED</option>
                  </select>
                  {validationErrors.status && (
                    <p className='mt-1 text-sm text-red-600'>
                      {validationErrors.status[0]}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className='md:col-span-2'>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Description
                  </label>
                  <textarea
                    name='description'
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder='Enter description...'
                    rows={4}
                    className={`block w-full rounded-md shadow-sm py-2 px-3 focus:ring-2 ${
                      validationErrors.description
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-blue-400 focus:ring-blue-400'
                    }`}
                  ></textarea>
                  {validationErrors.description && (
                    <p className='mt-1 text-sm text-red-600'>
                      {validationErrors.description[0]}
                    </p>
                  )}
                </div>
              </div>
              <div className='flex justify-end mt-6'>
                <button
                  type='submit'
                  className='mr-3 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition'
                >
                  Save
                </button>
                <button
                  type='button'
                  onClick={handleCloseForm}
                  className='px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-200 transition'
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk‑cancel modal */}
      {showBulkCancelConfirm && (
        <DeleteConfirmModal
          message='Are you sure you want to cancel the selected bookings?'
          onConfirm={confirmBulkCancel}
          onCancel={() => setShowBulkCancelConfirm(false)}
        />
      )}

      {/* Single‑cancel modal */}
      {showCancelModal && (
        <DeleteConfirmModal
          message='Are you sure you want to cancel this booking?'
          onConfirm={handleConfirmCancel}
          onCancel={handleCancelModal}
        />
      )}

      {/* Single‑delete modal */}
      {showDeleteModal && (
        <DeleteConfirmModal
          message='Are you sure you want to delete this booking?'
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelModal}
        />
      )}

      <Footer />
    </div>
  );
};

export default ManageBookings;
