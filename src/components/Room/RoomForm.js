import React, { useState, useEffect } from 'react';

const availableEquipments = [
  'Projector',
  'Monitor',
  'HDMI',
  'Whiteboard',
  'Microphone',
  'Speaker',
];

export default function RoomForm({ initialData, onSubmit, onCancel }) {
  const [roomName, setRoomName] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState('');
  const [available, setAvailable] = useState(false);
  const [note, setNote] = useState('');
  const [facilities, setFacilities] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (initialData) {
      setRoomName(initialData.roomName || '');
      setLocation(initialData.location || '');
      setCapacity(initialData.capacity ? String(initialData.capacity) : '');
      setAvailable(initialData.available ?? false);
      setNote(initialData.note || '');
      setFacilities(initialData.equipments || []);
      setImageUrl(initialData.imageUrl || '');
      setImagePreview(initialData.imageUrl ? initialData.imageUrl : '');
    } else {
      setRoomName('');
      setLocation('');
      setCapacity('');
      setAvailable(false);
      setNote('');
      setFacilities([]);
      setImageUrl('');
      setImageFile(null);
      setImagePreview('');
    }
  }, [initialData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const toggleEquipment = (device) => {
    setFacilities((prev) =>
      prev.includes(device)
        ? prev.filter((d) => d !== device)
        : [...prev, device],
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    const payload = {
      roomName,
      location,
      capacity: capacity === '' ? null : Number(capacity),
      available,
      note,
      equipments: facilities,
      image: imageFile,
    };
    if (initialData && initialData.id) {
      payload.id = initialData.id;
    }
    if (!imageFile && initialData && initialData.imageUrl) {
      payload.imageUrl = initialData.imageUrl;
    }

    try {
      const result = await onSubmit(payload);
      if (!result.success) {
        setErrorMessage(
          result.error?.message || 'An error occurred while saving the room',
        );
      }
    } catch (error) {
      setErrorMessage(error.message || 'Connection error');
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
          <label className='block text-sm font-medium text-gray-700 mb-1'>
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
          <label className='block text-sm font-medium text-gray-700 mb-1'>
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
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Capacity
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
            {availableEquipments.map((device) => (
              <button
                key={device}
                type='button'
                onClick={() => toggleEquipment(device)}
                className={`px-3 py-1 rounded-full text-sm border transition-all ${
                  facilities.includes(device)
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {device}
              </button>
            ))}
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Room Image
          </label>
          <div className='flex items-center justify-center w-full'>
            <label
              htmlFor='file-upload'
              className='flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors'
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt='Preview'
                  className='object-cover w-full h-full rounded-md'
                />
              ) : (
                <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                  <svg
                    className='w-8 h-8 mb-3 text-gray-400'
                    aria-hidden='true'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M7 16V4m0 0l-3 3m3-3l3 3M17 16v-8m0 0l-3 3m3-3l3 3'
                    ></path>
                  </svg>
                  <p className='mb-2 text-sm text-gray-600'>
                    <span className='font-semibold'>Click to upload</span> or
                    drag & drop
                  </p>
                  <p className='text-xs text-gray-500'>
                    SVG, PNG, JPG (max 2MB)
                  </p>
                </div>
              )}
              <input
                id='file-upload'
                type='file'
                accept='image/*'
                onChange={handleImageChange}
                className='hidden'
              />
            </label>
          </div>
        </div>

        {/* Submit and Cancel Buttons */}
        <div className='flex justify-end gap-4 mt-4'>
          <button
            type='submit'
            className='py-2 px-5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition'
          >
            {initialData ? 'Update Room' : 'Add Room'}
          </button>
          {onCancel && (
            <button
              type='button'
              onClick={onCancel}
              className='py-2 px-5 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition'
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
