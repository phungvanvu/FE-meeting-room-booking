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
import DeleteConfirmModal from '../../components/DeleteConfirmModal';

const ITEMS_PER_PAGE = 6;

export default function ManageRoomPage() {
  const [roomsData, setRoomsData] = useState([]);
  const [searchRoomName, setSearchRoomName] = useState('');
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedCapacities, setSelectedCapacities] = useState([]);
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [formInitialData, setFormInitialData] = useState(null);
  const navigate = useNavigate();
  const [bookingRoomId, setBookingRoomId] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteRoomId, setDeleteRoomId] = useState(null);

  // New state for error message from modal form
  // (Assume that ManageRoomPage passes error states to RoomForm internally)
  // const [errorMessage, setErrorMessage] = useState('');

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
          id: room.roomId,
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

  const openBookingModal = (roomId) => {
    setBookingRoomId(roomId);
    setShowBookingModal(true);
  };

  const handleLocationCheckboxChange = (location) => {
    setSelectedLocations((prev) =>
      prev.includes(location)
        ? prev.filter((loc) => loc !== location)
        : [...prev, location],
    );
  };

  const handleCapacityCheckboxChange = (capacity) => {
    setSelectedCapacities((prev) =>
      prev.includes(capacity)
        ? prev.filter((cap) => cap !== capacity)
        : [...prev, capacity],
    );
  };

  const handleSearch = () => {
    const result = roomsData.filter((room) => {
      const matchesRoomName =
        searchRoomName === '' ||
        room.name.toLowerCase().includes(searchRoomName.toLowerCase());
      const matchesSelectedRooms =
        selectedRooms.length === 0 || selectedRooms.includes(room.id);
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
        matchesRoomName &&
        matchesSelectedRooms &&
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
    setSelectedRooms([]);
    setSelectedLocations([]);
    setSelectedStatus('');
    setSelectedCapacities([]);
    setSelectedDevices([]);
    setFilteredRooms(roomsData);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredRooms.length / ITEMS_PER_PAGE);
  const currentRooms = filteredRooms.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handlePreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

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
      imageUrl: room.image ? room.image.replace(API_BASE_URL, '') : '',
      id: room.id,
    };
    setFormInitialData(roomData);
    setShowForm(true);
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
        fetchRooms();
      } else {
        console.error('Error deleting room:', result.error?.message);
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  // Updated addRoom and updateRoom to return result
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
        ...(!payload.image && payload.imageUrl
          ? { imageUrl: payload.imageUrl }
          : {}),
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
        fetchRooms();
      } else {
        console.error('Error adding room:', result.error?.message);
      }
      return result;
    } catch (error) {
      console.error('Add error:', error);
      return { success: false, error: { message: error.message } };
    }
  };

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
        fetchRooms();
      } else {
        console.error('Error updating room:', result.error?.message);
      }
      return result;
    } catch (error) {
      console.error('Update error:', error);
      return { success: false, error: { message: error.message } };
    }
  };

  // Delete confirmation modal functions
  const openDeleteModal = (roomId) => {
    setDeleteRoomId(roomId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteRoomId) {
      await handleDelete(deleteRoomId);
      setShowDeleteModal(false);
    }
  };

  // Function to download file (Excel export)
  const downloadFile = (urlSuffix, fileName) => {
    const accessToken = sessionStorage.getItem('accessToken');
    fetch(`${API_BASE_URL}/${urlSuffix}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch((err) => console.error('Error downloading file:', err));
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

        <div className='w-3/4 flex-grow bg-gray-50 p-6 rounded-2xl shadow-md border border-gray-200'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-2xl font-bold'>Meeting room management</h2>
            <button
              onClick={() => downloadFile('export-rooms-excel', 'rooms.xlsx')}
              className='bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg shadow transition'
            >
              Xuất Rooms
            </button>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
            {currentRooms.map((room) => (
              <div
                key={room.id}
                className='border rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow bg-white'
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
                <div className='p-5'>
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
                          <dd className='flex items-center text-gray-700'>
                            {room.note}
                          </dd>
                        </>
                      )}
                    </dl>
                  </div>
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
                  <div className='flex gap-2 mt-5'>
                    <button
                      onClick={() => openEditForm(room)}
                      className='flex-1 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-xl transition-all'
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openBookingModal(room.id)}
                      className='flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-all'
                    >
                      Booking
                    </button>
                    <button
                      onClick={() => openDeleteModal(room.id)}
                      className='flex-1 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-all'
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
                disabled={currentPage === 1}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${
                  currentPage === 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                <ChevronLeft size={18} />
              </button>
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
