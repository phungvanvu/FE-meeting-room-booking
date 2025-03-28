import React, { useState, useMemo } from "react";
import Header from '../../components/Header'; 
import Footer from '../../components/Footer'; 

const History = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState(""); 
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [selectedCapacity, setSelectedCapacity] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 

  const locations = ["Phòng A", "Phòng B", "Phòng C"];
  const capacities = ["4", "6", "10"];
  const statuses = ["Hoàn thành", "Đã hủy"]; 

  const bookings = useMemo(() => [
    { id: 1, name: "Meeting A", location: "Phòng A", startTime: "2025-03-01 10:00", endTime: "2025-03-01 11:00", bookedAt: "2025-03-01 12:00", purpose: "CLIENT_MEETING", description: "Discuss project", status: "Hoàn thành" },
    { id: 2, name: "Interview B", location: "Phòng B", startTime: "2025-03-02 14:00", endTime: "2025-03-02 15:00", bookedAt: "2025-03-01 09:00", purpose: "INTERVIEW", description: "Job interview", status: "Đã hủy" },
    { id: 3, name: "Workshop C", location: "Phòng C", startTime: "2025-03-03 09:00", endTime: "2025-03-03 12:00", bookedAt: "2025-03-01 10:00", purpose: "TRAINING", description: "Team training session", status: "Hoàn thành" },
    { id: 4, name: "Seminar D", location: "Phòng A", startTime: "2025-03-04 13:00", endTime: "2025-03-04 15:00", bookedAt: "2025-03-01 11:00", purpose: "SEMINAR", description: "Annual seminar", status: "Đã hủy" },
    { id: 5, name: "Meeting E", location: "Phòng B", startTime: "2025-03-05 08:00", endTime: "2025-03-05 09:00", bookedAt: "2025-03-01 08:00", purpose: "CLIENT_MEETING", description: "Follow-up meeting", status: "Hoàn thành" },
  ], []);

  const filteredBookings = bookings.filter(booking => {
    const matchesSearchTerm = booking.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = (!selectedDate || booking.startTime.includes(selectedDate)) &&
                        (!selectedTime || booking.startTime.includes(selectedTime));
    const matchesLocation = selectedLocation.length === 0 || selectedLocation.includes(booking.location);
    const matchesCapacity = selectedCapacity.length === 0 || selectedCapacity.includes(booking.capacity);
    const matchesStatus = selectedStatus.length === 0 || selectedStatus.includes(booking.status);
    return matchesSearchTerm && matchesDate && matchesLocation && matchesCapacity && matchesStatus;
  });

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBookings = filteredBookings.slice(startIndex, startIndex + itemsPerPage);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedDate("");
    setSelectedTime("");
    setSelectedLocation([]);
    setSelectedCapacity([]);
    setSelectedStatus([]);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header /> 

      <div className="flex flex-col p-6 w-full space-y-6">
        <div className="flex">
          
          <div className="w-1/4 p-4 border bg-gray-100 rounded-lg mr-4 shadow-md">
            <h3 className="font-bold mb-4">Tìm kiếm</h3>
           
            <div className="mb-4">
              <label className="block mb-1 font-bold">Tên:</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded p-2 w-full"
              />
            </div>
            
            {/* Chọn thời gian */}
             
            <div className="mb-4">
            <label className="block mb-1 font-bold">Chọn ngày:</label>
            <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border border-gray-300 rounded p-2 w-full"
            />
            </div>
            {/* địa điểm */}
            <div className="mb-4">
              <label className="block mb-1 font-bold">Địa điểm:</label>
              {locations.map(location => (
                <label key={location} className="flex items-center">
                  <input
                    type="checkbox"
                    value={location}
                    checked={selectedLocation.includes(location)}
                    onChange={() => {
                      setSelectedLocation(prev =>
                        prev.includes(location) ? prev.filter(loc => loc !== location) : [...prev, location]
                      );
                    }}
                    className="mr-3 ml-4"
                  />
                  <span>{location}</span>
                </label>
              ))}
            </div>
            {/*sức chứa */}
            <div className="mb-4">
              <label className="block mb-1 font-bold">Sức chứa:</label>
              <div className="flex flex-wrap">
                {capacities.map(capacity => (
                  <label key={capacity} className="flex items-center mr-4">
                    <input
                      type="checkbox"
                      value={capacity}
                      checked={selectedCapacity.includes(capacity)}
                      onChange={() => {
                        setSelectedCapacity(prev =>
                          prev.includes(capacity) ? prev.filter(cap => cap !== capacity) : [...prev, capacity]
                        );
                      }}
                      className="mr-2 ml-4" 
                    />
                    <span>{capacity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/*trạng thái */}
            <div className="mb-4">
              <label className="block mb-1 font-bold">Trạng thái:</label>
              <div className="flex flex-wrap">
                {statuses.map(status => (
                  <label key={status} className="flex items-center mr-4">
                    <input
                      type="checkbox"
                      value={status}
                      checked={selectedStatus.includes(status)}
                      onChange={() => {
                        setSelectedStatus(prev =>
                          prev.includes(status) ? prev.filter(st => st !== status) : [...prev, status]
                        );
                      }}
                      className="mr-2 ml-4" 
                    />
                    <span>{status}</span>
                  </label>
                ))}
              </div>
            </div>
           
            <div className="flex">
              <button
                onClick={() => setCurrentPage(1)} 
                className="bg-blue-500 text-white rounded py-2 px-4 hover:bg-blue-400 transition w-full mr-1"
              >
                Tìm kiếm
              </button>
              <button
                onClick={resetFilters}
                className="bg-gray-300 text-black rounded py-2 px-4 hover:bg-gray-200 transition w-full ml-1"
              >
                Đặt lại
              </button>
            </div>
          </div>

          {/* Bảng  */}
          <div className="w-3/4 overflow-hidden"> 
            <h2 className="text-center text-2xl font-bold mb-4 ">Lịch sử đặt phòng</h2>
            
            <table className="min-w-full bg-white border border-gray-300 shadow-md text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 border w-1/14">Stt</th>
                <th className="py-2 px-4 border w-2/12">Tên</th>
                <th className="py-2 px-4 border w-2/12">Địa điểm</th>
                <th className="py-2 px-4 border w-3/12">Thời gian bắt đầu</th>
                <th className="py-2 px-4 border w-3/12">Thời gian kết thúc</th>
                <th className="py-2 px-4 border w-3/12">Đặt phòng lúc</th>
                <th className="py-2 px-4 border w-2/12">Mục đích</th>
                <th className="py-2 px-4 border w-2/12">Mô tả</th>
                <th className="py-2 px-4 border w-2/12">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {currentBookings.map((booking, index) => (
                <tr key={booking.id} className="border-b hover:bg-gray-100 transition">
                  <td className="py-2 px-4 border">{startIndex + index + 1}</td>
                  <td className="py-2 px-4 border">{booking.name}</td>
                  <td className="py-2 px-4 border">{booking.location}</td>
                  <td className="py-2 px-4 border">{booking.startTime}</td>
                  <td className="py-2 px-4 border">{booking.endTime}</td>
                  <td className="py-2 px-4 border">{booking.bookedAt}</td>
                  <td className="py-2 px-4 border">{booking.purpose}</td>
                  <td className="py-2 px-4 border">{booking.description}</td>
                  <td className={`py-2 px-4 border ${booking.status === "Hoàn thành" ? "text-teal-600" : "text-red-600"}`}>
                    {booking.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

            {/* Phân trang */}
            <div className="flex justify-center items-center mt-4">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="border border-gray-300 text-gray-700 rounded py-2 px-4 hover:bg-gray-200 transition"
              >
                &laquo;
              </button>

             
              {[...Array(totalPages)].map((_, index) => (
                <button 
                  key={index} 
                  onClick={() => setCurrentPage(index + 1)} 
                  className={`border border-gray-300 text-gray-700 py-2 px-4 transition mx-1 ${currentPage === index + 1 ? 'bg-blue-700 text-white' : 'hover:bg-gray-200'}`}
                >
                  {index + 1}
                </button>
              ))}

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="border border-gray-300 text-gray-700 rounded py-2 px-4 hover:bg-gray-200 transition"
              >
                &raquo; 
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default History;