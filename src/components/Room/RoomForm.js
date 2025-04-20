import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../../config';

export default function RoomForm({ initialData, onSubmit, onCancel }) {
  const [roomName, setRoomName] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState('');
  const [available, setAvailable] = useState(false);
  const [note, setNote] = useState('');
  const [equipments, setEquipments] = useState([]);
  const [equipmentOptions, setEquipmentOptions] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImageUrls, setExistingImageUrls] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/equipment`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setEquipmentOptions(data.data);
        } else {
          setErrorMessage('Failed to fetch equipment');
        }
      } catch (error) {
        setErrorMessage('Error fetching equipment');
      }
    };

    fetchEquipment();

    if (initialData) {
      setRoomName(initialData.roomName || '');
      setLocation(initialData.location || '');
      setCapacity(initialData.capacity?.toString() || '');
      setAvailable(initialData.available ?? false);
      setNote(initialData.note || '');
      setEquipments(initialData.equipments || []);
      setExistingImageUrls(initialData.existingImageUrls || []);
      setImageFiles([]);
      setImagePreviews([]);
    } else {
      setRoomName('');
      setLocation('');
      setCapacity('');
      setAvailable(false);
      setNote('');
      setEquipments([]);
      setExistingImageUrls([]);
      setImageFiles([]);
      setImagePreviews([]);
    }
  }, [initialData]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    setImageFiles(files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const toggleEquipment = (name) => {
    setEquipments((prev) =>
      prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name],
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    const payload = {
      roomName,
      location,
      capacity: capacity ? Number(capacity) : null,
      available,
      note,
      equipments,
      imageFiles,
      imageUrl: existingImageUrls,
    };
    if (initialData?.id) payload.id = initialData.id;

    try {
      const result = await onSubmit(payload);
      if (!result.success) {
        setErrorMessage(result.error?.message || 'Error saving room');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Connection error');
    }
  };

  return (
    <div className='p-4 bg-white rounded-xl shadow-md w-full max-w-md mx-auto overflow-y-auto'>
      <h2 className='text-2xl font-bold mb-3 text-center'>
        {initialData ? 'Edit Room' : 'Add Room'}
      </h2>

      {errorMessage && (
        <div className='p-3 bg-red-100 text-red-700 mb-3 rounded text-sm'>
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className='space-y-3'>
        {/* Room Name */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1 after:content-["*"] after:ml-0.5 after:text-red-500 after:text-base'>
            Room Name
          </label>
          <input
            type='text'
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className='w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-2 focus:ring-blue-400'
            placeholder='e.g., Team Collaboration Space'
          />
        </div>

        {/* Location */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1 after:content-["*"] after:ml-0.5 after:text-red-500 after:text-base'>
            Location
          </label>
          <input
            type='text'
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className='w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-2 focus:ring-blue-400'
            placeholder='e.g., Building B, Floor 3'
          />
        </div>

        {/* Capacity */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1 after:content-["*"] after:ml-0.5 after:text-red-500 after:text-base'>
            Room Name
          </label>
          <div className='flex items-center space-x-4'>
            {['6', '8', '10', '12'].map((option) => (
              <label key={option} className='flex items-center'>
                <input
                  type='radio'
                  name='capacity'
                  value={option}
                  checked={capacity === option}
                  onChange={(e) => setCapacity(e.target.value)}
                  className='h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-400'
                />
                <span className='ml-1 text-sm text-gray-700'>
                  {option} people
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Available Toggle Switch */}
        <div className='flex items-center'>
          <label
            htmlFor='toggle-available'
            className='relative inline-block w-12 h-6'
          >
            <input
              id='toggle-available'
              type='checkbox'
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
              className='opacity-0 w-0 h-0'
            />
            <span
              className={`absolute inset-0 cursor-pointer rounded-full transition-colors duration-200 ${
                available ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            ></span>
            <span
              className={`absolute left-0 top-0 bg-white w-6 h-6 rounded-full transition-transform duration-200 ease-in-out transform ${
                available ? 'translate-x-6' : 'translate-x-0'
              }`}
            ></span>
          </label>
          <span className='ml-3 text-sm font-medium text-gray-700'>
            Available{' '}
            <span className='font-normal text-gray-600'>
              (Room is available)
            </span>
          </span>
        </div>

        {/* Note */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Note
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className='w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-2 focus:ring-blue-400 h-28 resize-y'
            placeholder='e.g., Flexible seating arrangement, special instructions, etc.'
          ></textarea>
          <p className='mt-1 text-xs text-gray-500'>
            Enter detailed notes if needed.
          </p>
        </div>

        {/* Equipments */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Equipments
          </label>
          <div className='flex flex-wrap gap-2'>
            {equipmentOptions.map((device) => (
              <button
                key={device.equipmentName}
                type='button'
                onClick={() => toggleEquipment(device.equipmentName)}
                className={`px-3 py-1 rounded-full text-sm border transition-all ${
                  equipments.includes(device.equipmentName)
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {device.equipmentName}
              </button>
            ))}
          </div>
        </div>

        {/* Multi-image Upload */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Room Images
          </label>
          <input
            type='file'
            accept='image/*'
            multiple
            onChange={handleImageChange}
            className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
          />
          <div className='mt-2 flex flex-wrap gap-2'>
            {existingImageUrls.map((url, i) => (
              <img
                key={i}
                src={url}
                alt='existing'
                className='w-20 h-20 object-cover rounded'
              />
            ))}
            {imagePreviews.map((src, i) => (
              <img
                key={i}
                src={src}
                alt='new'
                className='w-20 h-20 object-cover rounded'
              />
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className='flex justify-end gap-3 mt-4'>
          <button
            type='button'
            onClick={onCancel}
            className='px-4 py-2 bg-gray-300 text-gray-700 rounded-md'
          >
            Cancel
          </button>
          <button
            type='submit'
            className='px-4 py-2 bg-blue-500 text-white rounded-md'
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
