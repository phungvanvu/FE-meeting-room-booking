import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { ChevronLeft, ChevronRight, MapPin, Users } from 'lucide-react';
import { isAccessTokenValid } from '../../components/utils/auth';
import API_BASE_URL from '../../config';

const ITEMS_PER_PAGE = 6;

export default function BookRoomPage() {
  const [roomsData, setRoomsData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedCapacities, setSelectedCapacities] = useState([]);
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [searchRoomName, setSearchRoomName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const initPage = async () => {
      const isValid = await isAccessTokenValid();
      if (!isValid) {
        navigate('/Login');
        return;
      }
      fetchRooms();
    };

    initPage();
  }, [navigate]);

  const fetchRooms = async () => {
    const accessToken = sessionStorage.getItem('accessToken');

    try {
      const response = await fetch(`${API_BASE_URL}/room`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        const formattedRooms = result.data.map((room) => ({
          id: room.roomName || '',
          name: room.roomName || 'No name',
          location: room.location || 'Unknown location',
          note: room.note || '',
          capacity: room.capacity || null,
          status: room.available ? 'Available' : 'Unavailable',
          facilities: room.equipments || [],
          image: room.imageUrl ? `${API_BASE_URL}${room.imageUrl}` : '',
        }));

        setRoomsData(formattedRooms);
        setFilteredRooms(formattedRooms);
      } else {
        console.error('Error fetching rooms:', result.error?.message);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const handleLocationCheckboxChange = (location) => {
    setSelectedLocations(
      (prev) =>
        prev.includes(location)
          ? prev.filter((loc) => loc !== location) // Bỏ chọn nếu đã được chọn
          : [...prev, location], // Thêm vào nếu chưa được chọn
    );
  };

  // Xử lý chọn/deselect cho sức chứa
  const handleCapacityCheckboxChange = (capacity) => {
    setSelectedCapacities((prev) =>
      prev.includes(capacity)
        ? prev.filter((cap) => cap !== capacity)
        : [...prev, capacity],
    );
  };
  const handleSearch = () => {
    const result = roomsData.filter((room) => {
      const matchesName =
        searchRoomName === '' ||
        room.name.toLowerCase().includes(searchRoomName.toLowerCase());
      const matchesLocation =
        selectedLocations.length === 0 ||
        selectedLocations.includes(room.location);
      const matchesStatus =
        selectedStatus === '' || room.status === selectedStatus;
      const matchesCapacity =
        selectedCapacities.length === 0 ||
        selectedCapacities.includes(room.capacity);
      const matchesDevices =
        selectedDevices.length === 0 ||
        selectedDevices.every((device) => room.facilities.includes(device));

      return (
        matchesName &&
        matchesLocation &&
        matchesStatus &&
        matchesCapacity &&
        matchesDevices
      );
    });
    setFilteredRooms(result);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchRoomName('');
    setSelectedDevices([]);
    setSelectedStatus('');
    setSelectedCapacities([]);
    setFilteredRooms(roomsData);
    setCurrentPage(1);
  };

  // Xử lý phân trang
  const totalPages = Math.ceil(filteredRooms.length / ITEMS_PER_PAGE);
  const currentRooms = filteredRooms.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handlePreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className='min-h-screen flex flex-col'>
      <Header />

      <div className='flex-grow mx-auto mt-10 flex gap-4 mb-10 px-6 w-full'>
        {/* Bộ lọc */}
        <div className='w-1/4 bg-white p-6 rounded-2xl shadow-md border border-gray-200 h-full flex-shrink-0 flex flex-col'>
          <h2 className='text-xl font-semibold mb-5 text-gray-800'>Filter</h2>

          {/* Tìm kiếm theo tên phòng */}
          <div className='mb-4'>
            <label className='block text-sm font-bold text-black-700 mb-2'>
              Search for room name
            </label>
            <input
              type='text'
              placeholder='Enter the room name...'
              value={searchRoomName}
              onChange={(e) => setSearchRoomName(e.target.value)}
              className='w-full border border-gray-300 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-gray-50 hover:bg-gray-100 transition-all shadow-sm'
            />
          </div>

          {/* Chọn địa điểm phòng */}
          <div className='mb-4'>
            <label className='block text-sm font-bold text-black-700 mb-2'>
              Chọn địa điểm phòng
            </label>
            <div className='border border-gray-300 rounded-lg p-2 bg-gray-50 hover:bg-gray-100 transition-all'>
              {[...new Set(roomsData.map((room) => room.location))].map(
                (location) => (
                  <label
                    key={location}
                    className='flex items-center space-x-2 py-1 cursor-pointer'
                  >
                    <input
                      type='checkbox'
                      checked={selectedLocations.includes(location)}
                      onChange={() => handleLocationCheckboxChange(location)}
                      className='h-4 w-4 border-gray-300 rounded text-blue-500 focus:ring-blue-400'
                    />
                    <span className='text-sm text-gray-700'>{location}</span>
                  </label>
                ),
              )}
            </div>
          </div>

          <div className='mb-4'>
            <label className='block text-sm font-bold text-black-700 mb-2'>
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className='w-full border border-gray-300 rounded-xl py-2 px-3 text-sm focus:ring-2
              focus:ring-blue-400 focus:outline-none bg-gray-50  hover:bg-gray-100 transition-all shadow-sm'
            >
              <option value='' className='text-gray-400'>
                Select status
              </option>
              <option value='Available' className='text-gray-700'>
                Available
              </option>
              <option value='Unavailable' className='text-gray-700'>
                Unavailable
              </option>
            </select>
          </div>

          {/* Lọc theo sức chứa (checkbox cho nhiều lựa chọn) */}
          <div className='mb-4'>
            <label className='block text-sm font-bold text-black-700 mb-2'>
              Capacity
            </label>
            <div className='flex flex-wrap gap-2'>
              {[6, 8, 10, 12].map((capacity) => (
                <label
                  key={capacity}
                  className='flex items-center space-x-1 cursor-pointer'
                >
                  <input
                    type='checkbox'
                    checked={selectedCapacities.includes(capacity)}
                    onChange={() => handleCapacityCheckboxChange(capacity)}
                    className='h-4 w-4 border-gray-300 rounded text-blue-500 focus:ring-blue-400'
                  />
                  <span className='text-sm text-gray-700'>
                    {capacity} person
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Thiết bị */}
          <div className='mb-4'>
            <label className='block text-sm font-bold text-black-700 mb-2'>
              Device
            </label>
            <div className='flex flex-wrap gap-2'>
              {[
                'Projector',
                'Monitor',
                'HDMI',
                'Whiteboard',
                'Microphone',
                'Speaker',
              ].map((device) => (
                <button
                  key={device}
                  onClick={() =>
                    setSelectedDevices((prev) =>
                      prev.includes(device)
                        ? prev.filter((d) => d !== device)
                        : [...prev, device],
                    )
                  }
                  className={`px-3 py-1 rounded-full text-sm border transition-all ${
                    selectedDevices.includes(device)
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {device}
                </button>
              ))}
            </div>
          </div>

          {/* Nút */}
          <div className='flex justify-between mt-auto pt-4 border-t border-gray-200'>
            <button
              onClick={handleReset}
              className='w-1/2 mr-2 py-2 bg-gray-100 text-gray-600 border
             border-gray-300 rounded-lg hover:bg-gray-200 transition-all'
            >
              Reset
            </button>
            <button
              onClick={handleSearch}
              className='w-1/2 ml-2 py-2  bg-blue-500  text-white rounded-lg  hover:bg-blue-600 transition-all'
            >
              Search
            </button>
          </div>
        </div>

        {/* Danh sách phòng họp*/}
        <div className='w3/4 flex-grow bg-gray-50 p-6 rounded-2xl shadow-md border border-gray-200'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-2xl font-bold'>Book a Meeting Room</h2>
          </div>

          {/* Danh sách phòng họp */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
            {currentRooms.map((room) => (
              <div
                key={room.id}
                className='border rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow bg-white'
              >
                {/* Ảnh phòng */}
                <img
                  src={room.image}
                  alt={room.name}
                  className='w-full h-48 object-cover'
                />
                <div className='p-5'>
                  {/* Tên phòng */}
                  <h3 className='font-semibold text-xl text-gray-800 truncate'>
                    {room.name}
                  </h3>

                  {/* Địa điểm + Sức chứa */}
                  <div className='mt-2 space-y-1 text-gray-600'>
                    <p className='flex items-center'>
                      <MapPin size={18} className='mr-2 text-blue-500' />{' '}
                      {/* Icon Địa điểm */}
                      Location:{' '}
                      <span className='font-medium ml-1'>{room.location}</span>
                    </p>
                    <p className='flex items-center'>
                      <Users size={18} className='mr-2 text-red-500' />{' '}
                      {/* Icon Sức chứa */}
                      Capacity:{' '}
                      <span className='font-medium ml-1'>{room.capacity}</span>
                    </p>
                  </div>

                  {/* Trạng thái */}
                  <p
                    className={`mt-3 text-sm font-medium ${
                      room.status === 'Available'
                        ? 'text-green-500'
                        : room.status === 'Booked'
                        ? 'text-blue-500'
                        : 'text-red-500'
                    }`}
                  >
                    {room.status}
                  </p>

                  <p>
                    <span className='font-medium text-sm'>{room.note}</span>
                  </p>

                  {/* Danh sách tiện ích */}
                  <div className='flex flex-wrap gap-2 mt-3'>
                    {room.facilities.map((facility, index) => (
                      <span
                        key={index}
                        className='text-xs bg-gray-100 px-3 py-1 rounded-full border border-gray-300'
                      >
                        {facility}
                      </span>
                    ))}
                  </div>

                  {/* Nút đặt phòng */}
                  {room.status === 'Available' ? (
                    <Link to={`/Calendar/${room.id}`}>
                      <button className='w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-xl mt-5 transition-all'>
                        Book Room
                      </button>
                    </Link>
                  ) : (
                    <button
                      className='w-full bg-gray-300 text-gray-600 font-medium py-2 rounded-xl mt-5 cursor-not-allowed'
                      disabled
                    >
                      Book Room
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className='flex justify-center items-center mt-8 gap-2'>
              {/* Nút chuyển trang trước */}
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${
                  currentPage === 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                <ChevronLeft size={18} />
              </button>

              {/* Các số trang */}
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

              {/* Nút chuyển trang sau */}
              <button
                onClick={handleNextPage}
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

      <Footer />
    </div>
  );
}
