import { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Search, X, ChevronLeft, ChevronRight, MapPinned, Users } from "lucide-react";
import { Link } from "react-router-dom";


const roomsData = [
  {
    id: 1,
    name: "BHAGIRATHI",
    capacity: 8,
    location: "Pune Hinjewadi",
    status: "Available",
    facilities: ["Audio", "Video", "White Board", "HDMI", "Projector"],
    image: "room/room1.jpg",
  },
  {
    id: 2,
    name: "GHATAPRABHA",
    capacity: 12,
    location: "Pune Hinjewadi",
    status: "Available",
    facilities: ["Audio", "Video", "White Board", "HDMI", "Projector"],
    image: "room/room2.jpg",
  },
  {
    id: 3,
    name: "BHIMA",
    capacity: 6,
    location: "Pune Hinjewadi",
    status: "Available",
    facilities: ["Audio", "Video", "White Board", "HDMI", "Projector"],
    image: "room/room3.jpg",
  },
  {
    id: 4,
    name: "TUNGBHADRA",
    capacity: 5,
    location: "Pune Hinjewadi",
    status: "Available",
    facilities: ["Audio", "Video", "White Board", "HDMI", "Projector"],
    image: "room/room4.jpg",
  },
  {
    id: 5,
    name: "KRISHNA",
    capacity: 5,
    location: "Pune Hinjewadi",
    status: "Available",
    facilities: ["Audio", "White Board"],
    image: "room/room5.jpg",
  },
  {
    id: 6,
    name: "GODAVARI",
    capacity: 6,
    location: "Pune Hinjewadi",
    status: "Available",
    facilities: ["Audio", "Video", "HDMI"],
    image: "room/room6.jpg",
  },
  {
    id: 7,
    name: "KAVERI",
    capacity: 8,
    location: "Bangalore Whitefield",
    status: "Available",
    facilities: ["Audio", "Video", "White Board", "Projector"],
    image: "room/room7.jpg",
  },
  {
    id: 8,
    name: "NARMADA",
    capacity: 5,
    location: "Mumbai Andheri",
    status: "Available",
    facilities: ["Audio", "White Board"],
    image: "room/room6.jpg",
  },
  {
    id: 9,
    name: "GANGA",
    capacity: 15,
    location: "Delhi Connaught Place",
    status: "Available",
    facilities: ["Audio", "Video", "White Board", "HDMI", "Projector", "Microphone"],
    image: "room/room5.jpg",
  },
  {
    id: 10,
    name: "YAMUNA",
    capacity: 20,
    location: "Chennai T Nagar",
    status: "Available",
    facilities: ["Audio", "Video", "HDMI", "Microphone", "Projector"],
    image: "room/room3.jpg",
  },
  {
    id: 11,
    name: "SARASWATI",
    capacity: 8,
    location: "Pune Baner",
    status: "Not Available",
    facilities: ["Audio", "White Board", "Projector"],
    image: "room/room1.jpg",
  },
  {
    id: 12,
    name: "INDUS",
    capacity: 10,
    location: "Hyderabad HITEC City",
    status: "Available",
    facilities: ["Audio", "HDMI", "Projector", "White Board"],
    image: "room/room2.jpg",
  },
  {
    id: 13,
    name: "BRAMHAPUTRA",
    capacity: 25,
    location: "Mumbai Bandra",
    status: "Available",
    facilities: ["Audio", "Video", "HDMI", "Projector", "Microphone"],
    image: "room/room3.jpg",
  },
  {
    id: 14,
    name: "MAHANADI",
    capacity: 10,
    location: "Kolkata Salt Lake",
    status: "Available",
    facilities: ["Audio", "White Board", "Projector"],
    image: "room/room4.jpg",
  },
  {
    id: 15,
    name: "TAPTI",
    capacity: 6,
    location: "Delhi Nehru Place",
    status: "Available",
    facilities: ["Audio", "Video", "HDMI"],
    image: "room/room5.jpg",
  },
];


const ITEMS_PER_PAGE = 6;

export default function BookRoomPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [capacityFilter, setCapacityFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState(""); 
  const [roomCode, setRoomCode] = useState(""); 
  const [selectedDevices, setSelectedDevices] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1);
  const [handleSearch, handleResetFilters] = useState(""); 

  // Xử lý tìm kiếm
  const filteredRooms = roomsData.filter(
    (room) =>
      room.name.toLowerCase().includes(search.toLowerCase()) ||
      room.status.toLowerCase().includes(search.toLowerCase())
  );
  
  // Tính tổng số trang
  const totalPages = Math.ceil(filteredRooms.length / ITEMS_PER_PAGE);

  // Lọc các phòng theo trang hiện tại
  const currentRooms = filteredRooms.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Chuyển đến trang trước
  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Chuyển đến trang sau
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
<div className="min-h-screen flex flex-col">

  <Header />

  <div className="container mx-auto mt-10 flex gap-6 mb-10">
    {/* lọc */}
    <div className="w-1/4 bg-white p-6 rounded-2xl shadow-md border border-gray-200 max-h-[650px] flex-shrink-0 flex flex-col">
      <h2 className="text-xl font-semibold mb-5 text-gray-800">Filter</h2>

      {/*trạng thái */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
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
          <option value="Booked">Booked</option>
        </select>
      </div>

      {/* sức chứa */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Sức chứa</label>
        <select
          value={capacityFilter}
          onChange={(e) => setCapacityFilter(e.target.value)}
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
          {[4, 6, 8, 10].map((capacity) => (
            <option key={capacity} value={capacity}>
              {capacity} người
            </option>
          ))}
        </select>
      </div>

      {/* vị trí phòng */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Vị trí phòng</label>
        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
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
          <option value="">Vị trí</option>
          <option value="Tầng 1">Tầng 1</option>
          <option value="Tầng 2">Tầng 2</option>
          <option value="Tầng 3">Tầng 3</option>
        </select>
      </div>

      {/* mã phòng */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Mã phòng</label>
        <input
          type="text"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          placeholder="Nhập mã phòng: "
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
        />
      </div>

      {/* thiết bị */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Thiết bị</label>
        <div className="flex flex-wrap gap-2">
          {["Audio", "Video", "White Board", "HDMI", "Projector", "Speaker Phone"].map((device) => (
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
          onClick={handleResetFilters}
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
        <div className="relative w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm phòng họp..."
            className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 w-full transition-all"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          {search && (
            <X
              className="absolute right-3 top-2.5 text-gray-400 cursor-pointer"
              size={20}
              onClick={() => setSearch("")}
            />
          )}
        </div>
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
                <p>
                  <MapPinned className="w-5 h-5"/>
                  <span className="font-medium">Địa điểm: {room.location}</span>
                </p>
                <p>
                  <Users className="w-5 h-5/>"/>
                  <span className="font-medium">Sức chứa: {room.capacity}</span>
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
                  Đã đặt
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
