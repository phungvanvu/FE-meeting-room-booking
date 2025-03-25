import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaUser } from "react-icons/fa";

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation(); // Lấy đường dẫn hiện tại

  return (
    <nav className="bg-blue-500 text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-8">
        {/* Logo - Nhấn vào quay về trang chủ */}
        <NavLink to="/" className="text-2xl font-bold hover:text-gray-300">
          LOGO
        </NavLink>

        {/* Nếu đang ở trang chủ -> Hiện tiêu đề căn giữa */}
        {location.pathname === "/" ? (
          <h1 className="text-xl font-semibold flex-1 text-center">
            Hệ thống booking phòng họp
          </h1>
        ) : (
          // Nếu không phải trang chủ -> Hiện thanh điều hướng
          <div className="flex flex-1 justify-center space-x-8 text-lg">
            {/* Dropdown Quản lý phòng */}
            <div className="relative">
              <button
                className="hover:text-gray-300"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                Quản lý phòng 
              </button>
              {dropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white text-black shadow-lg rounded-md">
                  <NavLink
                    to="/available-rooms"
                    className="block px-4 py-2 hover:bg-blue-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Phòng trống
                  </NavLink>
                  <NavLink
                    to="/booked-rooms"
                    className="block px-4 py-2 hover:bg-blue-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Phòng đã đặt
                  </NavLink>
                </div>
              )}
            </div>

            <NavLink to="/user-management" className="hover:text-gray-300">
              Quản lý người dùng
            </NavLink>
            <NavLink to="/statistics" className="hover:text-gray-300">
              Thống kê
            </NavLink>
          </div>
        )}

        {/* Tài khoản admin & Đăng xuất */}
        <div className="flex items-center space-x-4">
          <FaUser className="text-xl" />
          <span>Admin</span>
          <button className="bg-blue-700 px-3 py-1 rounded hover:bg-red-600">
            Đăng xuất
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;
