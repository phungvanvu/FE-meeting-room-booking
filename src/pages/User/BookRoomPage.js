import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Users,
  LayoutGrid,
  List,
} from 'lucide-react';
import { isAccessTokenValid } from '../../components/utils/auth';
import API_BASE_URL from '../../config';
import Slider from 'react-slick';

const ITEMS_PER_PAGE = 6;

export default function BookRoomPage() {
  const [roomsData, setRoomsData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  // const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedCapacities, setSelectedCapacities] = useState([]);
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [searchRoomName, setSearchRoomName] = useState('');
  const [allLocations, setAllLocations] = useState([]);
  const [allCapacities, setAllCapacities] = useState([]);
  const [equipmentsData, setEquipmentsData] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // hoặc 'list'
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const initPage = async () => {
      const isValid = await isAccessTokenValid();
      if (!isValid) {
        navigate('/Login');
        return;
      }
      fetchFilterOptions();
      fetchRooms(0);
    };

    initPage();
  }, [navigate]);

  const fetchFilterOptions = async () => {
    const accessToken = sessionStorage.getItem('accessToken');
    try {
      const response = await fetch(`${API_BASE_URL}/room/available/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const result = await response.json();
      if (result.success && result.data) {
        const locations = [
          ...new Set(result.data.map((room) => room.location)),
        ];
        const capacities = [
          ...new Set(result.data.map((room) => room.capacity)),
        ];
        setAllLocations(locations);
        setAllCapacities(capacities);
      } else {
        console.error('Error fetching room options:', result.error?.message);
      }
    } catch (error) {
      console.error('Fetch room options error:', error);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/equipment`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        setEquipmentsData(result.data);
      } else {
        console.error('Error fetching equipments:', result.error?.message);
      }
    } catch (error) {
      console.error('Fetch equipments error:', error);
    }
  };

  const fetchRooms = async (page) => {
    const accessToken = sessionStorage.getItem('accessToken');
    const params = new URLSearchParams();

    if (searchRoomName) params.append('roomName', searchRoomName);

    if (selectedLocations.length > 0) {
      selectedLocations.forEach((location) =>
        params.append('locations', location),
      );
    }

    // if (selectedStatus) {
    //   params.append('available', selectedStatus === 'Available');
    // }

    if (selectedCapacities.length > 0) {
      selectedCapacities.forEach((capacity) =>
        params.append('capacities', capacity),
      );
    }

    if (selectedDevices.length > 0) {
      selectedDevices.forEach((device) => params.append('equipments', device));
    }

    params.append('page', page);
    params.append('size', ITEMS_PER_PAGE);

    try {
      const response = await fetch(
        `${API_BASE_URL}/room/available?${params.toString()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const result = await response.json();
      if (result.success && result.data) {
        setRoomsData(result.data.content || []);
        setTotalPages(result.data.totalPages);
        setCurrentPage(page);
      } else {
        console.error('Error fetching rooms:', result.error?.message);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const handleSearch = () => {
    fetchRooms(0);
  };

  const handleReset = () => {
    setSearchRoomName('');
    setSelectedDevices([]);
    // setSelectedStatus('');
    setSelectedCapacities([]);
    setSelectedLocations([]);
    fetchRooms(0);
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      fetchRooms(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      fetchRooms(currentPage + 1);
    }
  };

  const sliderSettings = (imagesLength) => ({
    dots: true,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
  });

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
              Select room location
            </label>
            <div className='border border-gray-300 rounded-lg p-2 bg-gray-50 hover:bg-gray-100 transition-all'>
              {allLocations.map((location) => (
                <label
                  key={location}
                  className='flex items-center space-x-2 py-1 cursor-pointer'
                >
                  <input
                    type='checkbox'
                    checked={selectedLocations.includes(location)}
                    onChange={() =>
                      setSelectedLocations((prev) =>
                        prev.includes(location)
                          ? prev.filter((loc) => loc !== location)
                          : [...prev, location],
                      )
                    }
                    className='h-4 w-4 border-gray-300 rounded text-blue-500 focus:ring-blue-400'
                  />
                  <span className='text-sm text-gray-700'>{location}</span>
                </label>
              ))}
            </div>
          </div>

          {/* <div className='mb-4'>
            <label className='block text-sm font-bold text-black-700 mb-2'>
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
              <option value='Available' className='text-gray-700'>
                Available
              </option>
              <option value='Unavailable' className='text-gray-700'>
                Unavailable
              </option>
            </select>
          </div> */}

          {/* Lọc theo sức chứa */}
          <div className='mb-4'>
            <label className='block text-sm font-bold text-black-700 mb-2'>
              Capacity
            </label>
            <div className='flex flex-wrap gap-2'>
              {allCapacities.map((capacity) => (
                <label
                  key={capacity}
                  className='flex items-center space-x-1 cursor-pointer'
                >
                  <input
                    type='checkbox'
                    checked={selectedCapacities.includes(capacity)}
                    onChange={() =>
                      setSelectedCapacities((prev) =>
                        prev.includes(capacity)
                          ? prev.filter((cap) => cap !== capacity)
                          : [...prev, capacity],
                      )
                    }
                    className='h-4 w-4 border-gray-300 rounded text-blue-500 focus:ring-blue-400'
                  />
                  <span className='text-sm text-gray-700'>
                    {capacity} person
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Lấy danh sách thiết bị từ API */}
          <div className='mb-4'>
            <label className='block text-sm font-bold text-black-700 mb-2'>
              Device
            </label>
            <div className='flex flex-wrap gap-2'>
              {equipmentsData.length > 0 &&
                equipmentsData.map((device) => (
                  <button
                    key={device.equipmentName}
                    onClick={() =>
                      setSelectedDevices((prev) =>
                        prev.includes(device.equipmentName)
                          ? prev.filter((d) => d !== device.equipmentName)
                          : [...prev, device.equipmentName],
                      )
                    }
                    className={`px-3 py-1 rounded-full text-sm border transition-all ${
                      selectedDevices.includes(device.equipmentName)
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {device.equipmentName}
                  </button>
                ))}
            </div>
          </div>

          {/* Nút tìm kiếm và reset */}
          <div className='flex justify-between mt-auto pt-4 border-t border-gray-200'>
            <button
              onClick={handleReset}
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

        {/* Danh sách phòng họp */}
        <div className='w-3/4 flex-grow bg-gray-50 p-6 rounded-2xl shadow-md border border-gray-200'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-2xl font-bold'>Book a Meeting Room</h2>
            <div className='flex gap-2'>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${
                  viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
              >
                <LayoutGrid className='w-5 h-5' />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${
                  viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
              >
                <List className='w-5 h-5' />
              </button>
            </div>
          </div>

          {/* Hiển thị danh sách phòng họp */}
          <div
            className={`${
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'
                : 'flex flex-col gap-4'
            }`}
          >
            {roomsData.map((room) => (
              <div
                key={room.roomId}
                className={`border rounded-xl shadow-lg overflow-hidden bg-white hover:shadow-xl transition-shadow ${
                  viewMode === 'list'
                    ? 'flex flex-row items-center h-auto'
                    : 'flex flex-col'
                }`}
              >
                {/* Hình ảnh */}
                {Array.isArray(room.imageUrls) && room.imageUrls.length > 0 ? (
                  // Wrapper list vs grid mode
                  <div
                    className={`overflow-visible ${
                      viewMode === 'list'
                        ? 'w-1/3 h-64 flex-shrink-0'
                        : 'w-full h-64'
                    }`}
                  >
                    {room.imageUrls.length > 1 ? (
                      <Slider
                        {...sliderSettings(room.imageUrls.length)}
                        className='w-full h-64'
                      >
                        {room.imageUrls.map((url, idx) => (
                          <div
                            key={idx}
                            className='w-full h-64 overflow-hidden'
                          >
                            <img
                              src={url}
                              alt={`${room.roomName} - ${idx + 1}`}
                              className='object-cover w-full h-full'
                            />
                          </div>
                        ))}
                      </Slider>
                    ) : (
                      <img
                        src={room.imageUrls[0]}
                        alt={room.roomName}
                        className='object-cover w-full h-full'
                      />
                    )}
                  </div>
                ) : (
                  // No Image
                  <div
                    className={`bg-gray-200 flex items-center justify-center ${
                      viewMode === 'list' ? 'w-1/3 h-64' : 'w-full h-64'
                    }`}
                  >
                    No Image
                  </div>
                )}

                {/* Phần nội dung và nút */}
                {viewMode === 'list' ? (
                  <>
                    {/* Phần thông tin (giữa) */}
                    <div className='w-1/2 p-5 flex flex-col justify-between h-full'>
                      <div>
                        <h3 className='font-semibold text-xl text-gray-800 truncate'>
                          {room.roomName}
                        </h3>
                        <div className='mt-2 space-y-1 text-gray-600'>
                          <p className='flex items-center'>
                            <MapPin size={18} className='mr-2 text-blue-500' />
                            Location:{' '}
                            <span className='font-medium ml-1'>
                              {room.location}
                            </span>
                          </p>
                          <p className='flex items-center'>
                            <Users size={18} className='mr-2 text-red-500' />
                            Capacity:{' '}
                            <span className='font-medium ml-1'>
                              {room.capacity}
                            </span>
                          </p>
                        </div>
                        <p className='mt-3 text-sm font-medium text-green-500'>
                          Available
                        </p>
                        <div className='font-medium text-sm whitespace-pre-line break-words'>
                          {room.note}
                        </div>
                        <div className='flex flex-wrap gap-2 mt-3'>
                          {(room.equipments || []).map((facility, index) => (
                            <span
                              key={`${facility}-${index}`}
                              className='text-xs bg-gray-100 px-3 py-1 rounded-full border border-gray-300'
                            >
                              {facility}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Phần nút Book Room (bên phải) */}
                    <div className='w-1/6 p-5 flex items-center justify-center h-full'>
                      {room.available ? (
                        <Link to={`/Calendar/${room.roomId}`}>
                          <button className='bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-5 rounded-xl'>
                            Book Room
                          </button>
                        </Link>
                      ) : (
                        <button
                          className='bg-gray-300 text-gray-600 font-medium py-2 px-5 rounded-xl cursor-not-allowed'
                          disabled
                        >
                          Book Room
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  // GRID MODE
                  <div className='p-5 flex flex-col flex-grow'>
                    <div>
                      <h3 className='font-semibold text-xl text-gray-800 truncate'>
                        {room.roomName}
                      </h3>
                      <div className='mt-2 space-y-1 text-gray-600'>
                        <p className='flex items-center'>
                          <MapPin size={18} className='mr-2 text-blue-500' />
                          Location:{' '}
                          <span className='font-medium ml-1'>
                            {room.location}
                          </span>
                        </p>
                        <p className='flex items-center'>
                          <Users size={18} className='mr-2 text-red-500' />
                          Capacity:{' '}
                          <span className='font-medium ml-1'>
                            {room.capacity}
                          </span>
                        </p>
                      </div>
                      <p className='mt-3 text-sm font-medium text-green-500'>
                        Available
                      </p>
                      <div className='font-medium text-sm whitespace-pre-line break-words'>
                        {room.note}
                      </div>
                      <div className='flex flex-wrap gap-2 mt-3 mb-4'>
                        {(room.equipments || []).map((facility, index) => (
                          <span
                            key={`${facility}-${index}`}
                            className='text-xs bg-gray-100 px-3 py-1 rounded-full border border-gray-300'
                          >
                            {facility}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className='mt-auto'>
                      {room.available ? (
                        <Link to={`/Calendar/${room.roomId}`}>
                          <button className='w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-xl transition-all'>
                            Book Room
                          </button>
                        </Link>
                      ) : (
                        <button
                          className='w-full bg-gray-300 text-gray-600 font-medium py-2 rounded-xl cursor-not-allowed'
                          disabled
                        >
                          Book Room
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Phân trang */}
          {totalPages > 1 && (
            <div className='flex justify-center items-center mt-8 gap-2'>
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 0}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${
                  currentPage === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                <ChevronLeft size={18} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => fetchRooms(i)}
                  className={`w-10 h-10 flex items-center justify-center rounded-full font-medium transition-all ${
                    currentPage === i
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-blue-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages - 1}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${
                  currentPage === totalPages - 1
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
