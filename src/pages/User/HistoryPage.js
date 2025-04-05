import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import API_BASE_URL from '../../config';

const History = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const [bookings, setBookings] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const accessToken = sessionStorage.getItem('accessToken');

  const fetchBookings = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (searchTerm) queryParams.append('roomName', searchTerm);
      if (startDateTime) queryParams.append('fromTime', startDateTime);
      if (endDateTime) queryParams.append('toTime', endDateTime);
      if (selectedStatus) queryParams.append('status', selectedStatus);
      // API phân trang bắt đầu từ 0
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
        // API trả về dữ liệu dạng Page: { content, totalPages, ... }
        setBookings(data.data.content);
        setTotalPages(data.data.totalPages);
      } else {
        console.error('Error fetching bookings:', data.error);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  // Gọi API mỗi khi các tham số lọc hoặc trang hiện tại thay đổi
  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, startDateTime, endDateTime, selectedStatus, currentPage]);

  const handleSearch = () => {
    // Khi thực hiện tìm kiếm, reset currentPage về 1
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

  return (
    <div className='flex flex-col min-h-screen bg-gray-50'>
      <Header />
      <main className='flex-grow'>
        <div className='flex flex-col p-6 w-full space-y-6'>
          <div className='flex space-x-6'>
            {/* Filter Sidebar */}
            <div className='w-1/4 bg-white p-6 rounded-2xl shadow-md border border-gray-200 h-full flex-shrink-0 flex flex-col'>
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

              {/* DateTime Range Filter */}
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

            {/* Booking Table */}
            <div className='w-3/4 overflow-hidden'>
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
              <div className='flex justify-center items-center mt-4'>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className='border border-gray-300 text-gray-700 rounded py-2 px-4 hover:bg-gray-200 transition'
                >
                  &laquo;
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`border border-gray-300 text-gray-700 py-2 px-4 transition mx-1 ${
                      currentPage === index + 1
                        ? 'bg-blue-700 text-white'
                        : 'hover:bg-gray-200'
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
                  className='border border-gray-300 text-gray-700 rounded py-2 px-4 hover:bg-gray-200 transition'
                >
                  &raquo;
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default History;
