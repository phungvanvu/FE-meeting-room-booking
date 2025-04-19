import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import API_BASE_URL from '../../config';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'react-toastify';

const History = () => {
  // 1) State cho input form
  const [searchTerm, setSearchTerm] = useState('');
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // 2) State filters thực tế để call API
  const [filters, setFilters] = useState({
    roomName: '',
    fromTime: '',
    toTime: '',
    status: '',
  });

  // 3) State cho data và phân trang
  const [bookings, setBookings] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const accessToken = sessionStorage.getItem('accessToken');

  // Fetch bookings mỗi khi filters hoặc currentPage thay đổi
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (filters.roomName) queryParams.append('roomName', filters.roomName);
        if (filters.fromTime) queryParams.append('fromTime', filters.fromTime);
        if (filters.toTime) queryParams.append('toTime', filters.toTime);
        if (filters.status) queryParams.append('status', filters.status);
        queryParams.append('page', currentPage - 1);
        queryParams.append('size', itemsPerPage);

        const response = await fetch(
          `${API_BASE_URL}/roombooking/search-my?${queryParams.toString()}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        const data = await response.json();
        if (data.success) {
          setBookings(data.data.content);
          setTotalPages(data.data.totalPages);
        } else {
          console.error('Error fetching bookings:', data.error);
          toast.error('Error fetching booking history.');
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Network error when fetching booking history.');
      }
    };

    fetchBookings();
  }, [filters, currentPage, accessToken]);

  // Khi nhấn Search: cập nhật filters và reset page
  const handleSearch = () => {
    setCurrentPage(1);
    setFilters({
      roomName: searchTerm.trim(),
      fromTime: startDateTime,
      toTime: endDateTime,
      status: selectedStatus,
    });
  };

  // Khi nhấn Reset: clear inputs và filters, reset page
  const resetFilters = () => {
    setSearchTerm('');
    setStartDateTime('');
    setEndDateTime('');
    setSelectedStatus('');
    setCurrentPage(1);
    setFilters({ roomName: '', fromTime: '', toTime: '', status: '' });
  };

  return (
    <div className='flex flex-col min-h-screen bg-gray-50'>
      <Header />
      <main className='flex-grow'>
        <div className='flex flex-col p-6 w-full space-y-6'>
          <div className='flex space-x-6'>
            {/* Sidebar Filter */}
            <div className='w-1/5 bg-white p-6 rounded-2xl shadow-md border border-gray-200 h-full flex flex-col'>
              <h2 className='text-xl font-semibold mb-5 text-gray-800'>
                Filter
              </h2>

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

              <div className='mb-4'>
                <label className='block text-sm font-bold text-gray-700 mb-2'>
                  From
                </label>
                <input
                  type='datetime-local'
                  value={startDateTime}
                  onChange={(e) => setStartDateTime(e.target.value)}
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
                  className='w-full border border-gray-300 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-gray-50 hover:bg-gray-100 transition-all shadow-sm'
                />
              </div>

              <div className='mb-4'>
                <label className='block text-sm font-bold text-gray-700 mb-2'>
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className='w-full border border-gray-300 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-gray-50 hover:bg-gray-100 transition-all shadow-sm'
                >
                  <option value='' className='text-gray-400'>
                    Select status
                  </option>
                  <option value='CONFIRMED' className='text-gray-700'>
                    CONFIRMED
                  </option>
                  <option value='CANCELLED' className='text-gray-700'>
                    CANCELLED
                  </option>
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

            {/* Booking History Table */}
            <div className='w-4/5 overflow-hidden'>
              <h2 className='text-center text-2xl font-bold mb-4'>
                Booking History
              </h2>
              <table className='min-w-full bg-white border border-gray-300 shadow-md text-sm'>
                <thead>
                  <tr className='bg-gray-200'>
                    <th className='py-2 px-4 border'>No.</th>
                    <th className='py-2 px-4 border'>Room</th>
                    <th className='py-2 px-4 border'>Start Time</th>
                    <th className='py-2 px-4 border'>End Time</th>
                    <th className='py-2 px-4 border'>Booked At</th>
                    <th className='py-2 px-4 border'>Purpose</th>
                    <th className='py-2 px-4 border'>Description</th>
                    <th className='py-2 px-4 border'>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking, index) => (
                    <tr
                      key={booking.bookingId}
                      className='border-b hover:bg-gray-100 transition'
                    >
                      <td className='py-2 px-4 border'>
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className='py-2 px-4 border'>{booking.roomName}</td>
                      <td className='py-2 px-4 border'>{booking.startTime}</td>
                      <td className='py-2 px-4 border'>{booking.endTime}</td>
                      <td className='py-2 px-4 border'>{booking.createdAt}</td>
                      <td className='py-2 px-4 border'>{booking.purpose}</td>
                      <td className='py-2 px-4 border'>
                        {booking.description}
                      </td>
                      <td
                        className={`py-2 px-4 border ${
                          booking.status === 'CONFIRMED'
                            ? 'text-teal-600'
                            : 'text-red-600'
                        }`}
                      >
                        {booking.status}
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
                  {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(
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
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default History;
