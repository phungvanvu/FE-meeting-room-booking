import React, { useState } from "react";

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedPositions, setSelectedPositions] = useState([]);

  const groups = ["DU3.1", "DKR1", "DJ2"];
  const departments = ["IT", "HR", "Kế toán"];
  const positions = {
    IT: ["Backend", "Frontend", "Tester", "BA", "Designer"],
    HR: ["Tuyển dụng", "Đào tạo", "Hành chính"],
    "Kế toán": ["Kế toán thanh toán", "Kế toán kho", "Kế toán quản trị"],
  };

  const handleSearch = () => {
    console.log("Tìm kiếm với:", { searchTerm, selectedGroups, selectedDepartments, selectedPositions });
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedGroups([]);
    setSelectedDepartments([]);
    setSelectedPositions([]);
  };

  return (
    <div className="flex p-6 mx-auto" style={{ maxWidth: "100%" }}>
      {/* Bộ lọc bên trái */}
      <div className="w-1/4 p-4 border bg-gray-100 rounded-lg mr-4">
        <h3 className="font-bold mb-4">Tìm kiếm</h3>
        
        {/* Text Input */}
        <div className="mb-4">
          <label className="block mb-1">Nhập tên / SĐT:</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>

        {/* Checkbox Nhóm */}
        <div className="mb-4">
          <label className="block mb-1">Nhóm:</label>
          {groups.map((group) => (
            <label key={group} className="flex items-center">
              <input
                type="checkbox"
                value={group}
                checked={selectedGroups.includes(group)}
                onChange={() => {
                  setSelectedGroups((prev) =>
                    prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
                  );
                }}
              />
              <span className="ml-2">{group}</span>
            </label>
          ))}
        </div>

        {/* Checkbox Phòng ban */}
        <div className="mb-4">
          <label className="block mb-1">Phòng ban:</label>
          {departments.map((department) => (
            <div key={department}>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  value={department}
                  checked={selectedDepartments.includes(department)}
                  onChange={() => {
                    setSelectedDepartments((prev) =>
                      prev.includes(department) ? prev.filter((d) => d !== department) : [...prev, department]
                    );
                  }}
                />
                <span className="ml-2">{department}</span>
              </label>
              {selectedDepartments.includes(department) && (
                <div className="ml-4">
                  {positions[department].map((position) => (
                    <label key={position} className="flex items-center">
                      <input
                        type="checkbox"
                        value={position}
                        checked={selectedPositions.includes(position)}
                        onChange={() => {
                          setSelectedPositions((prev) =>
                            prev.includes(position) ? prev.filter((p) => p !== position) : [...prev, position]
                          );
                        }}
                      />
                      <span className="ml-2">{position}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Nút Tìm kiếm và Đặt lại */}
        <div className="flex justify-between mb-4">
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white rounded py-2 px-4 hover:bg-blue-400 transition w-1/2 mr-1"
          >
            Tìm kiếm
          </button>
          <button
            onClick={resetFilters}
            className="bg-gray-300 text-black rounded py-2 px-4 hover:bg-gray-200 transition w-1/2 ml-1"
          >
            Đặt lại
          </button>
        </div>
      </div>

      {/* Bảng hiển thị danh sách người dùng */}
      <div className="w-3/4 overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-center text-3xl font-bold flex-grow">Danh sách người dùng</h2>
          <div>
            <button className="bg-green-500 text-white rounded py-2 px-4 hover:bg-green-400 transition mr-2">
              Thêm
            </button>
            <button className="bg-yellow-500 text-white rounded py-2 px-4 hover:bg-yellow-400 transition">
              Excel
            </button>
          </div>
        </div>

        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border">Tên</th>
              <th className="py-2 px-4 border">Username</th>
              <th className="py-2 px-4 border">Email</th>
              <th className="py-2 px-4 border">SĐT</th>
              <th className="py-2 px-4 border">Nhóm</th>
              <th className="py-2 px-4 border">Phòng ban</th>
              <th className="py-2 px-4 border">Vị trí</th>
              <th className="py-2 px-4 border">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {/* Dữ liệu người dùng mẫu */}
            {Array.from({ length: 10 }).map((_, index) => (
              <tr key={index} className="border-b hover:bg-gray-100 transition">
                <td className="py-2 px-4 border">Người dùng {index + 1}</td>
                <td className="py-2 px-4 border">username{index + 1}</td>
                <td className="py-2 px-4 border">email{index + 1}@example.com</td>
                <td className="py-2 px-4 border">0123456789</td>
                <td className="py-2 px-4 border">DU3.1</td>
                <td className="py-2 px-4 border">IT</td>
                <td className="py-2 px-4 border">Backend</td>
                <td className="py-2 px-4 border">
                  <button className="text-blue-500 hover:text-blue-700 transition">Sửa</button>
                  <button className="text-red-500 hover:text-red-700 transition ml-2">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;