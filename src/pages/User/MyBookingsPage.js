import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import API_BASE_URL from '../../config';

const MyRooms = () => {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [bookings, setBookings] = useState([]);

  const accessToken = sessionStorage.getItem('accessToken');

  // Lấy danh sách booking sắp tới của người dùng hiện tại
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

  // Mở form sửa booking
  const handleEdit = (booking) => {
    setSelectedBooking(booking);
    setIsEditing(true);
  };

  // Mở form xác nhận hủy booking
  const handleDelete = (booking) => {
    setSelectedBooking(booking);
    setIsConfirming(true);
  };

  // Lưu cập nhật booking
  const saveBooking = async () => {
    // Chuẩn bị dữ liệu cập nhật theo yêu cầu của API
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
        `${API_BASE_URL}/roombooking/${selectedBooking.bookingId}`, // thêm bookingId vào URL
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
        console.error('Update failed:', data.error);
      }
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  // Hủy booking: chuyển trạng thái sang CANCELLED
  const cancelBooking = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/roombooking/cancel/${selectedBooking.bookingId}`,
        {
          method: 'PUT', // hoặc POST tùy API thiết kế
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const data = await response.json();
      if (data.success) {
        // Có thể loại bỏ booking vừa hủy khỏi danh sách hoặc cập nhật trạng thái của nó
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
  };

  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <h2
        className='text-xl font-bold mb-4 text-center'
        style={{ marginTop: '20px' }}
      >
        My Bookings
      </h2>
      <div className='flex-grow flex justify-center'>
        <div className='w-full max-w-5xl'>
          <table className='min-w-full bg-white border border-gray-300 shadow-md text-sm'>
            <thead>
              <tr className='bg-gray-200'>
                <th className='py-2 px-2 border'>STT</th>
                <th className='py-2 px-2 border'>Tên Phòng</th>
                <th className='py-2 px-2 border'>Thời gian bắt đầu</th>
                <th className='py-2 px-2 border'>Thời gian kết thúc</th>
                <th className='py-2 px-2 border'>Đặt phòng lúc</th>
                <th className='py-2 px-2 border'>Mục đích</th>
                <th className='py-2 px-2 border'>Mô tả</th>
                <th className='py-2 px-2 border text-center'>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <tr
                  key={booking.bookingId}
                  className='border-b hover:bg-gray-100 transition'
                >
                  <td className='py-2 px-2 border'>{index + 1}</td>
                  <td className='py-2 px-2 border'>{booking.roomName}</td>
                  <td className='py-2 px-2 border'>{booking.startTime}</td>
                  <td className='py-2 px-2 border'>{booking.endTime}</td>
                  <td className='py-2 px-2 border'>{booking.createdAt}</td>
                  <td className='py-2 px-2 border'>{booking.purpose}</td>
                  <td className='py-2 px-2 border'>{booking.description}</td>
                  <td className='py-2 px-2 border text-center'>
                    <button
                      className='text-blue-500 hover:underline'
                      onClick={() => handleEdit(booking)}
                    >
                      Sửa
                    </button>
                    <button
                      className='text-red-500 hover:underline ml-2'
                      onClick={() => handleDelete(booking)}
                    >
                      Hủy
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form sửa booking */}
      {isEditing && selectedBooking && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
          <div
            className='bg-white p-4 rounded shadow-lg'
            style={{ width: '350px' }}
          >
            <h3 className='text-lg justify-center font-bold mb-4'>
              Sửa booking
            </h3>
            <form>
              <div className='mb-2'>
                <label className='block'>Thời gian bắt đầu:</label>
                <input
                  type='datetime-local'
                  value={selectedBooking.startTime}
                  onChange={(e) =>
                    setSelectedBooking({
                      ...selectedBooking,
                      startTime: e.target.value,
                    })
                  }
                  className='border rounded w-full'
                />
              </div>
              <div className='mb-2'>
                <label className='block'>Thời gian kết thúc:</label>
                <input
                  type='datetime-local'
                  value={selectedBooking.endTime}
                  onChange={(e) =>
                    setSelectedBooking({
                      ...selectedBooking,
                      endTime: e.target.value,
                    })
                  }
                  className='border rounded w-full'
                />
              </div>
              <div className='mb-2'>
                <label className='block'>Mục đích:</label>
                <input
                  type='text'
                  value={selectedBooking.purpose}
                  onChange={(e) =>
                    setSelectedBooking({
                      ...selectedBooking,
                      purpose: e.target.value,
                    })
                  }
                  className='border rounded w-full'
                />
              </div>
              <div className='mb-2'>
                <label className='block'>Mô tả:</label>
                <input
                  type='text'
                  value={selectedBooking.description}
                  onChange={(e) =>
                    setSelectedBooking({
                      ...selectedBooking,
                      description: e.target.value,
                    })
                  }
                  className='border rounded w-full'
                />
              </div>
              <div className='flex justify-center mt-4'>
                <button
                  type='button'
                  className='border border-gray-300 text-blue-700 px-4 py-2 rounded mr-2 hover:bg-blue-300 hover:text-black'
                  onClick={saveBooking}
                >
                  Lưu
                </button>
                <button
                  type='button'
                  className='border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 hover:text-black'
                  onClick={closeEditForm}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Form xác nhận hủy booking */}
      {isConfirming && selectedBooking && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
          <div className='bg-white p-4 rounded shadow-lg'>
            <h3 className='text-lg font-bold mb-4'>Xác nhận hủy</h3>
            <p>
              Bạn có chắc chắn muốn hủy booking tại phòng "
              {selectedBooking.roomName}" không?
            </p>
            <div className='flex justify-center mt-4'>
              <button
                className='border border-red-500 text-red-500 px-4 py-2 rounded mr-2 hover:bg-red-500 hover:text-white'
                onClick={cancelBooking}
              >
                Có
              </button>
              <button
                className='border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 hover:text-black'
                onClick={cancelDelete}
              >
                Hủy
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
