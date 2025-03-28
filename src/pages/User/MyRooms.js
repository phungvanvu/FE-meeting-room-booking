import React, { useMemo, useState } from 'react';
import Header from '../../components/Header'; 
import Footer from '../../components/Footer'; 

const MyRooms = () => {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [bookings, setBookings] = useState(useMemo(() => [
    { id: 1, name: "Meeting A", location: "Phòng A", startTime: "2025-04-01 10:00", endTime: "2025-04-01 11:00", bookedAt: "2025-03-01 12:00", purpose: "CLIENT_MEETING", description: "Discuss project" },
    { id: 2, name: "Interview B", location: "Phòng B", startTime: "2025-04-02 14:00", endTime: "2025-04-02 15:00", bookedAt: "2025-03-01 09:00", purpose: "INTERVIEW", description: "Job interview" },
    { id: 3, name: "Workshop C", location: "Phòng C", startTime: "2025-04-03 09:00", endTime: "2025-04-03 12:00", bookedAt: "2025-03-01 10:00", purpose: "TRAINING", description: "Team training session" },
    { id: 4, name: "Seminar D", location: "Phòng A", startTime: "2025-04-04 13:00", endTime: "2025-04-04 15:00", bookedAt: "2025-03-01 11:00", purpose: "SEMINAR", description: "Annual seminar" },
    { id: 5, name: "Meeting E", location: "Phòng B", startTime: "2025-04-05 08:00", endTime: "2025-04-05 09:00", bookedAt: "2025-03-01 08:00", purpose: "CLIENT_MEETING", description: "Follow-up meeting" },
  ], []));

  const handleEdit = (booking) => {
    setSelectedBooking(booking);
    setIsEditing(true);
  };

  const handleDelete = (booking) => {
    setSelectedBooking(booking);
    setIsConfirming(true);
  };

  const confirmDelete = () => {
    setBookings(bookings.filter(b => b.id !== selectedBooking.id));
    setIsConfirming(false);
    setSelectedBooking(null);
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
    <div className="container mx-auto p-4 flex flex-col min-h-screen">
      <Header />
      <h2 className="text-xl font-bold mb-4 text-center" style={{ marginTop: '20px' }}>Phòng chờ</h2>
      <div className="flex-grow flex justify-center">
        <div className="w-full max-w-5xl"> {/* Giới hạn chiều rộng của bảng */}
          <table className="min-w-full bg-white border border-gray-300 shadow-md text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-2 border">STT</th>
                <th className="py-2 px-2 border">Tên</th>
                <th className="py-2 px-2 border">Địa điểm</th>
                <th className="py-2 px-2 border">Thời gian bắt đầu</th>
                <th className="py-2 px-2 border">Thời gian kết thúc</th>
                <th className="py-2 px-2 border">Đặt phòng lúc</th>
                <th className="py-2 px-2 border">Mục đích</th>
                <th className="py-2 px-2 border">Mô tả</th>
                <th className="py-2 px-2 border text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <tr key={booking.id} className="border-b hover:bg-gray-100 transition">
                  <td className="py-2 px-2 border">{index + 1}</td>
                  <td className="py-2 px-2 border">{booking.name}</td>
                  <td className="py-2 px-2 border">{booking.location}</td>
                  <td className="py-2 px-2 border">{booking.startTime}</td>
                  <td className="py-2 px-2 border">{booking.endTime}</td>
                  <td className="py-2 px-2 border">{booking.bookedAt}</td>
                  <td className="py-2 px-2 border">{booking.purpose}</td>
                  <td className="py-2 px-2 border">{booking.description}</td>
                  <td className="py-2 px-2 border text-center">
                    <button className="text-blue-500 hover:underline" onClick={() => handleEdit(booking)}>Sửa</button>
                    <button className="text-red-500 hover:underline ml-2" onClick={() => handleDelete(booking)}>Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form sửa */}
      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded shadow-lg" style={{ width: '350px' }}>
            <h3 className="text-lg justify-center font-bold mb-4">Sửa </h3>
            <form>
              <div className="mb-2">
                <label className="block">Thời gian bắt đầu:</label>
                <input type="datetime-local" defaultValue={selectedBooking.startTime} className="border rounded w-full" />
              </div>
              <div className="mb-2">
                <label className="block">Thời gian kết thúc:</label>
                <input type="datetime-local" defaultValue={selectedBooking.endTime} className="border rounded w-full" />
              </div>
              <div className="mb-2">
                <label className="block">Mục đích:</label>
                <input type="text" defaultValue={selectedBooking.purpose} className="border rounded w-full" />
              </div>
              <div className="mb-2">
                <label className="block">Mô tả:</label>
                <input type="text" defaultValue={selectedBooking.description} className="border rounded w-full" />
              </div>
              <div className="flex justify-center mt-4">
                <button type="button" className="border border-gray-30 text-blue-700 px-4 py-2 rounded mr-2 hover:bg-blue-300 hover:text-black" onClick={closeEditForm}>Lưu</button>
                <button type="button" className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 hover:text-black" onClick={closeEditForm}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Form xác nhận xóa */}
      {isConfirming && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h3 className="text-lg font-bold mb-4">Xác nhận xóa</h3>
            <p>Bạn có chắc chắn muốn xóa phòng "{selectedBooking.name}" không?</p>
            <div className="flex justify-center mt-4">
              <button className="border border-red-500 text-red-500 px-4 py-2 rounded mr-2 hover:bg-red-500 hover:text-white" onClick={confirmDelete}>Có</button>
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 hover:text-black" onClick={cancelDelete}>Hủy</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default MyRooms;