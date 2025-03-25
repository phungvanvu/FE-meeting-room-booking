import { useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {/* Quản lý phòng */}
        <div className="relative w-60 h-60">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full h-full flex items-center justify-center bg-white shadow-md rounded-lg text-center text-xl font-semibold hover:bg-[#A7C7E7] hover:text-white transition transform hover:scale-105"
          >
            Quản lý phòng 
          </button>

          {isDropdownOpen && (
            <div className="absolute left-0 w-full bg-white shadow-md rounded-md mt-2">
              <Link
                to="/available-rooms"
                className="block px-4 py-2 hover:bg-gray-200"
              >
                Phòng trống
              </Link>
              <Link
                to="/booked-rooms"
                className="block px-4 py-2 hover:bg-gray-200"
              >
                Phòng đã đặt
              </Link>
            </div>
          )}
        </div>

        {/* Quản lý người dùng */}
        <Link
          to="/user-management"
          className="w-60 h-60 flex items-center justify-center bg-white shadow-md rounded-lg text-center text-xl font-semibold hover:bg-[#A7C7E7] hover:text-white transition transform hover:scale-105"
        >
          Quản lý người dùng
        </Link>

        {/* Thống kê */}
        <Link
          to="/statistics"
          className="w-60 h-60 flex items-center justify-center bg-white shadow-md rounded-lg text-center text-xl font-semibold hover:bg-[#A7C7E7] hover:text-white transition transform hover:scale-105"
        >
          Thống kê
        </Link>
      </div>
    </div>
  );
};

export default Home;
