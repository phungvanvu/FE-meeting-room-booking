import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

  const [errorMessage, setErrorMessage] = useState('');

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

  // Hàm lọc người dùng theo search term, nhóm, phòng ban và vai trò
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
      password: '', // Để trống nếu không muốn đổi password
      position: user.positionName || '',
      roles: user.roles,
    });
    setShowForm(true);
  };

  // Lưu người dùng (thêm hoặc sửa)
  // Lưu người dùng (thêm hoặc sửa)
  const saveUser = () => {
    if (currentUser) {
      // Sửa: chỉ gửi password nếu có giá trị
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
            setShowForm(false);
          } else {
            // Hiển thị thông báo lỗi từ API
            setErrorMessage(
              data.error?.message || 'Có lỗi xảy ra khi cập nhật người dùng',
            );
          }
        })
        .catch((err) => {
          console.error(err);
          setErrorMessage(err.message || 'Lỗi kết nối đến server.');
        });
    } else {
      // Thêm: gọi POST
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
            setShowForm(false);
          } else {
            // Hiển thị thông báo lỗi từ API
            setErrorMessage(
              data.error?.message || 'Có lỗi xảy ra khi thêm người dùng',
            );
          }
        })
        .catch((err) => {
          console.error(err);
          setErrorMessage(err.message || 'Lỗi kết nối đến server.');
        });
    }
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
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'users.xlsx';
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
    <div className='min-h-screen flex flex-col bg-gray-50'>
      <Header />
      <div className='flex-grow mx-auto mt-10 flex gap-4 mb-10 px-6 w-full'>
        {/* Bộ lọc - Sidebar */}
        <div className='w-1/5 bg-white p-6 rounded-2xl shadow-md border border-gray-200 flex flex-col max-h-[calc(100vh-120px)] overflow-y-auto'>
          <h2 className='text-xl font-semibold mb-5 text-gray-800'>Filter</h2>
          {/* Tìm kiếm theo tên/số điện thoại */}
          <div className='mb-4'>
            <label className='block text-sm font-bold text-gray-700 mb-2'>
              Nhập tên / SĐT
            </label>
            <input
              type='text'
              placeholder='Nhập tên hoặc số điện thoại...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full border border-gray-300 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-gray-50 hover:bg-gray-100 transition-all shadow-sm'
            />
          </div>
          {/* Checkbox Nhóm */}
          <div className='mb-4'>
            <label className='block text-sm font-bold text-gray-700 mb-2'>
              Nhóm
            </label>
            <div className='border border-gray-300 rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition-all'>
              {groupOptions.map((group) => (
                <label
                  key={group.groupName}
                  className='flex items-center space-x-2 py-1 cursor-pointer'
                >
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
                    className='h-4 w-4 border-gray-300 rounded text-blue-500 focus:ring-blue-400'
                  />
                  <span className='text-sm text-gray-700'>
                    {group.groupName}
                  </span>
                </label>
              ))}
            </div>
          </div>
          {/* Checkbox Phòng ban */}
          <div className='mb-4'>
            <label className='block text-sm font-bold text-gray-700 mb-2'>
              Phòng ban
            </label>
            <div className='border border-gray-300 rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition-all'>
              {departmentOptions.map((dept) => (
                <label
                  key={dept}
                  className='flex items-center space-x-2 cursor-pointer py-1'
                >
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
                    className='h-4 w-4 border-gray-300 rounded text-blue-500 focus:ring-blue-400'
                  />
                  <span className='text-sm text-gray-700'>{dept}</span>
                </label>
              ))}
            </div>
          </div>
          {/* Vai trò */}
          <div className='mb-4'>
            <label className='block text-sm font-bold text-gray-700 mb-2'>
              Vai trò
            </label>
            <div className='flex flex-wrap gap-2'>
              {roleOptions.map((role) => (
                <button
                  key={role.roleName}
                  onClick={() =>
                    setSelectedRoles((prev) =>
                      prev.includes(role.roleName)
                        ? prev.filter((r) => r !== role.roleName)
                        : [...prev, role.roleName],
                    )
                  }
                  className={`px-3 py-1 rounded-full text-sm border transition-all ${
                    selectedRoles.includes(role.roleName)
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {role.roleName}
                </button>
              ))}
            </div>
          </div>

          {/* Nút Reset & Search */}
          <div className='flex justify-between mt-auto pt-4 border-t border-gray-200'>
            <button
              onClick={resetFilters}
              className='w-1/2 mr-2 py-2 bg-gray-100 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-200 transition-all'
            >
              Reset
            </button>
            <button
              onClick={handleSearch}
              className='w-1/2 ml-2 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all'
            >
              Search
            </button>
          </div>
        </div>

        {/* Bảng danh sách người dùng */}
        <div className='w-4/5'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-2xl font-bold text-gray-800'>
              Danh sách người dùng
            </h2>
            <div className='flex gap-3'>
              <button
                onClick={handleAddUser}
                className='border border-blue-700 text-blue-700 rounded py-2 px-4 hover:bg-blue-700 hover:text-white transition'
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

          <div className='overflow-x-auto bg-white rounded-xl shadow-md'>
            <table className='min-w-full table-fixed'>
              <thead className='bg-gray-200'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider break-words'>
                    STT
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider break-words'>
                    Tên
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider break-words'>
                    Username
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider break-words'>
                    Email
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider break-words'>
                    SĐT
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider break-words'>
                    Nhóm
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider break-words'>
                    Vị Trí
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider break-words'>
                    Phòng ban
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider break-words'>
                    Vai trò
                  </th>
                  <th className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider break-words'>
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {currentUsers.map((user, index) => (
                  <tr key={user.userId} className='hover:bg-gray-50 transition'>
                    <td className='px-6 py-4 whitespace-normal break-words'>
                      {startIndex + index + 1}
                    </td>
                    <td className='px-6 py-4 whitespace-normal break-words font-medium text-gray-900'>
                      {user.fullName}
                    </td>
                    <td className='px-6 py-4 whitespace-normal break-words'>
                      {user.userName}
                    </td>
                    <td className='px-6 py-4 whitespace-normal break-words'>
                      {user.email}
                    </td>
                    <td className='px-6 py-4 whitespace-normal break-words'>
                      {user.phoneNumber}
                    </td>
                    <td className='px-6 py-4 whitespace-normal break-words'>
                      {user.groupName}
                    </td>
                    <td className='px-6 py-4 whitespace-normal break-words'>
                      {user.positionName}
                    </td>
                    <td className='px-6 py-4 whitespace-normal break-words'>
                      {user.department}
                    </td>
                    <td className='px-6 py-4 whitespace-normal break-words'>
                      <div className='flex flex-wrap gap-1'>
                        {user.roles.map((role, idx) => (
                          <span
                            key={idx}
                            className='px-2 py-1 bg-blue-100 text-blue-600 text-xs font-semibold rounded-full break-words'
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-normal break-words text-center'>
                      <button
                        onClick={() => handleEditUser(user)}
                        className='text-blue-500 hover:text-blue-700 transition mr-2 text-sm font-medium'
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user)}
                        className='text-red-500 hover:text-red-700 transition text-sm font-medium'
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Phân trang */}
          {totalPages > 1 && (
            <div className='flex justify-center items-center mt-8 gap-2'>
              {/* Nút chuyển trang trước */}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${
                  currentPage === 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                <ChevronLeft size={18} />
              </button>

              {/* Các số trang */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full font-medium transition-all ${
                      currentPage === page
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-blue-100'
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}

              {/* Nút chuyển trang sau */}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${
                  currentPage === totalPages
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <div className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50'>
          <div className='bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4'>
            <div className='border-b px-6 py-4'>
              <h2 className='text-2xl font-bold text-gray-800'>
                {currentUser ? 'Sửa người dùng' : 'Thêm người dùng'}
                {/* thông báo lỗi*/}
                {errorMessage && (
                  <div className='mt-3 p-3 bg-red-100 text-red-700 rounded text-sm text-center'>
                    {errorMessage}
                  </div>
                )}
              </h2>
            </div>
            <form
              className='px-6 py-4'
              onSubmit={(e) => {
                e.preventDefault();
                saveUser();
              }}
            >
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Tên:
                  </label>
                  <input
                    type='text'
                    name='fullName'
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className='block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-400 focus:ring-blue-400'
                    placeholder='Nhập tên đầy đủ...'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Username:
                  </label>
                  <input
                    type='text'
                    name='userName'
                    value={formData.userName}
                    onChange={handleInputChange}
                    className='block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-400 focus:ring-blue-400'
                    placeholder='Nhập username...'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Email:
                  </label>
                  <input
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleInputChange}
                    className='block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-400 focus:ring-blue-400'
                    placeholder='example@mail.com'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    SĐT:
                  </label>
                  <input
                    type='text'
                    name='phoneNumber'
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className='block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-400 focus:ring-blue-400'
                    placeholder='Nhập số điện thoại...'
                  />
                </div>
                <div className='col-span-1'>
                  <label className='block mb-1 flex items-center justify-between'>
                    Nhóm
                    <button
                      type='button'
                      onClick={() => navigate('/group-management')}
                      className='text-blue-500 text-sm'
                    >
                      Edit
                    </button>
                  </label>
                  <select
                    name='group'
                    value={formData.group}
                    onChange={handleInputChange}
                    className='block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-400 focus:ring-blue-400'
                  >
                    <option value=''>Chọn nhóm</option>
                    {groupOptions.map((group) => (
                      <option key={group.groupName} value={group.groupName}>
                        {group.groupName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Phòng ban:
                  </label>
                  <input
                    type='text'
                    name='department'
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder='Software Development'
                    className='block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-400 focus:ring-blue-400'
                  />
                </div>
                <div className='col-span-1'>
                  <label className='block mb-1 flex items-center justify-between'>
                    Position:
                    <button
                      type='button'
                      onClick={() => navigate('/position-management')}
                      className='text-blue-500 text-sm'
                    >
                      Edit
                    </button>
                  </label>
                  <select
                    name='position'
                    value={formData.position}
                    onChange={handleInputChange}
                    className='block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-400 focus:ring-blue-400'
                  >
                    <option value=''>Select position</option>
                    {positionOptions.map((pos) => (
                      <option key={pos.positionName} value={pos.positionName}>
                        {pos.positionName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Password:
                  </label>
                  <input
                    type='password'
                    name='password'
                    value={formData.password}
                    onChange={handleInputChange}
                    className='block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-400 focus:ring-blue-400'
                  />
                </div>
                <div className='md:col-span-2'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Role:
                  </label>
                  <div className='flex flex-wrap gap-2'>
                    {roleOptions.map((role) => (
                      <button
                        key={role.roleName}
                        type='button'
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            roles: [role.roleName],
                          }))
                        }
                        className={`px-3 py-1 rounded-full text-sm border transition-all ${
                          formData.roles && formData.roles[0] === role.roleName
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
              <div className='flex justify-end mt-6'>
                <button
                  type='submit'
                  className='mr-3 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition'
                >
                  Lưu
                </button>
                <button
                  type='button'
                  onClick={() => setShowForm(false)}
                  className='px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-200 transition'
                >
                  Hủy
                </button>
              </div>
            </form>
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
