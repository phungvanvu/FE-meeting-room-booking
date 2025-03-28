import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const UserManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  
  // Thêm các trạng thái cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10; // Số người dùng trên mỗi trang

  const groups = ["DU3.1", "DKR1", "DJ2"];
  const departments = ["IT", "HR", "Kế toán"];
  const roles = ["Admin", "User"];

  const users = useMemo(() => [
    { name: "Nguyễn Văn A", username: "nguyenvana", email: "nguyenvana@example.com", phone: "0123456789", group: "DU3.1", department: "IT", role: "Admin" },
    { name: "Trần Thị B", username: "tranthib", email: "tranthib@example.com", phone: "0987654321", group: "DKR1", department: "HR", role: "User" },
    { name: "Lê Văn C", username: "levanc", email: "levanc@example.com", phone: "0123456789", group: "DJ2", department: "Kế toán", role: "User" },
    { name: "Phạm Thị D", username: "phamthid", email: "phamthid@example.com", phone: "0987654321", group: "DU3.1", department: "IT", role: "Admin" },
    { name: "Hoàng Văn E", username: "hoangvane", email: "hoangvane@example.com", phone: "0123456789", group: "DKR1", department: "HR", role: "User" },
    { name: "Vũ Thị F", username: "vuthif", email: "vuthif@example.com", phone: "0987654321", group: "DJ2", department: "Kế toán", role: "Admin" },
    { name: "Đỗ Văn G", username: "dovang", email: "dovang@example.com", phone: "0123456789", group: "DU3.1", department: "IT", role: "User" },
    { name: "Ngô Thị H", username: "ngothih", email: "ngothih@example.com", phone: "0987654321", group: "DKR1", department: "HR", role: "Admin" },
    { name: "Bùi Văn I", username: "buivani", email: "buivani@example.com", phone: "0123456789", group: "DJ2", department: "Kế toán", role: "User" },
    { name: "Phan Thị J", username: "phanthij", email: "phanthij@example.com", phone: "0987654321", group: "DU3.1", department: "IT", role: "Admin" }
  ], []);

  const handleSearch = useCallback(() => {
    const filtered = users.filter(user => {
      const matchesSearchTerm = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.username.toLowerCase().includes(searchTerm.toLowerCase()) || user.phone.includes(searchTerm);
      const matchesGroup = selectedGroups.length === 0 || selectedGroups.includes(user.group);
      const matchesDepartment = selectedDepartments.length === 0 || selectedDepartments.includes(user.department);
      const matchesRole = selectedRoles.length === 0 || selectedRoles.includes(user.role);
      return matchesSearchTerm && matchesGroup && matchesDepartment && matchesRole;
    });
    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page on new search
  }, [searchTerm, selectedGroups, selectedDepartments, selectedRoles, users]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedGroups([]);
    setSelectedDepartments([]);
    setSelectedRoles([]);
    setFilteredUsers(users);
    setCurrentPage(1); // Reset to first page
  };

  const navigateToGroupManagement = () => {
    navigate("/group-management");
  };

  const handleAddUser = () => {
    setCurrentUser(null);
    setShowForm(true);
  };

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setShowForm(true);
  };

  const handleDeleteUser = () => {
    // Logic to delete user
    setShowConfirmDelete(false);
  };

  const confirmDelete = () => {
    // Logic to delete user
    setShowConfirmDelete(false);
  };

  const cancelDelete = () => {
    setShowConfirmDelete(false);
  };

  const saveUser = () => {
    // Logic to save user (add or edit)
    setShowForm(false);
  };

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);


