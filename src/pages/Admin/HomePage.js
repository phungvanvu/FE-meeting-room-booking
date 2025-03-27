import { useNavigate } from 'react-router-dom';

const HomeAdmin = () => {
  const navigate = useNavigate();

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <div className='grid grid-cols-3 gap-8'>
        {/* Quản lý phòng */}
        <div
          className='w-60 h-60 flex items-center justify-center bg-white shadow-md rounded-lg text-center text-xl font-semibold 
                     hover:bg-blue-300 hover:text-white transition transform hover:scale-105 cursor-pointer'
          onClick={() => navigate('/room-management')}
        >
          Quản lý phòng
        </div>

        {/* Quản lý người dùng */}
        <div
          className='w-60 h-60 flex items-center justify-center bg-white shadow-md rounded-lg text-center text-xl font-semibold 
                     hover:bg-blue-300 hover:text-white transition transform hover:scale-105 cursor-pointer'
          onClick={() => navigate('/user-management')}
        >
          Quản lý người dùng
        </div>

        {/* Thống kê */}
        <div
          className='w-60 h-60 flex items-center justify-center bg-white shadow-md rounded-lg text-center text-xl font-semibold 
                     hover:bg-blue-300 hover:text-white transition transform hover:scale-105 cursor-pointer'
          onClick={() => navigate('/statistics')}
        >
          Thống kê
        </div>
      </div>
    </div>
  );
};

export default HomeAdmin;
