import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { ChevronLeft, ChevronRight, MapPin, Users } from "lucide-react";
import { isAccessTokenValid } from "../../components/utils/auth";


const ITEMS_PER_PAGE = 6;

export default function BookRoomPage() {
  const [roomsData, setRoomsData] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedCapacity, setSelectedCapacity] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  
  const navigate = useNavigate();

  useEffect(() => {
    const initPage = async () => {
      const isValid = await isAccessTokenValid();
      if (!isValid) {
        navigate("/Login");
        return;
      }
      fetchRooms();
    };

    initPage();
  }, [navigate]);


  const fetchRooms = async () => {
    const accessToken = sessionStorage.getItem("accessToken");

    try {
      const response = await fetch('http://localhost:8080/MeetingRoomBooking/room', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        const formattedRooms = result.data.map((room) => ({
          id: room.roomName || "",
          name: room.roomName || "No name",
          location: room.location || "Unknown location",
          note: room.note || "",
          capacity: room.capacity || 0,
          status: room.available ? "Available" : "Unavailable",
          facilities: room.equipments || [],
          image: room.imageUrl ? `http://localhost:8080/MeetingRoomBooking${room.imageUrl}` : ""
        }));

        setRoomsData(formattedRooms);
        setFilteredRooms(formattedRooms);
      } else {
        console.error("Error fetching rooms:", result.error?.message);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };
  // Xử lý tìm kiếm
  const handleSearch = () => {
    const result = roomsData.filter((room) => {
      const matchesSearch = search === "" || room.name.toLowerCase().includes(search.toLowerCase());
      const matchesLocation = searchLocation === "" || room.location.toLowerCase().includes(searchLocation.toLowerCase());
      const matchesDevices = selectedDevices.length === 0 || selectedDevices.every(device => room.facilities.includes(device));
      const matchesStatus = selectedStatus === "" || room.status === selectedStatus;
      const matchesCapacity = selectedCapacity === "" || room.capacity === parseInt(selectedCapacity);
      return matchesSearch && matchesLocation && matchesDevices && matchesStatus && matchesCapacity;
    });

    setFilteredRooms(result);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearch("");
    setSearchLocation("");
    setSelectedDevices([]);
    setSelectedStatus("");
    setSelectedCapacity("");
    setFilteredRooms(roomsData);
    setCurrentPage(1);
  };

  // Xử lý phân trang
  const totalPages = Math.ceil(filteredRooms.length / ITEMS_PER_PAGE);
  const currentRooms = filteredRooms.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handlePreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  return (
  <div className="min-h-screen flex flex-col">

  <Header />

  <div className="container flex-grow mx-auto mt-10 flex gap-6 mb-10">
  {/* Bộ lọc */}
  <div className="w-1/4 bg-white p-6 rounded-2xl shadow-md border border-gray-200 max-h-[650px] flex-shrink-0 flex flex-col">
    <h2 className="text-xl font-semibold mb-5 text-gray-800">Filter</h2>

    {/* Tên phòng */}
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">Tên phòng</label>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)} 
        type="text"
        className="
          w-full 
          border border-gray-300 
          rounded-lg 
          py-2 px-3 
          focus:ring-2 
          focus:ring-blue-500 
          focus:outline-none 
          bg-gray-50 
          hover:bg-gray-100 
          transition-all
        "
        placeholder="Nhập tên phòng"
      />
    </div>

    {/* Trạng thái */}
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
        className="
          w-full 
          border border-gray-300 
          rounded-lg 
          py-2 px-3 
          focus:ring-2 
          focus:ring-blue-500 
          focus:outline-none 
          bg-gray-50 
          hover:bg-gray-100 
          transition-all
        "
      >
        <option value="">Trạng thái</option>
        <option value="Available">Available</option>
        <option value="Unavailable">Unavailable</option>
      </select>
    </div>

    {/* Sức chứa */}
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">Sức chứa</label>
      <select
        value={selectedCapacity}
        onChange={(e) => setSelectedCapacity(e.target.value)}
        className="
          w-full 
          border border-gray-300 
          rounded-lg 
          py-2 px-3 
          focus:ring-2 
          focus:ring-blue-500 
          focus:outline-none 
          bg-gray-50 
          hover:bg-gray-100 
          transition-all
        "
      >
        <option value="">Sức chứa</option>
        {[6, 8, 10, 12].map((capacity) => (
          <option key={capacity} value={capacity}>
            {capacity} người
          </option>
        ))}
      </select>
    </div>

    {/* Địa điểm phòng */}
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Địa điểm phòng
      </label>
      <input
        value={searchLocation}
        onChange={(e) => setSearchLocation(e.target.value)} 
        type="text"
        className="
          w-full 
          border border-gray-300 
          rounded-lg 
          py-2 px-3 
          focus:ring-2 
          focus:ring-blue-500 
          focus:outline-none 
          bg-gray-50 
          hover:bg-gray-100 
          transition-all
        "
        placeholder="Nhập địa điểm"
      />
    </div>

    {/* Thiết bị */}
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">Thiết bị</label>
      <div className="flex flex-wrap gap-2">
        {["Projector", "Monitor", "HDMI", "Whiteboard", "Microphone", "Speaker"].map((device) => (
          <button
            key={device}
            onClick={() =>
              setSelectedDevices((prev) =>
                prev.includes(device) ? prev.filter((d) => d !== device) : [...prev, device]
              )
            }
            className={`px-3 py-1 rounded-full text-sm border transition-all ${
              selectedDevices.includes(device)
                ? "bg-blue-500 text-white border-blue-500"
                : "border-gray-300 text-gray-600 hover:bg-gray-100"
            }`}
          >
            {device}
          </button>
        ))}
      </div>
    </div>

    {/* Nút */}
    <div className="flex justify-between mt-auto pt-4 border-t border-gray-200">
      <button
        onClick={handleReset}
        className="
          w-1/2 
          mr-2 
          py-2 
          bg-gray-100 
          text-gray-600 
          border border-gray-300 
          rounded-lg 
          hover:bg-gray-200 
          transition-all
        "
      >
        Đặt lại
      </button>

      <button
        onClick={handleSearch}
        className="
          w-1/2 
          ml-2 
          py-2 
          bg-blue-500 
          text-white 
          rounded-lg 
          hover:bg-blue-600 
          transition-all
        "
      >
        Tìm kiếm
      </button>
    </div>
  </div>


    {/* Danh sách phòng họp*/}
    <div className="w3/4 flex-grow bg-gray-50 p-6 rounded-2xl shadow-md border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Đặt phòng họp</h2>
      </div>

      {/* Danh sách phòng họp */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentRooms.map((room) => (
          <div
            key={room.id}
            className="border rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow bg-white"
          >
            {/* Ảnh phòng */}
            <img
              src={room.image}
              alt={room.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-5">
              {/* Tên phòng */}
              <h3 className="font-semibold text-xl text-gray-800 truncate">
                {room.name}
              </h3>
              
              {/* Địa điểm + Sức chứa */}
              <div className="mt-2 space-y-1 text-gray-600">
                <p className="flex items-center">
                  <MapPin size={18} className="mr-2 text-blue-500" /> {/* Icon Địa điểm */}
                  Địa điểm: <span className="font-medium ml-1">{room.location}</span>
                </p>
                <p className="flex items-center">
                  <Users size={18} className="mr-2 text-red-500" /> {/* Icon Sức chứa */}
                  Sức chứa: <span className="font-medium ml-1">{room.capacity}</span>
                </p>
              </div>

              {/* Trạng thái */}
              <p
                className={`mt-3 text-sm font-medium ${
                  room.status === "Available"
                    ? "text-green-500"
                    : room.status === "Booked"
                    ? "text-blue-500"
                    : "text-red-500"
                }`}
              >
                {room.status}
              </p>

              <p>
                <span className="font-medium text-sm">{room.note}</span>
              </p>

              {/* Danh sách tiện ích */}
              <div className="flex flex-wrap gap-2 mt-3">
                {room.facilities.map((facility, index) => (
                  <span
                    key={index}
                    className="text-xs bg-gray-100 px-3 py-1 rounded-full border border-gray-300"
                  >
                    {facility}
                  </span>
                ))}
              </div>

              {/* Nút đặt phòng */}
              {room.status === "Available" ? (
                <Link to={`/Calendar/${room.id}`}>
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-xl mt-5 transition-all">
                  Đặt phòng
                </button>
                </Link>
              ) : (
                <button
                  className="w-full bg-gray-300 text-gray-600 font-medium py-2 rounded-xl mt-5 cursor-not-allowed"
                  disabled
                >
                  Đặt phòng
                </button>
              )}
            </div>
          </div>
        ))}
      </div>


      {totalPages > 1 && (
      <div className="flex justify-center items-center mt-8 gap-2">
        {/* Nút chuyển trang trước */}
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${
            currentPage === 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          <ChevronLeft size={18} />
        </button>

        {/* Các số trang */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`w-10 h-10 flex items-center justify-center rounded-full font-medium transition-all ${
              currentPage === page
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-blue-100"
            }`}
          >
            {page}
          </button>
        ))}

        {/* Nút chuyển trang sau */}
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${
            currentPage === totalPages
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    )}

    </div>
  </div>

  <Footer/>
  
</div>

  );
}
