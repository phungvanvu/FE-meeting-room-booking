import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../../config';
import { toast } from 'react-toastify';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Eye, EyeOff } from 'lucide-react';
import Select from 'react-select';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedPositions, setSelectedPositions] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);
  const [positionOptions, setPositionOptions] = useState([]);
  const [groupOptions, setGroupOptions] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const baseLabel =
    'relative inline-block text-sm font-medium text-gray-700 mb-1 pr-2';
  const requiredLabel = `${baseLabel}
    after:content-["*"] after:absolute
    after:top-1/2 after:-translate-y-1/2
    after:right-0 after:text-red-500 after:text-base`;
  const [showForm, setShowForm] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showMultiDeleteConfirm, setShowMultiDeleteConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
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
    enabled: true,
  });

  const resetForm = () => {
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
      enabled: true,
    });
    setValidationErrors({});
    setErrorMessage('');
    setCurrentUser(null);
  };

  const getAuthHeaders = () => {
    const accessToken = sessionStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      Authorization: accessToken ? `Bearer ${accessToken}` : '',
    };
  };

  const fetchUsers = () => {
    let url = `${API_BASE_URL}/user/search?`;
    if (searchTerm) {
      url += `fullName=${encodeURIComponent(searchTerm)}&`;
    }
    if (departmentFilter) {
      url += `department=${encodeURIComponent(departmentFilter)}&`;
    }
    if (selectedGroups.length > 0) {
      url += `group=${encodeURIComponent(selectedGroups.join(','))}&`;
    }
    if (selectedRoles.length > 0) {
      url += `roles=${encodeURIComponent(selectedRoles.join(','))}&`;
    }
    if (selectedPositions.length > 0) {
      url += `position=${encodeURIComponent(selectedPositions.join(','))}&`;
    }
    url += `page=${currentPage - 1}&size=${usersPerPage}`;

    fetch(url, { headers: getAuthHeaders() })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUsers(data.data.content);
          setTotalPages(data.data.totalPages);
          setSelectedUserIds([]);
        } else {
          console.error('Error fetching users:', data.error);
        }
      })
      .catch((err) => console.error(err));
  };

  const fetchForeignData = () => {
    fetch(`${API_BASE_URL}/role`, { headers: getAuthHeaders() })
      .then((res) => res.json())
      .then((data) => data.success && setRoleOptions(data.data))
      .catch((err) => console.error(err));

    fetch(`${API_BASE_URL}/position`, { headers: getAuthHeaders() })
      .then((res) => res.json())
      .then((data) => data.success && setPositionOptions(data.data))
      .catch((err) => console.error(err));

    fetch(`${API_BASE_URL}/group`, { headers: getAuthHeaders() })
      .then((res) => res.json())
      .then((data) => data.success && setGroupOptions(data.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchForeignData();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchUsers();
  };

  const resetFilters = () => {
    setSearchTerm('');
    setDepartmentFilter('');
    setSelectedGroups([]);
    setSelectedRoles([]);
    setSelectedPositions([]);
    setCurrentPage(1);
    fetchUsers();
  };

  const handleAddUser = () => {
    setCurrentUser(null);
    resetForm();
    setShowForm(true);
  };

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setValidationErrors({});
    setErrorMessage('');
    setFormData({
      userName: user.userName,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      department: user.department,
      group: user.groupName,
      password: '',
      position: user.positionName || '',
      roles: user.roles,
      enabled: user.enabled,
    });
    setShowForm(true);
  };

  const saveUser = () => {
    const requestBody = {
      userName: formData.userName,
      fullName: formData.fullName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      department: formData.department,
      group: formData.group,
      position: formData.position,
      roles: formData.roles,
      enabled: formData.enabled,
    };

    if (formData.password.trim()) {
      requestBody.password = formData.password;
    }

    const url = currentUser
      ? `${API_BASE_URL}/user/${currentUser.userId}`
      : `${API_BASE_URL}/user`;

    fetch(url, {
      method: currentUser ? 'PUT' : 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(requestBody),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast.success(
            currentUser
              ? 'User updated successfully!'
              : 'User added successfully!',
          );
          fetchUsers();
          setShowForm(false);
        } else {
          if (data.data && typeof data.data === 'object') {
            setValidationErrors(data.data);
          }
          setErrorMessage(data.error?.message || '');
        }
      })
      .catch((err) =>
        setErrorMessage(err.message || 'Server connection error.'),
      );
  };

  const handleDeleteUser = (user) => {
    setCurrentUser(user);
    setShowConfirmDelete(true);
  };

  const confirmDelete = () => {
    if (!currentUser) return;

    fetch(`${API_BASE_URL}/user/${currentUser.userId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast.success('User deleted successfully!');
          fetchUsers();
        } else {
          toast.error(data.error?.message || 'Error deleting user');
          console.error('Error deleting user', data.error);
        }
      })
      .catch((err) => {
        console.error('Error deleting user', err);
        toast.error(err.message || 'Error deleting user');
      });

    setShowConfirmDelete(false);
  };

  const cancelDelete = () => {
    setShowConfirmDelete(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValidationErrors((prev) => {
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const exportToExcel = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/export-users-excel`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) throw new Error('Error downloading file');

      const disposition = response.headers.get('Content-Disposition');
      const filenameMatch =
        disposition && disposition.match(/filename=([^;]+)/);

      if (!filenameMatch || !filenameMatch[1]) {
        throw new Error('Could not get file name from Content-Disposition');
      }
      const filename = filenameMatch[1];
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Error exporting excel');
    }
  };

  const handleDeleteMultipleUsers = () => {
    if (selectedUserIds.length === 0) {
      toast.error('Please select at least one user to delete.');
      return;
    }
    setShowMultiDeleteConfirm(true);
  };

  const confirmDeleteMultiple = () => {
    fetch(`${API_BASE_URL}/user/delete-multiple`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      body: JSON.stringify(selectedUserIds),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast.success('Selected users have been deleted successfully.');
          fetchUsers();
        } else {
          toast.error(data.error?.message || 'Error deleting users');
          fetchUsers();
        }
      })
      .catch((err) => {
        console.error('Error deleting users', err);
        toast.error(err.message || 'Error deleting users');
      });
    setShowMultiDeleteConfirm(false);
  };

  const getSelectStyles = (hasError) => ({
    control: (base, state) => ({
      ...base,
      borderColor: hasError ? '#f87171' : base.borderColor,
      boxShadow: hasError
        ? '0 0 0 1px #f87171'
        : state.isFocused
        ? '0 0 0 1px #60a5fa'
        : base.boxShadow,
      '&:hover': {
        borderColor: hasError ? '#f87171' : '#60a5fa',
      },
    }),
  });

  // Khi user chọn file
  const handleImport = async (e) => {
    const input = e.target;
    const file = input.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE_URL}/user/import-users-excel`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
      },
      body: formData,
    });
    const data = await res.json();
    if (data.success) {
      toast.success(data.data || 'Imported successfully');
      fetchUsers();
    } else {
      toast.error(data.error?.message || 'Import failed');
    }
    input.value = null;
  };

  return (
    <div className='min-h-screen flex flex-col bg-gray-50'>
      <Header />
      <div className='flex-grow mx-auto mt-10 flex gap-4 mb-10 px-6 w-full'>
        {/* Filter Sidebar */}
        <div className='w-1/5 bg-white p-6 rounded-2xl shadow-md border border-gray-200 flex flex-col'>
          <h2 className='text-xl font-semibold mb-5 text-gray-800'>Filter</h2>
          {/* Search by Name */}
          <div className='mb-4'>
            <label className='block text-sm font-bold text-gray-700 mb-2'>
              Enter Name
            </label>
            <input
              type='text'
              placeholder='Enter name...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full border border-gray-300 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-blue-400 bg-gray-50 hover:bg-gray-100 transition-all shadow-sm'
            />
          </div>
          {/* Department Input */}
          <div className='mb-4'>
            <label className='block text-sm font-bold text-gray-700 mb-2'>
              Department
            </label>
            <input
              type='text'
              placeholder='Enter department...'
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className='w-full border border-gray-300 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-blue-400 bg-gray-50 hover:bg-gray-100 transition-all shadow-sm'
            />
          </div>
          {/* Position Filter */}
          <div className='mb-4'>
            <label className='block text-sm font-bold text-gray-700 mb-2'>
              Position
            </label>
            <div className='border border-gray-300 rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition-all'>
              {positionOptions.map((position) => (
                <label
                  key={position.positionName}
                  className='flex items-center space-x-2 py-1 cursor-pointer'
                >
                  <input
                    type='checkbox'
                    value={position.positionName}
                    checked={selectedPositions.includes(position.positionName)}
                    onChange={() => {
                      setSelectedPositions((prev) =>
                        prev.includes(position.positionName)
                          ? prev.filter((p) => p !== position.positionName)
                          : [...prev, position.positionName],
                      );
                    }}
                    className='h-4 w-4 border-gray-300 rounded text-blue-500 focus:ring-blue-400'
                  />
                  <span className='text-sm text-gray-700'>
                    {position.positionName}
                  </span>
                </label>
              ))}
            </div>
          </div>
          {/* Group Filter */}
          <div className='mb-4'>
            <label className='block text-sm font-bold text-gray-700 mb-2'>
              Group
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
          {/* Role Filter */}
          <div className='mb-4'>
            <label className='block text-sm font-bold text-gray-700 mb-2'>
              Role
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
          {/* Reset & Search Buttons */}
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
        {/* User List */}
        <div className='w-4/5'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-2xl font-bold text-gray-800'>User List</h2>
            <div className='flex gap-3'>
              <button
                onClick={handleAddUser}
                className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow transition'
              >
                Create User
              </button>
              <button
                onClick={handleDeleteMultipleUsers}
                className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow transition'
              >
                Delete Selected
              </button>
              <button
                onClick={exportToExcel}
                className='bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg shadow transition'
              >
                Export Excel
              </button>
              <label
                htmlFor='importExcel'
                className='inline-block bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg cursor-pointer'
              >
                Import Excel
              </label>
              <input
                id='importExcel'
                type='file'
                accept='.xlsx,.xls'
                hidden
                onChange={handleImport} // Hàm import ngay khi chọn file
              />
            </div>
          </div>
          <div className='overflow-x-auto bg-white rounded-xl shadow-md'>
            <table className='min-w-full table-fixed'>
              <thead className='bg-gray-200'>
                <tr>
                  <th className='px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    <input
                      type='checkbox'
                      onChange={(e) => {
                        if (e.target.checked) {
                          const allIds = users.map((user) => user.userId);
                          setSelectedUserIds(allIds);
                        } else {
                          setSelectedUserIds([]);
                        }
                      }}
                      checked={
                        users.length > 0 &&
                        selectedUserIds.length === users.length
                      }
                      className='h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                    />
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    No.
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Name
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Username
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Email
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Phone
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Group
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Position
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Department
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Roles
                  </th>
                  <th className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {users.map((user, index) => (
                  <tr key={user.userId} className='hover:bg-gray-50 transition'>
                    <td className='px-6 py-4 whitespace-normal'>
                      <input
                        type='checkbox'
                        checked={selectedUserIds.includes(user.userId)}
                        onChange={() => {
                          setSelectedUserIds((prev) =>
                            prev.includes(user.userId)
                              ? prev.filter((id) => id !== user.userId)
                              : [...prev, user.userId],
                          );
                        }}
                        className='h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                      />
                    </td>
                    <td className='px-6 py-4 whitespace-normal'>
                      {(currentPage - 1) * usersPerPage + index + 1}
                    </td>
                    <td className='px-6 py-4 whitespace-normal font-medium text-gray-900'>
                      {user.fullName}
                    </td>
                    <td className='px-6 py-4 whitespace-normal'>
                      {user.userName}
                    </td>
                    <td className='px-6 py-4 whitespace-normal'>
                      {user.email}
                    </td>
                    <td className='px-6 py-4 whitespace-normal'>
                      {user.phoneNumber}
                    </td>
                    <td className='px-6 py-4 whitespace-normal'>
                      {user.groupName}
                    </td>
                    <td className='px-6 py-4 whitespace-normal'>
                      {user.positionName}
                    </td>
                    <td className='px-6 py-4 whitespace-normal'>
                      {user.department}
                    </td>
                    <td className='px-6 py-4 whitespace-normal'>
                      <div className='flex flex-wrap gap-1'>
                        {user.roles.map((role, idx) => (
                          <span
                            key={idx}
                            className='px-2 py-1 bg-blue-100 text-blue-600 text-xs font-semibold rounded-full'
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-normal text-center'>
                      <button
                        onClick={() => handleEditUser(user)}
                        className='text-blue-500 hover:text-blue-700 transition mr-2 text-sm font-medium'
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user)}
                        className='text-red-500 hover:text-red-700 transition text-sm font-medium'
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className='flex justify-center items-center mt-8 gap-2'>
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
                {currentUser ? 'Edit User' : 'Add User'}
                {errorMessage && Object.keys(validationErrors).length === 0 && (
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
              {/* Container for the first row of inputs */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* Name */}
                <div>
                  <label className={requiredLabel}>Full name:</label>
                  <input
                    type='text'
                    name='fullName'
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`block w-full rounded-md shadow-sm
                        ${
                          validationErrors.fullName
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-blue-400 focus:ring-blue-400'
                        }`}
                    placeholder='Enter full name...'
                  />
                  {validationErrors.fullName && (
                    <div className='mt-1 text-sm text-red-600'>
                      {validationErrors.fullName[0]}
                    </div>
                  )}
                </div>
                {/* Username */}
                <div>
                  <label className={requiredLabel}>Username:</label>
                  <input
                    type='text'
                    name='userName'
                    value={formData.userName}
                    onChange={handleInputChange}
                    className={`block w-full rounded-md shadow-sm
                        ${
                          validationErrors.userName
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-blue-400 focus:ring-blue-400'
                        }`}
                    placeholder='Enter username...'
                  />
                  {validationErrors.userName && (
                    <div className='mt-1 text-sm text-red-600'>
                      {validationErrors.userName[0]}
                    </div>
                  )}
                </div>
                {/* Email */}
                <div>
                  <label className={requiredLabel}>Email:</label>
                  <input
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`block w-full rounded-md shadow-sm
                        ${
                          validationErrors.email
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-blue-400 focus:ring-blue-400'
                        }`}
                    placeholder='example@mail.com'
                  />
                  {validationErrors.email && (
                    <p className='mt-1 text-sm text-red-600'>
                      {validationErrors.email[0]}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className={requiredLabel}>Phone:</label>
                  <input
                    type='text'
                    name='phoneNumber'
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className={`block w-full rounded-md shadow-sm
                        ${
                          validationErrors.phoneNumber
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-blue-400 focus:ring-blue-400'
                        }`}
                    placeholder='Enter phone number...'
                  />
                  {validationErrors.phoneNumber && (
                    <p className='mt-1 text-sm text-red-600'>
                      {validationErrors.phoneNumber[0]}
                    </p>
                  )}
                </div>
                {/* Department */}
                <div>
                  <label className={requiredLabel}>Department</label>
                  <input
                    type='text'
                    name='department'
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder='e.g. Software Development'
                    className={`block w-full rounded-md shadow-sm
                        ${
                          validationErrors.department
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-blue-400 focus:ring-blue-400'
                        }`}
                  />
                  {validationErrors.department && (
                    <p className='mt-1 text-sm text-red-600'>
                      {validationErrors.department[0]}
                    </p>
                  )}
                </div>
                {/* Group */}
                <div>
                  <label className={requiredLabel}>Group:</label>
                  <Select
                    name='group'
                    options={groupOptions.map((group) => ({
                      value: group.groupName,
                      label: group.groupName,
                    }))}
                    value={
                      formData.group
                        ? {
                            value: formData.group,
                            label: formData.group,
                          }
                        : null
                    }
                    onChange={(selectedOption) => {
                      setFormData((prev) => ({
                        ...prev,
                        group: selectedOption ? selectedOption.value : '',
                      }));
                    }}
                    className='block w-full'
                    styles={getSelectStyles(!!validationErrors.group)}
                  />
                  {validationErrors.group && (
                    <p className='mt-1 text-sm text-red-600'>
                      {validationErrors.group[0]}
                    </p>
                  )}
                </div>
              </div>
              {/* Container for Position and Password */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
                {/* Position */}
                <div>
                  <label className={requiredLabel}>Position:</label>
                  <Select
                    name='position'
                    options={positionOptions.map((pos) => ({
                      value: pos.positionName,
                      label: pos.positionName,
                    }))}
                    value={
                      formData.position
                        ? {
                            value: formData.position,
                            label: formData.position,
                          }
                        : null
                    }
                    onChange={(selectedOption) => {
                      setFormData((prev) => ({
                        ...prev,
                        position: selectedOption ? selectedOption.value : '',
                      }));
                    }}
                    className='block w-full'
                    styles={getSelectStyles(!!validationErrors.position)}
                  />
                  {validationErrors.position?.[0] && (
                    <p className='mt-1 text-sm text-red-600'>
                      {validationErrors.position[0]}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className={currentUser ? baseLabel : requiredLabel}>
                    Password:
                  </label>
                  <div className='relative'>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name='password'
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md shadow-sm
                        ${
                          validationErrors.password
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-blue-400 focus:ring-blue-400'
                        }`}
                      placeholder={
                        currentUser
                          ? 'Enter password to change'
                          : 'Enter password'
                      }
                    />
                    <button
                      type='button'
                      className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700'
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {validationErrors.password && (
                    <p className='mt-1 text-sm text-red-600'>
                      {validationErrors.password[0]}
                    </p>
                  )}
                </div>
              </div>
              {/* Toggle for Enabled */}
              <div className='mt-4 flex items-center'>
                <label
                  htmlFor='toggle-enabled'
                  className='relative inline-block w-12 h-6'
                >
                  <input
                    id='toggle-enabled'
                    type='checkbox'
                    checked={formData.enabled}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        enabled: e.target.checked,
                      }))
                    }
                    className='opacity-0 w-0 h-0'
                  />
                  <span
                    className={`absolute inset-0 cursor-pointer rounded-full transition-colors duration-200 ${
                      formData.enabled ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  ></span>
                  <span
                    className={`absolute left-0 top-0 bg-white w-6 h-6 rounded-full transition-transform duration-200 ease-in-out transform ${
                      formData.enabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  ></span>
                </label>
                <span className='ml-3 text-sm font-medium text-gray-700'>
                  Enabled{' '}
                  <span className='font-normal text-gray-600'>
                    (User is active)
                  </span>
                </span>
              </div>
              <div className='mt-4'>
                <label className='block text-sm font-medium text-gray-700 mb-1 after:content-["*"] after:ml-0.5 after:text-red-500 after:text-base'>
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
                        formData.roles.includes(role.roleName)
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {role.roleName}
                    </button>
                  ))}
                </div>
                {validationErrors.roles && (
                  <p className='mt-1 text-sm text-red-600'>
                    {validationErrors.roles[0]}
                  </p>
                )}
              </div>

              <div className='flex justify-end mt-6'>
                <button
                  type='submit'
                  className='mr-3 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition'
                >
                  Save
                </button>
                <button
                  type='button'
                  onClick={() => {
                    setErrorMessage('');
                    setShowForm(false);
                  }}
                  className='px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-200 transition'
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showConfirmDelete && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50'>
          <div className='bg-white rounded-xl shadow-xl p-8 max-w-sm w-full'>
            <h3 className='text-2xl font-semibold text-gray-800 text-center mb-4'>
              Confirm Delete
            </h3>
            <p className='text-center text-gray-600 mb-6'>
              Are you sure you want to delete this user?
            </p>
            <div className='flex justify-center space-x-4'>
              <button
                onClick={confirmDelete}
                className='px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition'
              >
                Delete
              </button>
              <button
                onClick={cancelDelete}
                className='px-5 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 transition'
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {showMultiDeleteConfirm && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50'>
          <div className='bg-white rounded-xl shadow-xl p-8 max-w-sm w-full'>
            <h3 className='text-2xl font-semibold text-gray-800 text-center mb-4'>
              Confirm Delete
            </h3>
            <p className='text-center text-gray-600 mb-6'>
              Are you sure you want to delete the selected users?
            </p>
            <div className='flex justify-center space-x-4'>
              <button
                onClick={confirmDeleteMultiple}
                className='px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition'
              >
                Delete
              </button>
              <button
                onClick={() => setShowMultiDeleteConfirm(false)}
                className='px-5 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 transition'
              >
                Cancel
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
