import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Users,
  CheckCircle,
  XCircle,
  FileText,
} from 'lucide-react';
import { isAccessTokenValid } from '../../components/utils/auth';
import API_BASE_URL from '../../config';
import RoomForm from '../../components/Room/RoomForm';
import RoomBookingsModal from '../../components/Room/RoomBookingsModal';
import DeleteConfirmModal from '../../components/Room/DeleteConfirmModal';

const ITEMS_PER_PAGE = 6;

export default function ManageRoomPage() {
  // Dữ liệu phòng trả về từ API (đã lọc, phân trang, sắp xếp)
  const [roomsData, setRoomsData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  // Các state filter (để gửi lên API)
  const [searchRoomName, setSearchRoomName] = useState('');
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedCapacities, setSelectedCapacities] = useState([]);
  const [selectedDevices, setSelectedDevices] = useState([]);

  // Các state cho danh sách filter option (lấy từ API /room)
  const [allLocations, setAllLocations] = useState([]);
  const [allCapacities, setAllCapacities] = useState([]);
  const [allEquipments, setAllEquipments] = useState([]);

  // Các state khác
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formInitialData, setFormInitialData] = useState(null);
  const [bookingRoomId, setBookingRoomId] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteRoomId, setDeleteRoomId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const initPage = async () => {
      const isValid = await isAccessTokenValid();
      if (!isValid) {
        navigate('/Login');
        return;
      }
      // Lấy dữ liệu cho filter (địa điểm, sức chứa)
      fetchFilterOptions();
      // Lấy dữ liệu cho filter thiết bị từ API
      fetchEquipmentOptions();
      // Lấy danh sách phòng theo filter và phân trang (trang đầu tiên)
      fetchRooms(0);
    };
    initPage();
  }, [navigate]);

  // Hàm lấy danh sách phòng từ API /room để lấy các filter option
  const fetchFilterOptions = async () => {
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
        const locations = [
          ...new Set(result.data.map((room) => room.location)),
        ];
        const capacities = [
          ...new Set(result.data.map((room) => room.capacity)),
        ];
        setAllLocations(locations);
        setAllCapacities(capacities);
      } else {
        console.error('Error fetching filter options:', result.error?.message);
      }
    } catch (error) {
      console.error('Fetch filter options error:', error);
    }
  };

  const fetchEquipmentOptions = async () => {
    const accessToken = sessionStorage.getItem('accessToken');
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
        setAllEquipments(result.data);
      } else {
        console.error(
          'Error fetching equipment options:',
          result.error?.message,
        );
      }
    } catch (error) {
      console.error('Fetch equipment options error:', error);
    }
  };

  // Hàm gọi API /room/search với các tham số filter và phân trang
  const fetchRooms = async (page) => {
    const accessToken = sessionStorage.getItem('accessToken');
    const params = new URLSearchParams();

    if (searchRoomName) {
      params.append('roomName', searchRoomName);
    }
    if (selectedLocations.length > 0) {
      selectedLocations.forEach((location) =>
        params.append('locations', location),
      );
    }
    if (selectedStatus) {
      // API yêu cầu Boolean cho available
      params.append('available', selectedStatus === 'Available');
    }
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
        `${API_BASE_URL}/room/search?${params.toString()}`,
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
        const formattedRooms = result.data.content.map((room) => ({
          id: room.roomId,
          name: room.roomName || 'No name',
          location: room.location || 'Unknown location',
          note: room.note || '',
          capacity: room.capacity || null,
          status: room.available ? 'Available' : 'Unavailable',
          facilities: room.equipments || [],
          // Ảnh đã có URL đầy đủ từ Localstack, dùng trực tiếp
          image: room.imageUrl || '',
        }));
        setRoomsData(formattedRooms);
        setTotalPages(result.data.totalPages);
        setCurrentPage(page);
      } else {
        console.error('Error fetching rooms:', result.error?.message);
      }
    } catch (error) {
      console.error('Fetch rooms error:', error);
    }
  };

  // Hàm thêm phòng (addRoom)
  const addRoom = async (payload) => {
    const accessToken = sessionStorage.getItem('accessToken');
    try {
      const formData = new FormData();
      const roomData = {
        roomName: payload.roomName,
        location: payload.location,
        note: payload.note || '',
        capacity: payload.capacity,
        available: payload.available,
        equipments: payload.equipments || [],
      };
      const roomBlob = new Blob([JSON.stringify(roomData)], {
        type: 'application/json',
      });
      formData.append('room', roomBlob);
      if (payload.image && payload.image instanceof File) {
        formData.append('file', payload.image, payload.image.name);
      }
      const response = await fetch(`${API_BASE_URL}/room`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });
      const result = await response.json();
      if (result.success) {
        fetchRooms(currentPage);
      } else {
        console.error('Error adding room:', result.error?.message);
      }
      return result;
    } catch (error) {
      console.error('Add room error:', error);
      return { success: false, error: { message: error.message } };
    }
  };

  // Hàm cập nhật phòng (updateRoom)
  const updateRoom = async (payload, roomId) => {
    const accessToken = sessionStorage.getItem('accessToken');
    try {
      const formData = new FormData();
      const roomData = {
        roomId: payload.id,
        roomName: payload.roomName,
        location: payload.location,
        note: payload.note || '',
        capacity: payload.capacity,
        available: payload.available,
        equipments: payload.equipments || [],
      };
      // Nếu không có file upload, sử dụng imageUrl có sẵn
      if (!payload.image && payload.imageUrl) {
        roomData.imageUrl = payload.imageUrl;
      }
      const roomBlob = new Blob([JSON.stringify(roomData)], {
        type: 'application/json',
      });
      formData.append('room', roomBlob);
      if (payload.image && payload.image instanceof File) {
        formData.append('file', payload.image, payload.image.name);
      }
      const response = await fetch(`${API_BASE_URL}/room/${roomId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });
      const result = await response.json();
      if (result.success) {
        fetchRooms(currentPage);
      } else {
        console.error('Error updating room:', result.error?.message);
      }
      return result;
    } catch (error) {
      console.error('Update room error:', error);
      return { success: false, error: { message: error.message } };
    }
  };

  // Các hàm mở modal, form, delete, ...
  const openAddForm = () => {
    setFormInitialData(null);
    setShowForm(true);
  };

  const openEditForm = (room) => {
    const roomData = {
      roomName: room.name,
      location: room.location,
      capacity: room.capacity,
      available: room.status === 'Available',
      note: room.note,
      equipments: room.facilities,
      imageUrl: room.image || '',
      id: room.id,
    };
    setFormInitialData(roomData);
    setShowForm(true);
  };

  const openBookingModal = (roomId) => {
    setBookingRoomId(roomId);
    setShowBookingModal(true);
  };

  const openDeleteModal = (roomId) => {
    setDeleteRoomId(roomId);
    setShowDeleteModal(true);
  };

  const handleDelete = async (roomId) => {
    const accessToken = sessionStorage.getItem('accessToken');
    try {
      const response = await fetch(`${API_BASE_URL}/room/${roomId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        fetchRooms(currentPage);
      } else {
        console.error('Error deleting room:', result.error?.message);
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleConfirmDelete = async () => {
    if (deleteRoomId) {
      await handleDelete(deleteRoomId);
      setShowDeleteModal(false);
    }
  };

  const downloadFile = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/statistical/export-rooms-excel`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
          },
        },
      );

      if (!response.ok) throw new Error('Error downloading file');

      // Lấy tên tệp từ header Content-Disposition
      const disposition = response.headers.get('Content-Disposition');
      const filenameMatch = disposition && disposition.match(/filename="(.+)"/);
      let filename = filenameMatch && filenameMatch[1];

      if (!filename) {
        // Nếu không có filename trong header, tạo tên tệp mặc định với giờ Việt Nam
        const date = new Date();
        const vietnamTime = new Date(date.getTime() + 7 * 60 * 60 * 1000); // Điều chỉnh múi giờ Việt Nam (GMT+7)
        const formattedTime = vietnamTime
          .toISOString()
          .replace(/T/, '_')
          .replace(/:/g, '-')
          .split('.')[0]; // Định dạng theo 'yyyy-mm-dd_HH-mm-ss'
        filename = `rooms_${formattedTime}.xlsx`;
      }

      const blob = await response.blob();

      // Tạo một liên kết tạm thời để tải tệp về
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename; // Dùng tên tệp đã xử lý
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  // Phân trang: currentPage là chỉ số 0-based
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

  // Gọi API với các tham số filter hiện hành (và reset trang về 0)
  const handleSearch = () => {
    fetchRooms(0);
  };

  // Reset các filter và gọi lại API
  const handleReset = () => {
    setSearchRoomName('');
    setSelectedRooms([]);
    setSelectedLocations([]);
    setSelectedStatus('');
    setSelectedCapacities([]);
    setSelectedDevices([]);
    fetchRooms(0);
  };

  return (
    <div className='min-h-screen flex flex-col'>
      <Header />

      {showForm && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
          <RoomForm
            initialData={formInitialData}
            onSubmit={async (payload) => {
              let result;
              if (formInitialData) {
                result = await updateRoom(payload, formInitialData.id);
              } else {
                result = await addRoom(payload);
              }
              if (result.success) {
                setShowForm(false);
              }
              return result;
            }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {showDeleteModal && (
        <DeleteConfirmModal
          message='Are you sure you want to delete this room?'
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

      {showBookingModal && (
        <RoomBookingsModal
          roomId={bookingRoomId}
          onClose={() => setShowBookingModal(false)}
        />
      )}

      <div className='flex-grow mx-auto mt-10 flex gap-4 mb-10 px-6 w-full'>
        {/* Sidebar Filter */}
        <div className='w-1/4 bg-white p-6 rounded-2xl shadow-md border border-gray-200 h-full flex-shrink-0 flex flex-col'>
          <h2 className='text-xl font-semibold mb-5 text-gray-800'>Filter</h2>
          <div className='mb-4'>
            <button
              onClick={openAddForm}
              className='w-full py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-all'
            >
              Create room
            </button>
          </div>
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
          <div className='mb-4'>
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
          </div>
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
          <div className='mb-4'>
            <label className='block text-sm font-bold text-black-700 mb-2'>
              Device
            </label>
            <div className='flex flex-wrap gap-2'>
              {allEquipments.map((equipment) => (
                <button
                  key={equipment.equipmentName}
                  onClick={() =>
                    setSelectedDevices((prev) =>
                      prev.includes(equipment.equipmentName)
                        ? prev.filter((d) => d !== equipment.equipmentName)
                        : [...prev, equipment.equipmentName],
                    )
                  }
                  className={`px-3 py-1 rounded-full text-sm border transition-all ${
                    selectedDevices.includes(equipment.equipmentName)
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {equipment.equipmentName}
                </button>
              ))}
            </div>
          </div>

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
        {/* Danh sách phòng */}
        <div className='w-3/4 flex-grow bg-gray-50 p-6 rounded-2xl shadow-md border border-gray-200'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-2xl font-bold'>Meeting Room Management</h2>
            <button
              onClick={() => downloadFile()}
              className='bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg shadow transition'
            >
              Export Excel
            </button>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
            {roomsData.map((room) => (
              <div
                key={room.id}
                className='border rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow bg-white flex flex-col'
              >
                {room.image ? (
                  <img
                    src={room.image}
                    alt={room.name}
                    className='w-full h-48 object-cover'
                  />
                ) : (
                  <div className='w-full h-48 flex items-center justify-center bg-gray-200'>
                    No image available
                  </div>
                )}
                <div className='p-5 flex flex-col flex-grow'>
                  <h3 className='font-semibold text-xl text-gray-800 truncate'>
                    {room.name}
                  </h3>
                  <div className='mt-2'>
                    <dl className='grid grid-cols-2 gap-x-4 gap-y-2 text-gray-600'>
                      <dt className='flex items-center font-medium'>
                        <MapPin size={18} className='mr-1 text-blue-500' />
                        Location:
                      </dt>
                      <dd className='flex items-center'>{room.location}</dd>
                      <dt className='flex items-center font-medium'>
                        <Users size={18} className='mr-1 text-red-500' />
                        Capacity:
                      </dt>
                      <dd className='flex items-center'>{room.capacity}</dd>
                      <dt className='flex items-center font-medium'>
                        {room.status === 'Available' ? (
                          <CheckCircle
                            size={18}
                            className='mr-1 text-green-500'
                          />
                        ) : (
                          <XCircle size={18} className='mr-1 text-red-500' />
                        )}
                        Status:
                      </dt>
                      <dd
                        className={`flex items-center ${
                          room.status === 'Available'
                            ? 'text-green-500'
                            : 'text-red-500'
                        }`}
                      >
                        {room.status}
                      </dd>
                      {room.note && (
                        <>
                          <dt className='flex items-center font-medium'>
                            <FileText
                              size={18}
                              className='mr-1 text-blue-500'
                            />
                            Note:
                          </dt>
                          <dd className='font-medium text-sm whitespace-pre-line break-words'>
                            {room.note}
                          </dd>
                        </>
                      )}
                    </dl>
                  </div>
                  <div className='flex flex-wrap gap-2 mt-3 mb-4'>
                    {room.facilities.map((facility, index) => (
                      <span
                        key={index}
                        className='text-xs bg-gray-100 px-3 py-1 rounded-full border border-gray-300'
                      >
                        {facility}
                      </span>
                    ))}
                  </div>
                  {/* Căn các nút thẳng hàng */}
                  <div className='flex gap-4 mt-auto'>
                    {/* Nút Edit */}
                    <button
                      onClick={() => openEditForm(room)}
                      className='py-2 px-4 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-xl transition-all w-full'
                    >
                      Edit
                    </button>

                    {/* Nút Booking */}
                    <button
                      onClick={() => openBookingModal(room.id)}
                      className='py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-all w-full'
                    >
                      Booking
                    </button>

                    {/* Nút Delete */}
                    <button
                      onClick={() => openDeleteModal(room.id)}
                      className='py-2 px-4 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-all w-full'
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
              {Array.from({ length: totalPages }, (_, i) => i).map((page) => (
                <button
                  key={page}
                  onClick={() => fetchRooms(page)}
                  className={`w-10 h-10 flex items-center justify-center rounded-full font-medium transition-all ${
                    currentPage === page
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-blue-100'
                  }`}
                >
                  {page + 1}
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
