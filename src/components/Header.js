import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, ChevronDown, UserCircle } from "lucide-react";

export default function Header() {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/Login");
  };

  return (
    <div className="bg-teal-600 text-white flex justify-between items-center px-6 py-4 shadow-md">
      {/* Logo */}
      <Link to="/Home">
        <img
          src="/logo.jpg"
          alt="Logo"
          className="h-10 cursor-pointer"
        />
      </Link>

      {/* Navigation và Thông tin người dùng */}
      <div className="flex items-center space-x-6">

        {/* BookRoom */}
        <Link to="/BookRoom" className="cursor-pointer hover:underline">
            Đặt Phòng
        </Link>

        {/* Home */}
        <Link to="/Home" className="cursor-pointer hover:underline">
          Trang Chủ
        </Link>

        <Link to="/BookingList" className="cursor-pointer hover:underline"> 
          Booking List
        </Link>
        

        {/* Icon thông báo */}
        <div className="relative cursor-pointer">
          <Bell className="h-6 w-6" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-xs text-white rounded-full px-1">
            6
          </span>
        </div>

        {/* Hồ sơ người dùng + Dropdown */}
        <div className="relative">
        <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {/*biểu tượng UserCircle */}
            <UserCircle className="h-8 w-8" />
            <span>Phùng Văn Vũ</span>
            <ChevronDown className="h-5 w-5" />
          </div>

          {/* Dropdown */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white text-black shadow-md rounded-lg overflow-hidden z-50">
              <Link
                to="/Profile"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Hồ sơ
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
