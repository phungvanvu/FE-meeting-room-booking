import { NavLink, useLocation } from "react-router-dom";
import { FaUser } from "react-icons/fa";

const Header = () => {
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
            CMC MEETING ROOM
          </h1>
        ) : (
          // Nếu không phải trang chủ -> Hiện thanh điều hướng
          <div className="flex flex-1 justify-end mr-7 space-x-8 text-lg"> {/* Thêm mr-4 để tạo khoảng cách bên phải */}
            <NavLink to="/room-management" className="hover:text-gray-300 text-lg">
              Phòng
            </NavLink>
            <NavLink to="/user-management" className="hover:text-gray-300 text-lg">
              Người dùng
            </NavLink>
            <NavLink to="/statistics" className="hover:text-gray-300 text-lg">
              Thống kê
            </NavLink>
          </div>
        )}

        {/* Tài khoản admin & Đăng xuất */}
        <div className="flex items-center space-x-4">
          <FaUser className="text-xl" />
          <span className="ml-2 text-lg">Admin</span>
          <button className="bg-blue-700 px-3 py-1 rounded hover:bg-red-600 text-lg">
            Đăng xuất
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;