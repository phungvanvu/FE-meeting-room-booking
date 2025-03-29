import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const UserManagement = () => {
  const navigate = useNavigate();

  // State dữ liệu người dùng từ API
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  // State cho bộ lọc
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);

  // State cho foreign key (role, position, group)
  const [roleOptions, setRoleOptions] = useState([]);
  const [positionOptions, setPositionOptions] = useState([]);
  const [groupOptions, setGroupOptions] = useState([]);

  // State cho form và xác nhận xóa
  const [showForm, setShowForm] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  // State cho dữ liệu form
  const [formData, setFormData] = useState({
    userName: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    department: '',
    group: '',
    password: '',
    position: '',
    roles: [],
  });

  // State phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // Hàm helper để lấy headers với accessToken
  const getAuthHeaders = () => {
    const accessToken = sessionStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      Authorization: accessToken ? `Bearer ${accessToken}` : '',
    };
  };

  // Lấy danh sách người dùng từ API
  const fetchUsers = () => {
    fetch(`${API_BASE_URL}/user`, {
      headers: getAuthHeaders(),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUsers(data.data);
        } else {
          console.error('Error fetching users:', data.error);
        }
      })
      .catch((err) => console.error(err));
  };

  // Lấy danh sách foreign key từ API
  const fetchForeignData = () => {
    // Roles
    fetch(`${API_BASE_URL}/role`, { headers: getAuthHeaders() })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setRoleOptions(data.data);
        } else {
          console.error('Error fetching roles:', data.error);
        }
      })
      .catch((err) => console.error(err));
    // Positions
    fetch(`${API_BASE_URL}/position`, { headers: getAuthHeaders() })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPositionOptions(data.data);
        } else {
          console.error('Error fetching positions:', data.error);
        }
      })
      .catch((err) => console.error(err));
    // Groups
    fetch(`${API_BASE_URL}/group`, { headers: getAuthHeaders() })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setGroupOptions(data.data);
        } else {
          console.error('Error fetching groups:', data.error);
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchUsers();
    fetchForeignData();
  }, []);

  // Khi danh sách users thay đổi, cập nhật filteredUsers
  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  // Hàm lọc người dùng theo search term, nhóm, phòng ban, và vai trò
  const handleSearch = useCallback(() => {
    const filtered = users.filter((user) => {
      const matchesSearchTerm =
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phoneNumber.includes(searchTerm);
      const matchesGroup =
        selectedGroups.length === 0 || selectedGroups.includes(user.groupName);
      const matchesDepartment =
        selectedDepartments.length === 0 ||
        selectedDepartments.includes(user.department);
      const matchesRole =
        selectedRoles.length === 0 ||
        selectedRoles.some((r) => user.roles.includes(r));
      return (
        matchesSearchTerm && matchesGroup && matchesDepartment && matchesRole
      );
    });
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedGroups, selectedDepartments, selectedRoles, users]);

  // Reset bộ lọc
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedGroups([]);
    setSelectedDepartments([]);
    setSelectedRoles([]);
    setFilteredUsers(users);
    setCurrentPage(1);
  };

  const navigateToGroupManagement = () => {
    navigate('/group-management');
  };

  // Xử lý thêm người dùng: reset form và mở form
  const handleAddUser = () => {
    setCurrentUser(null);
    setFormData({
      userName: '',
      fullName: '',
      email: '',
      phoneNumber: '',
      department: '',
      group: '',
      password: '',
      position: '',
      roles: [],
    });
    setShowForm(true);
  };

  // Xử lý sửa người dùng: điền dữ liệu hiện có vào form
  const handleEditUser = (user) => {
    setCurrentUser(user);
    setFormData({
      userName: user.userName,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      department: user.department,
      group: user.groupName,
      password: '', // Để trống nếu không đổi password
      position: user.positionName || '',
      roles: user.roles,
    });
    setShowForm(true);
  };

  // Lưu người dùng (thêm hoặc sửa)
  const saveUser = () => {
    if (currentUser) {
      // Sửa: chuẩn bị body, chỉ gửi password nếu có giá trị
      const updateBody = {
        userName: formData.userName,
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        department: formData.department,
        group: formData.group,
        position: formData.position,
        roles: formData.roles,
        enabled: true,
      };
      if (formData.password.trim() !== '') {
        updateBody.password = formData.password;
      }
      fetch(`${API_BASE_URL}/user/${currentUser.userId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updateBody),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            fetchUsers();
          } else {
            console.error('Error updating user', data.error);
          }
        })
        .catch((err) => console.error(err));
    } else {
      // Thêm: gọi POST (luôn gửi password)
      fetch(`${API_BASE_URL}/user`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          userName: formData.userName,
          fullName: formData.fullName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          department: formData.department,
          group: formData.group,
          password: formData.password,
          position: formData.position,
          roles: formData.roles,
          enabled: true,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            fetchUsers();
          } else {
            console.error('Error adding user', data.error);
          }
        })
        .catch((err) => console.error(err));
    }
    setShowForm(false);
  };

  // Xử lý khi muốn xóa người dùng: lưu lại user hiện hành và mở dialog xác nhận
  const handleDeleteUser = (user) => {
    setCurrentUser(user);
    setShowConfirmDelete(true);
  };

  // Xác nhận xóa người dùng
  const confirmDelete = () => {
    if (currentUser) {
      fetch(`${API_BASE_URL}/user/${currentUser.userId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            fetchUsers();
          } else {
            console.error('Error deleting user', data.error);
          }
        })
        .catch((err) => console.error(err));
    }
    setShowConfirmDelete(false);
  };

  const cancelDelete = () => {
    setShowConfirmDelete(false);
  };

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  // Phân trang
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = filteredUsers.slice(
    startIndex,
    startIndex + usersPerPage,
  );

  // Xử lý thay đổi input form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Hàm xuất Excel
  const exportToExcel = () => {
    fetch(`${API_BASE_URL}/statistical/export-user-excel`, {
      headers: getAuthHeaders(),
      method: 'GET',
    })
      .then((res) => res.blob())
      .then((blob) => {
        // Tạo URL object từ blob và tạo một thẻ a để tải file về
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'users.xlsx'; // Đặt tên file khi tải xuống
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch((err) => console.error('Error exporting Excel:', err));
  };

  // Tính toán danh sách phòng ban duy nhất từ users
  const departmentOptions = React.useMemo(() => {
    const departments = new Set();
    users.forEach((user) => {
      if (user.department) {
        departments.add(user.department);
      }
    });
    return Array.from(departments);
  }, [users]);

  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <div className='flex-grow flex'>
        {/* Bộ lọc bên trái */}
        <div
          className='w-1/4 p-4 border bg-gray-100 rounded-lg mr-4 sticky top-0'
          style={{ height: 'calc(88vh - 100px)' }}
        >
          <h3 className='font-bold mb-4'>Tìm kiếm</h3>
          <div className='mb-4'>
            <label className='block mb-1 font-bold'>Nhập tên / SĐT:</label>
            <input
              type='text'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='border border-gray-300 rounded p-2 w-full'
            />
          </div>
          {/* Checkbox Nhóm */}
          <div className='mb-4'>
            <label className='block mb-1 flex items-center justify-between font-bold'>
              Nhóm
              <button
                onClick={navigateToGroupManagement}
                className='text-blue-500'
              >
                Edit
              </button>
            </label>
            {groupOptions.map((group) => (
              <label key={group.groupName} className='flex items-center ml-2'>
                <input
                  type='checkbox'
                  value={group.groupName}
                  checked={selectedGroups.includes(group.groupName)}
                  onChange={() => {
                    setSelectedGroups((prev) =>
                      prev.includes(group.groupName)
                        ? prev.filter((g) => g !== group.groupName)
                        : [...prev, group.groupName],
                    );
                  }}
                />
                <span className='ml-2'>{group.groupName}</span>
              </label>
            ))}
          </div>
          {/* Checkbox Phòng ban */}
          <div className='mb-4'>
            <label className='block mb-1 flex items-center justify-between font-bold'>
              Phòng ban
            </label>
            {departmentOptions.map((dept) => (
              <label key={dept} className='flex items-center ml-2'>
                <input
                  type='checkbox'
                  value={dept}
                  checked={selectedDepartments.includes(dept)}
                  onChange={() => {
                    setSelectedDepartments((prev) =>
                      prev.includes(dept)
                        ? prev.filter((d) => d !== dept)
                        : [...prev, dept],
                    );
                  }}
                />
                <span className='ml-2'>{dept}</span>
              </label>
            ))}
          </div>

          {/* Checkbox Vai trò */}
          <div className='mb-4'>
            <label className='block mb-1 font-bold'>Vai trò</label>
            <div className='flex space-x-4'>
              {roleOptions.map((role) => (
                <label key={role.roleName} className='flex items-center'>
                  <input
                    type='checkbox'
                    value={role.roleName}
                    checked={selectedRoles.includes(role.roleName)}
                    onChange={() => {
                      setSelectedRoles((prev) =>
                        prev.includes(role.roleName)
                          ? prev.filter((r) => r !== role.roleName)
                          : [...prev, role.roleName],
                      );
                    }}
                  />
                  <span className='ml-2'>{role.roleName}</span>
                </label>
              ))}
            </div>
          </div>
          {/* Nút Tìm kiếm và Đặt lại */}
          <div className='flex'>
            <button
              onClick={handleSearch}
              className='bg-blue-500 text-white rounded py-2 px-4 hover:bg-blue-400 transition w-full mr-1'
            >
              Tìm kiếm
            </button>
            <button
              onClick={resetFilters}
              className='bg-gray-300 text-black rounded py-2 px-4 hover:bg-gray-200 transition w-full ml-1'
            >
              Đặt lại
            </button>
          </div>
        </div>

        {/* Bảng hiển thị danh sách người dùng */}
        <div className='w-3/4 overflow-x-auto'>
          <div className='flex justify-between mb-4'>
            <h2 className='text-center text-2xl font-bold'>
              Danh sách người dùng
            </h2>
            <div>
              <button
                onClick={handleAddUser}
                className='border border-blue-700 text-blue-700 rounded py-2 px-4 hover:bg-blue-700 hover:text-white transition mr-2'
              >
                Thêm
              </button>
              <button
                onClick={exportToExcel}
                className='bg-white border border-yellow-500 text-yellow-500 rounded py-2 px-4 hover:bg-yellow-500 hover:text-white transition'
              >
                Excel
              </button>
            </div>
          </div>

          <table className='min-w-full bg-white border border-gray-300'>
            <thead>
              <tr className='bg-gray-200'>
                <th className='py-2 px-4 border'>STT</th>
                <th className='py-2 px-4 border'>Tên</th>
                <th className='py-2 px-4 border'>Username</th>
                <th className='py-2 px-4 border'>Email</th>
                <th className='py-2 px-4 border'>SĐT</th>
                <th className='py-2 px-4 border'>Nhóm</th>
                <th className='py-2 px-4 border'>Vị Trí</th>
                <th className='py-2 px-4 border'>Phòng ban</th>
                <th className='py-2 px-4 border'>Vai trò</th>
                <th className='py-2 px-4 border'>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user, index) => (
                <tr
                  key={user.userId}
                  className='border-b hover:bg-gray-100 transition'
                >
                  <td className='py-2 px-4 border'>{startIndex + index + 1}</td>
                  <td className='py-2 px-4 border'>{user.fullName}</td>
                  <td className='py-2 px-4 border'>{user.userName}</td>
                  <td className='py-2 px-4 border'>{user.email}</td>
                  <td className='py-2 px-4 border'>{user.phoneNumber}</td>
                  <td className='py-2 px-4 border'>{user.groupName}</td>
                  <td className='py-2 px-4 border'>{user.positionName}</td>
                  <td className='py-2 px-4 border'>{user.department}</td>
                  <td className='py-2 px-4 border'>{user.roles.join(', ')}</td>
                  <td className='py-2 px-4 border text-center'>
                    <button
                      onClick={() => handleEditUser(user)}
                      className='text-blue-500 hover:text-blue-700 transition'
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user)}
                      className='text-red-500 hover:text-red-700 transition ml-2'
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Phân trang */}
          <div className='flex justify-center items-center mt-4'>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className='border border-gray-300 text-gray-700 rounded py-2 px-4 hover:bg-gray-200 transition'
            >
              &laquo;
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`border border-gray-300 text-gray-700 py-2 px-4 transition mx-1 ${
                  currentPage === index + 1
                    ? 'bg-blue-700 text-white'
                    : 'hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className='border border-gray-300 text-gray-700 rounded py-2 px-4 hover:bg-gray-200 transition'
            >
              &raquo;
            </button>
          </div>
        </div>
      </div>

      {/* Form thêm/sửa người dùng */}
      {showForm && (
        <div className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-30'>
          <div
            className='bg-white p-6 rounded-lg shadow-lg'
            style={{ width: '600px' }}
          >
            <h2 className='text-xl font-bold mb-4'>
              {currentUser ? 'Sửa người dùng' : 'Thêm người dùng'}
            </h2>
            <div className='grid grid-cols-2 gap-4'>
              <div className='mb-0'>
                <label className='block mb-1'>Tên:</label>
                <input
                  type='text'
                  name='fullName'
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className='border rounded w-full p-2'
                />
              </div>
              <div className='mb-4'>
                <label className='block mb-1'>Username:</label>
                <input
                  type='text'
                  name='userName'
                  value={formData.userName}
                  onChange={handleInputChange}
                  className='border rounded w-full p-2'
                />
              </div>
              <div className='mb-4'>
                <label className='block mb-1'>Email:</label>
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  className='border rounded w-full p-2'
                />
              </div>
              <div className='mb-4'>
                <label className='block mb-1'>SĐT:</label>
                <input
                  type='text'
                  name='phoneNumber'
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className='border rounded w-full p-2'
                />
              </div>
              <div className='mb-4'>
                <label className='block mb-1 flex items-center justify-between'>
                  Nhóm
                  <button
                    onClick={() => navigate('/group-management')}
                    className='text-blue-500'
                  >
                    Edit
                  </button>
                </label>
                <select
                  name='group'
                  value={formData.group}
                  onChange={handleInputChange}
                  className='border rounded w-full p-2'
                >
                  <option value=''>Chọn nhóm</option>
                  {groupOptions.map((group) => (
                    <option key={group.groupName} value={group.groupName}>
                      {group.groupName}
                    </option>
                  ))}
                </select>
              </div>
              <div className='mb-4'>
                <label className='block mb-1'>Phòng ban:</label>
                <input
                  type='text'
                  name='department'
                  value={formData.department}
                  onChange={handleInputChange}
                  placeholder='Software Development'
                  className='border rounded w-full p-2'
                />
              </div>
              <div className='mb-4'>
                <label className='block mb-1'>Vị trí:</label>
                <select
                  name='position'
                  value={formData.position}
                  onChange={handleInputChange}
                  className='border rounded w-full p-2'
                >
                  <option value=''>Chọn vị trí</option>
                  {positionOptions.map((pos) => (
                    <option key={pos.positionName} value={pos.positionName}>
                      {pos.positionName}
                    </option>
                  ))}
                </select>
              </div>
              <div className='mb-4'>
                <label className='block mb-1'>Password:</label>
                <input
                  type='password'
                  name='password'
                  value={formData.password}
                  onChange={handleInputChange}
                  className='border rounded w-full p-2'
                />
              </div>
              {/* Phần chọn nhiều vai trò */}
              <div className='mb-4 col-span-2'>
                <label className='block text-sm font-bold text-black-700 mb-2'>
                  Vai trò:
                </label>
                <div className='flex flex-wrap gap-2'>
                  {roleOptions.map((role) => (
                    <button
                      key={role.roleName}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          roles: prev.roles.includes(role.roleName)
                            ? prev.roles.filter((r) => r !== role.roleName)
                            : [...prev.roles, role.roleName],
                        }))
                      }
                      className={`px-3 py-1 rounded-full text-sm border transition-all ${
                        formData.roles.includes(role.roleName)
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {role.roleName}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className='flex justify-end mt-4'>
              <button
                onClick={saveUser}
                className='border border-blue-700 text-blue-700 rounded py-2 px-4 hover:bg-blue-700 hover:text-white transition mr-2'
              >
                Lưu
              </button>
              <button
                onClick={() => setShowForm(false)}
                className='border border-gray-300 text-black rounded py-2 px-4 hover:bg-gray-200 transition'
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm delete dialog */}
      {showConfirmDelete && (
        <div className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg'>
            <h2 className='text-lg font-bold mb-4'>Xác nhận xóa</h2>
            <p>Bạn có chắc chắn muốn xóa người dùng này?</p>
            <div className='flex justify-end mt-4'>
              <button
                onClick={confirmDelete}
                className='border border-red-500 text-red-500 rounded py-2 px-4 hover:bg-red-500 hover:text-white transition mr-2'
              >
                Xóa
              </button>
              <button
                onClick={cancelDelete}
                className='border border-gray-300 text-black rounded py-2 px-4 hover:bg-gray-200 transition'
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default UserManagement;
