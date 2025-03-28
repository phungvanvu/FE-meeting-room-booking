import { useState } from "react";

const RoomManagement = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedCapacities, setSelectedCapacities] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);
  const [isBookingFormVisible, setIsBookingFormVisible] = useState(false);
  const [newRoom, setNewRoom] = useState({
    id: "",
    name: "",
    image: "",
    capacity: "",
    devices: [],
    location: "",
    status: "",
    notes: ""
  });
  const [editRoom, setEditRoom] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [searchBooking, setSearchBooking] = useState("");
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const [confirmBookingDelete, setConfirmBookingDelete] = useState(false);

  const rooms = [
    { id: "R001", name: "Interview 1", capacity: 4, status: "Sử dụng", location: "Tầng 8 - Tòa nhà 789", devices: ["Audio", "HDMI"], image: "/room/room1.jpg" },
    { id: "R002", name: "Interview 2", capacity: 6, status: "Tạm dừng", location: "Thành Công Building", devices: ["Video", "White Board"], image: "/room/room2.jpg" },
    { id: "R003", name: "Creative", capacity: 10, status: "Sử dụng", location: "The West Building", devices: ["Sound System", "Audio"], image: "/room/room3.jpg" },
    { id: "R004", name: "Brain Stomming", capacity: 6, status: "Sử dụng", location: "Tầng 8 - Tòa nhà 789", devices: ["White Board", "Video"], image: "/room/room4.jpg" },
    { id: "R005", name: "Training 1", capacity: 10, status: "Tạm dừng", location: "Thành Công Building", devices: ["HDMI", "Audio"], image: "/room/room5.jpg" },
    { id: "R006", name: "Training 2", capacity: 6, status: "Sử dụng", location: "The West Building", devices: ["Video", "Sound System"], image: "/room/room6.jpg" },
    { id: "R007", name: "Break Room 1", capacity: 4, status: "Sử dụng", location: "CMC Corporation", devices: ["Audio", "HDMI"], image: "/room/room7.jpg" },
    { id: "R008", name: "Break Room 2", capacity: 4, status: "Sử dụng", location: "Tầng 8 - Tòa nhà 789", devices: ["Sound System", "Video"], image: "/room/room4.jpg" },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 6;

  const handleAddRoom = () => {
    setIsAddFormVisible(true);
    setNewRoom({
      id: `R${rooms.length + 1}`,
      name: "",
      image: "",
      capacity: "",
      devices: [],
      location: "",
      status: "",
      notes: ""
    });
  };

  const handleSaveRoom = () => {
    // Logic lưu phòng mới ở đây
    setIsAddFormVisible(false);
  };

  const handleEditRoom = (room) => {
    setIsEditFormVisible(true);
    setEditRoom(room);
  };

  const handleCancel = () => {
    setIsAddFormVisible(false);
    setIsEditFormVisible(false);
    setIsBookingFormVisible(false);
  };

  const handleDeleteRoom = (room) => {
    setConfirmDelete(true);
    setRoomToDelete(room);
  };

  const confirmDeleteRoom = () => {
    // Logic xóa phòng ở đây
    setConfirmDelete(false);
    setRoomToDelete(null);
  };

  const cancelDeleteRoom = () => {
    setConfirmDelete(false);
    setRoomToDelete(null);
  };

  const handleBooking = (room) => {
    setIsBookingFormVisible(true);
    // Logic lấy đơn đặt phòng cho phòng này (có thể thêm dữ liệu mẫu ở đây)
    setBookings([
      { startTime: "10:00 AM", endTime: "11:00 AM", bookingDate: "24/10/2023", bookedBy: "Nguyễn Văn A" },
      { startTime: "01:00 PM", endTime: "02:00 PM", bookingDate: "24/10/2023", bookedBy: "Trần Thị B" }
    ]);
  };

  const closeBookingForm = () => {
    setIsBookingFormVisible(false);
  };

  const handleDeleteBooking = (booking) => {
    setConfirmBookingDelete(true);
    setBookingToDelete(booking);
  };

  const confirmDeleteBooking = () => {
    // Logic xóa booking ở đây
    if (bookingToDelete) {
      const updatedBookings = bookings.filter(booking => booking !== bookingToDelete);
      setBookings(updatedBookings);
    }
    setConfirmBookingDelete(false);
    setBookingToDelete(null);
  };

  const cancelDeleteBooking = () => {
    setConfirmBookingDelete(false);
    setBookingToDelete(null);
  };

  const BookingForm = () => {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white shadow-lg p-6 rounded-lg w-[800px]">
          <div className="flex justify-between mb-4">
            <h3 className="text-xl font-semibold text-blue-700 text-center flex-1">Danh sách đặt phòng</h3>
            <button onClick={closeBookingForm} className="text-red-500">X</button>
          </div>
          <div className="flex mb-4">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchBooking}
              onChange={(e) => setSearchBooking(e.target.value)}
              className="border rounded p-2 flex-1"
            />
            <button className="ml-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-700">Download</button>
          </div>
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Thời gian bắt đầu</th>
                <th className="border border-gray-300 p-2">Thời gian kết thúc</th>
                <th className="border border-gray-300 p-2">Thời gian đặt phòng</th>
                <th className="border border-gray-300 p-2">Người đặt</th>
                <th className="border border-gray-300 p-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2">{booking.startTime}</td>
                  <td className="border border-gray-300 p-2">{booking.endTime}</td>
                  <td className="border border-gray-300 p-2">{booking.bookingDate}</td>
                  <td className="border border-gray-300 p-2">{booking.bookedBy}</td>
                  <td className="border border-gray-300 p-2 text-center">
                    <button onClick={() => handleDeleteBooking(booking)} className="text-red-500 text-xl"> &#10006; {/* Ký tự Unicode cho hình thập tự */} </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {confirmBookingDelete && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white shadow-lg p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-center">Bạn có chắc chắn muốn xóa booking này?</h3>
              <div className="flex justify-center gap-4 mt-4">
                <button onClick={confirmDeleteBooking} className="p-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-500 hover:text-white">Xóa</button>
                <button onClick={cancelDeleteBooking} className="p-2 border border-gray-500 text-gray-500 rounded hover:bg-gray-500 hover:text-white">Hủy</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const RoomForm = ({ room, isEdit, onSave, onCancel }) => {
    const [formData, setFormData] = useState(room);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };

    const handleDeviceChange = (e) => {
      const { value } = e.target;
      setFormData(prev => {
        const devices = prev.devices.includes(value)
          ? prev.devices.filter(device => device !== value)
          : [...prev.devices, value];
        return { ...prev, devices };
      });
    };

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white shadow-lg p-6 rounded-lg w-[600px]">
          <h3 className="text-xl font-semibold text-blue-700 mb-4 text-center">{isEdit ? "Sửa phòng" : "Thêm phòng mới"}</h3>
          <div className="grid gap-0.5 text-gray-700">
            <div className="flex justify-between">
              <div className="w-35">
                <label className="font-semibold">Tên phòng:</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="border rounded p-2 w-full" />
              </div>
              <div className="ml-4 w-3/4">
                <label className="font-semibold">Chọn ảnh:</label>
                <input type="file" name="image" onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })} className="border rounded p-2 w-full" />
              </div>
            </div>
            <label className="font-semibold">Sức chứa:</label>
            <div className="flex justify-center gap-4">
              <label><input type="radio" name="capacity" value="4" checked={formData.capacity === "4"} onChange={handleChange} /> 4 người</label>
              <label><input type="radio" name="capacity" value="6" checked={formData.capacity === "6"} onChange={handleChange} /> 6 người</label>
              <label><input type="radio" name="capacity" value="10" checked={formData.capacity === "10"} onChange={handleChange} /> 10 người</label>
            </div>
            <label className="font-semibold">Thiết bị:</label>
            <div className="grid grid-cols-2 gap-2">
              {["Audio", "HDMI", "Video", "White Board", "Sound System"].map(device => (
                <label key={device} className="flex items-center">
                  <input type="checkbox" value={device} checked={formData.devices.includes(device)} onChange={handleDeviceChange} />
                  <span className="ml-2">{device}</span>
                </label>
              ))}
            </div>
            <label className="font-semibold">Vị trí:</label>
            <select name="location" value={formData.location} onChange={handleChange} className="border rounded p-2 w-full">
              <option value="Tầng 8 - Tòa nhà 789">Tầng 8 - Tòa nhà 789</option>
              <option value="Thành Công Building">Thành Công Building</option>
              <option value="The West Building">The West Building</option>
            </select>
            <label className="font-semibold">Trạng thái:</label>
            <select name="status" value={formData.status} onChange={handleChange} className="border rounded p-2 w-full">
              <option value="Sử dụng">Sử dụng</option>
              <option value="Tạm dừng">Tạm dừng</option>
            </select>
            <label className="font-semibold">Ghi chú:</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} className="border rounded p-2 w-full"></textarea>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => onSave(formData)} className="flex-1 p-2 bg-white border border-blue-500 text-blue-500 rounded hover:bg-blue-500 hover:text-white"> Lưu
            </button>
            <button onClick={onCancel} className="flex-1 p-2 bg-white border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white">
              Hủy
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleSearch = () => {
    const result = rooms.filter((room) => {
      const matchesSearch = searchText === "" || room.name.toLowerCase().includes(searchText.toLowerCase());
      const matchesLocation = selectedLocations.length === 0 || selectedLocations.includes(room.location);
      const matchesCapacity = selectedCapacities.length === 0 || selectedCapacities.includes(room.capacity.toString());
      const matchesStatus = selectedStatus.length === 0 || selectedStatus.includes(room.status);
      return matchesSearch && matchesLocation && matchesCapacity && matchesStatus;
    });

    return result; // Trả về danh sách đã lọc
  };

  // Phân trang
  const filteredRooms = handleSearch(); // Danh sách phòng đã lọc
  const totalRooms = filteredRooms.length; // Tổng số phòng đã lọc
  const totalPages = Math.ceil(totalRooms / roomsPerPage); // Tổng số trang
  const startIndex = (currentPage - 1) * roomsPerPage; // Chỉ số bắt đầu
  const currentRooms = filteredRooms.slice(startIndex, startIndex + roomsPerPage); // Danh sách phòng hiện tại cho trang

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="flex flex-col md:flex-row p-4 gap-6">
      <div className="md:w-1/4 bg-gray-100 shadow-lg rounded-lg p-5 sticky top-4 h-fit">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Tìm kiếm</h2>
        <div className="mb-3">
          <label className="block font-semibold">Nhập tên phòng</label>
          <input type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)}
            className="w-full p-2 border rounded mt-1" placeholder="Nhập tên phòng..." />
        </div>
        <div className="mb-3">
          <label className="block font-semibold">Chọn vị trí</label>
          {[...new Set(rooms.map(r => r.location))].map(location => (
            <div key={location} className="ml-3">
              <input type="checkbox" checked={selectedLocations.includes(location)}
                onChange={() =>
                  setSelectedLocations(prev =>
                    prev.includes(location) ? prev.filter(l => l !== location) : [...prev, location]
                  )}
              />
              <span className="ml-2">{location}</span>
            </div>
          ))}
        </div>
        <div className="mb-3">
          <label className="block font-semibold">Chọn sức chứa</label>
          {[...new Set(rooms.map(r => r.capacity))].map(capacity => (
            <div key={capacity} className="ml-3">
              <input type="checkbox" checked={selectedCapacities.includes(capacity.toString())}
                onChange={() =>
                  setSelectedCapacities(prev =>
                    prev.includes(capacity.toString()) ? prev.filter(c => c !== capacity.toString()) : [...prev, capacity.toString()]
                  )}
              />
              <span className="ml-2">{capacity} người</span>
            </div>
          ))}
        </div>
        <div className="mb-3">
          <label className="block font-semibold">Chọn trạng thái</label>
          {["Sử dụng", "Tạm dừng"].map(status => (
            <div key={status} className="ml-3">
              <input type="checkbox" checked={selectedStatus.includes(status)}
                onChange={() =>
                  setSelectedStatus(prev =>
                    prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
                  )}
              />
              <span className="ml-2">{status}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={handleSearch} className="flex-1 p-2 bg-blue-500 text-white rounded hover:bg-blue-700">Tìm kiếm</button>
          <button onClick={handleAddRoom} className="flex-1 p-2 bg-green-500 text-white rounded hover:bg-green-700">Thêm</button>
        </div>
      </div>
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-center mb-6">Danh sách phòng</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {currentRooms.map(room => (
            <div key={room.id} className="bg-white shadow-lg p-4 rounded-lg flex flex-col">
              <img src={room.image} alt={room.name} className="w-full h-40 object-cover rounded-md mb-3" />
              <div className="grid grid-cols-2 gap-1 text-gray-700">
                <span className="font-semibold">Tên:</span> <span>{room.name}</span>
                <span className="font-semibold">Mã phòng:</span> <span>{room.id}</span>
                <span className="font-semibold">Sức chứa:</span> <span>{room.capacity} người</span>
                <span className="font-semibold">Vị trí:</span> <span>{room.location}</span>
                <span className="font-semibold">Trạng thái:</span>
                <span className={room.status === "Sử dụng" ? "text-green-500 font-bold" : "text-red-500 font-bold"}>{room.status}</span>
                <span className="font-semibold">Thiết bị:</span> <span>{room.devices.join(", ")}</span>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => handleEditRoom(room)} className="flex-1 p-2 bg-white border border-blue-700 text-blue-700 rounded hover:bg-blue-700 hover:text-white">Sửa</button>
                <button onClick={() => handleDeleteRoom(room)} className="flex-1 p-2 bg-white border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white">Xóa</button>
                <button onClick={() => handleBooking(room)} className="flex-1 p-2 bg-white border border-blue-700 text-blue-700 rounded hover:bg-blue-700 hover:text-white">Booking</button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Phân trang */}
<div className="flex justify-center items-center mt-4">
  <button 
    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
    disabled={currentPage === 1}
    className="border border-gray-300 text-gray-700 rounded py-2 px-4 hover:bg-gray-200 transition"
  >
    &laquo; {/* Mũi tên lùi */}
  </button>

  {/* Hiển thị các nút trang */}
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
    &raquo; {/* Mũi tên tiến */}
  </button>
</div>
      </div>
      {isAddFormVisible && (
        <RoomForm room={newRoom} isEdit={false} onSave={handleSaveRoom} onCancel={handleCancel} />
      )}
      {isEditFormVisible && (
        <RoomForm room={editRoom} isEdit={true} onSave={handleSaveRoom} onCancel={handleCancel} />
      )}
      {isBookingFormVisible && <BookingForm />}
      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white shadow-lg p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-center">Bạn có chắc chắn muốn xóa phòng {roomToDelete?.name}?</h3>
            <div className="flex justify-center gap-4 mt-4">
              <button onClick={confirmDeleteRoom} className="p-2 bg-white border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white">
                Xóa
              </button>
              <button onClick={cancelDeleteRoom} className="p-2 bg-white border border-gray-500 text-gray-500 rounded hover:bg-gray-500 hover:text-white">
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomManagement;