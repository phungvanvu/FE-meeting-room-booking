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
  // Các state lưu trữ giá trị form
  const [roomName, setRoomName] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState('');
  const [available, setAvailable] = useState(false);
  const [note, setNote] = useState('');
  const [facilities, setFacilities] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null); // File ảnh mới tải lên
  const [imagePreview, setImagePreview] = useState('');

  // Khi component mount hoặc initialData thay đổi, điền dữ liệu vào form nếu có
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
      // Nếu không có dữ liệu (chế độ thêm mới), reset form
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

  // Xử lý tải file ảnh lên
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Tạo preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Xử lý chọn thiết bị
  const toggleEquipment = (device) => {
    setFacilities((prev) =>
      prev.includes(device)
        ? prev.filter((d) => d !== device)
        : [...prev, device],
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      roomName,
      location,
      capacity: Number(capacity),
      available,
      note,
      equipments: facilities,
      image: imageFile,
    };
    if (initialData && initialData.id) {
      payload.id = initialData.id;
    }
    // Nếu không có file mới, giữ lại imageUrl cũ
    if (!imageFile && initialData && initialData.imageUrl) {
      payload.imageUrl = initialData.imageUrl;
    }
    onSubmit(payload);
  };

  return (
    <div className='p-6 bg-white rounded-xl shadow-md max-w-xl mx-auto'>
      <h2 className='text-2xl font-bold mb-4'>
        {initialData ? 'Sửa Phòng' : 'Thêm Phòng'}
      </h2>
      <form onSubmit={handleSubmit} className='space-y-4'>
        {/* Tên phòng */}
        <div>
          <label className='block text-sm font-bold text-gray-700 mb-1'>
            Tên phòng
          </label>
          <input
            type='text'
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className='w-full border border-gray-300 rounded-xl py-2 px-3 focus:ring-2 focus:ring-blue-400'
            placeholder='VD: Team Collaboration Space'
          />
        </div>

        {/* Vị trí */}
        <div>
          <label className='block text-sm font-bold text-gray-700 mb-1'>
            Vị trí
          </label>
          <input
            type='text'
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className='w-full border border-gray-300 rounded-xl py-2 px-3 focus:ring-2 focus:ring-blue-400'
            placeholder='VD: Building B, Floor 3'
          />
        </div>

        {/* Sức chứa (Radiobox) */}
        <div>
          <label className='block text-sm font-bold text-gray-700 mb-1'>
            Sức chứa
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
                  {option} người
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Available (Checkbox) */}
        <div className='flex items-center space-x-2'>
          <input
            type='checkbox'
            checked={available}
            onChange={(e) => setAvailable(e.target.checked)}
            className='h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-400'
          />
          <span className='text-sm font-bold text-gray-700'>
            Available{' '}
            <span className='font-normal text-gray-600'>(Phòng khả dụng)</span>
          </span>
        </div>

        {/* Ghi chú */}
        <div>
          <label className='block text-sm font-bold text-gray-700 mb-1'>
            Ghi chú
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className='w-full border border-gray-300 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-400 h-32 resize-y'
            placeholder='VD: Flexible seating arrangement, notes regarding room setup, etc.'
          ></textarea>
          <p className='mt-1 text-xs text-gray-500'>
            Nhập ghi chú chi tiết nếu cần.
          </p>
        </div>

        {/* Thiết bị (tích chọn) */}
        <div>
          <label className='block text-sm font-bold text-gray-700 mb-2'>
            Thiết bị
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

        {/* Tải ảnh lên */}
        <div>
          <label className='block text-sm font-bold text-gray-700 mb-1'>
            Ảnh phòng
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
                    <span className='font-semibold'>Click để tải lên</span> hoặc
                    kéo thả
                  </p>
                  <p className='text-xs text-gray-500'>
                    SVG, PNG, JPG (không quá 2MB)
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

        {/* Nút Submit và Cancel */}
        <div className='flex justify-end gap-4 mt-6'>
          <button
            type='submit'
            className='py-2 px-6 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all'
          >
            {initialData ? 'Cập nhật phòng' : 'Thêm phòng'}
          </button>
          {onCancel && (
            <button
              type='button'
              onClick={onCancel}
              className='py-2 px-6 bg-gray-300 text-gray-700 rounded-xl hover:bg-gray-400 transition-all'
            >
              Hủy
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