// Tính toán số trang
const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
const startIndex = (currentPage - 1) * usersPerPage;
const currentUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);

  return (
    <div className="flex flex-col min-h-screen p-6 max-w-1xl mx-auto space-y-6">
      <div className="flex-grow flex">
        {/* Bộ lọc bên trái */}
        <div className="w-1/4 p-4 border bg-gray-100 rounded-lg mr-4 sticky top-0" style={{ height: 'calc(88vh - 100px)' }}>
          <h3 className="font-bold mb-4">Tìm kiếm</h3>

          {/* Text Input */}
          <div className="mb-4">
            <label className="block mb-1 font-bold">Nhập tên / SĐT:</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
            />
          </div>

          {/* Checkbox Nhóm */}
          <div className="mb-4">
            <label className="block mb-1 flex items-center justify-between font-bold">
              Nhóm
              <button onClick={navigateToGroupManagement} className="text-blue-500">
                Edit
              </button>
            </label>
            {groups.map((group) => (
              <label key={group} className="flex items-center ml-2">
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
            <label className="block mb-1 flex items-center justify-between font-bold">
              Phòng ban
            </label>
            {departments.map((department) => (
              <label key={department} className="flex items-center ml-2">
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
            ))}
          </div>

          {/* Checkbox Role */}
          <div className="mb-4">
            <label className="block mb-1 font-bold">Vai trò</label>
            <div className="flex space-x-4">
              {roles.map((role) => (
                <label key={role} className="flex items-center">
                  <input
                    type="checkbox"
                    value={role}
                    checked={selectedRoles.includes(role)}
                    onChange={() => {
                      setSelectedRoles((prev) =>
                        prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
                      );
                    }}
                  />
                  <span className="ml-2">{role}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Nút Tìm kiếm và Đặt lại */}
          <div className="flex">
            <button
              onClick={handleSearch}
              className="bg-blue-500 text-white rounded py-2 px-4 hover:bg-blue-400 transition w-full mr-1"
            >
              Tìm kiếm
            </button>
            <button
              onClick={resetFilters}
              className="bg-gray-300 text-black rounded py-2 px-4 hover:bg-gray-200 transition w-full ml-1"
            >
              Đặt lại
            </button>
          </div>
        </div>

        {/* Bảng hiển thị danh sách người dùng */}
        <div className="w-3/4 overflow-x-auto">
          <div className="flex justify-between mb-4">
            <h2 className="text-center text-2xl font-bold">Danh sách người dùng</h2>
            <div>
              <button 
                onClick={handleAddUser} 
                className="border border-blue-700 text-blue-700 rounded py-2 px-4 hover:bg-blue-700 hover:text-white transition mr-2">
                Thêm
              </button>
              <button className="bg-white border border-yellow-500 text-yellow-500 rounded py-2 px-4 hover:bg-yellow-500 hover:text-white transition">
                Excel
              </button>
            </div>
          </div>

          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 border">STT</th>
                <th className="py-2 px-4 border">Tên</th>
                <th className="py-2 px-4 border">Username</th>
                <th className="py-2 px-4 border">Email</th>
                <th className="py-2 px-4 border">SĐT</th>
                <th className="py-2 px-4 border">Nhóm</th>
                <th className="py-2 px-4 border">Phòng ban</th>
                <th className="py-2 px-4 border">Vai trò</th>
                <th className="py-2 px-4 border">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user, index) => (
                <tr key={index} className="border-b hover:bg-gray-100 transition">
                  <td className="py-2 px-4 border">{startIndex + index + 1}</td>
                  <td className="py-2 px-4 border">{user.name}</td>
                  <td className="py-2 px-4 border">{user.username}</td>
                  <td className="py-2 px-4 border">{user.email}</td>
                  <td className="py-2 px-4 border">{user.phone}</td>
                  <td className="py-2 px-4 border">{user.group}</td>
                  <td className="py-2 px-4 border">{user.department}</td>
                  <td className="py-2 px-4 border">{user.role}</td>
                  <td className="py-2 px-4 border text-center">
                    <button 
                      onClick={() => handleEditUser(user)} 
                      className="text-blue-500 hover:text-blue-700 transition">Sửa</button>
                    <button 
                      onClick={() => setShowConfirmDelete(true)} 
                      className="text-red-500 hover:text-red-700 transition ml-2">Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

       
{/* Phân trang */}
<div className="flex justify-center items-center mt-4">
  <button 
    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
    disabled={currentPage === 1}
    className="border border-gray-300 text-gray-700 rounded py-2 px-4 hover:bg-gray-200 transition"
  >
    &laquo; {/* Mũi tên lùi */}
  </button>

  {/* Hiển thị các nút trang */}
  {[...Array(totalPages)].map((_, index) => (
    <button 
      key={index} 
      onClick={() => setCurrentPage(index + 1)} 
      className={`border border-gray-300 text-gray-700 py-2 px-4 transition mx-1 ${currentPage === index + 1 ? 'bg-blue-700 text-white' : 'hover:bg-gray-200'}`}
    >
      {index + 1}
    </button>
  ))}

  <button 
    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
    disabled={currentPage === totalPages}
    className="border border-gray-300 text-gray-700 rounded py-2 px-4 hover:bg-gray-200 transition"
  >
    &raquo; {/* Mũi tên tiến */}
  </button>
</div>
        </div>
      </div>

      {/* Form thêm/sửa người dùng */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-30">
          <div className="bg-white p-6 rounded-lg shadow-lg" style={{ width: '600px' }}>
            <h2 className="text-xl font-bold mb-4">{currentUser ? "Sửa người dùng" : "Thêm người dùng"}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-0">
                <label className="block mb-1">Tên:</label>
                <input type="text" defaultValue={currentUser ? currentUser.name : ""} className="border rounded w-full p-2" />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Username:</label>
                <input type="text" defaultValue={currentUser ? currentUser.username : ""} className="border rounded w-full p-2" />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Email:</label>
                <input type="email" defaultValue={currentUser ? currentUser.email : ""} className="border rounded w-full p-2" />
              </div>
              <div className="mb-4">
                <label className="block mb-1">SĐT:</label>
                <input type="text" defaultValue={currentUser ? currentUser.phone : ""} className="border rounded w-full p-2" />
              </div>
              <div className="mb-4">
                <label className="block mb-1 flex items-center justify-between">
                  Nhóm
                  <button onClick={() => navigate("/group-management")} className="text-blue-500">
                    Edit
                  </button>
                </label>
                <select className="border rounded w-full p-2">
                  {groups.map(group => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-1 flex items-center justify-between">
                  Phòng ban
                </label>
                <select className="border rounded w-full p-2">
                  {departments.map(department => (
                    <option key={department} value={department}>{department}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-1">Vai trò:</label>
                <select className="border rounded w-full p-2">
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button 
                onClick={saveUser} 
                className="border border-blue-700 text-blue-700 rounded py-2 px-4 hover:bg-blue-700 hover:text-white transition mr-2">
                Lưu
              </button>
              <button 
                onClick={() => setShowForm(false)} 
                className="border border-gray-300 text-black rounded py-2 px-4 hover:bg-gray-200 transition">
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm delete dialog */}
      {showConfirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">Xác nhận xóa</h2>
            <p>Bạn có chắc chắn muốn xóa người dùng này?</p>
            <div className="flex justify-end mt-4">
              <button 
                onClick={confirmDelete} 
                className="border border-red-500 text-red-500 rounded py-2 px-4 hover:bg-red-500 hover:text-white transition mr-2">
                Xóa
              </button>
              <button 
                onClick={cancelDelete} 
                className="border border-gray-300 text-black rounded py-2 px-4 hover:bg-gray-200 transition">
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;