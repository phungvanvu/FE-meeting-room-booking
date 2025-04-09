import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import API_BASE_URL from '../../config';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return <h2 className='text-center py-10'>Something went wrong.</h2>;
    }
    return this.props.children;
  }
}

const ManageGroupPosition = () => {
  // -----------------------------
  // State for Group
  // -----------------------------
  const [groups, setGroups] = useState([]);
  const [groupFormData, setGroupFormData] = useState({
    groupName: '',
    location: '',
    division: '',
  });
  const [editingGroup, setEditingGroup] = useState(null);
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [groupFormErrors, setGroupFormErrors] = useState('');
  const [groupSearchTerm, setGroupSearchTerm] = useState('');
  const [groupCurrentPage, setGroupCurrentPage] = useState(1);
  const [groupTotalPages, setGroupTotalPages] = useState(0);
  const groupsPerPage = 5;

  // -----------------------------
  // State for Position
  // -----------------------------
  const [positions, setPositions] = useState([]);
  const [positionFormData, setPositionFormData] = useState({
    positionName: '',
    description: '',
  });
  const [editingPosition, setEditingPosition] = useState(null);
  const [showPositionForm, setShowPositionForm] = useState(false);
  const [positionFormErrors, setPositionFormErrors] = useState('');
  const [positionSearchTerm, setPositionSearchTerm] = useState('');
  const [positionCurrentPage, setPositionCurrentPage] = useState(1);
  const [positionTotalPages, setPositionTotalPages] = useState(0);
  const positionsPerPage = 5;

  const getAuthHeaders = () => {
    const accessToken = sessionStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      Authorization: accessToken ? `Bearer ${accessToken}` : '',
    };
  };

  // -----------------------------
  // Fetch Groups (with pagination, search, and sort)
  // -----------------------------
  const fetchGroups = () => {
    // Use new endpoint "/group/search"
    let url = `${API_BASE_URL}/group/search?`;
    if (groupSearchTerm) {
      url += `groupName=${encodeURIComponent(groupSearchTerm)}&`;
    }
    url += `page=${
      groupCurrentPage - 1
    }&size=${groupsPerPage}&sortBy=groupName&sortDirection=ASC`;

    fetch(url, { headers: getAuthHeaders() })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const content = data.data?.content || [];
          setGroups(content);
          setGroupTotalPages(data.data?.totalPages || 0);
        } else {
          toast.error('Error fetching groups');
        }
      })
      .catch((err) => console.error(err));
  };

  // -----------------------------
  // Fetch Positions (with pagination, search, and sort)
  // -----------------------------
  const fetchPositions = () => {
    // Use new endpoint "/position/search"
    let url = `${API_BASE_URL}/position/search?`;
    if (positionSearchTerm) {
      url += `positionName=${encodeURIComponent(positionSearchTerm)}&`;
    }
    url += `page=${
      positionCurrentPage - 1
    }&size=${positionsPerPage}&sortBy=positionName&sortDirection=ASC`;

    fetch(url, { headers: getAuthHeaders() })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const content = data.data?.content || [];
          setPositions(content);
          setPositionTotalPages(data.data?.totalPages || 0);
        } else {
          toast.error('Error fetching positions');
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchGroups();
  }, [groupCurrentPage, groupSearchTerm]);

  useEffect(() => {
    fetchPositions();
  }, [positionCurrentPage, positionSearchTerm]);

  // -----------------------------
  // CRUD for Group
  // -----------------------------
  const handleGroupFormSubmit = (e) => {
    e.preventDefault();
    setGroupFormErrors('');
    const method = editingGroup ? 'PUT' : 'POST';
    const url = editingGroup
      ? `${API_BASE_URL}/group/${editingGroup.groupName}`
      : `${API_BASE_URL}/group`;

    fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify(groupFormData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast.success(
            editingGroup
              ? 'Group updated successfully!'
              : 'Group added successfully!',
          );
          fetchGroups();
          setShowGroupForm(false);
          setGroupFormData({ groupName: '', location: '', division: '' });
          setEditingGroup(null);
        } else {
          setGroupFormErrors(data.error?.message || 'Error saving group');
          toast.error('Group operation failed');
        }
      })
      .catch((err) => {
        setGroupFormErrors(err.message || 'Server connection error');
        toast.error('Group operation failed');
      });
  };

  const handleEditGroup = (group) => {
    setEditingGroup(group);
    setGroupFormData({
      groupName: group.groupName,
      location: group.location,
      division: group.division,
    });
    setGroupFormErrors('');
    setShowGroupForm(true);
  };

  const handleDeleteGroup = (groupName) => {
    if (window.confirm('Are you sure you want to delete this group?')) {
      fetch(`${API_BASE_URL}/group/${groupName}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            toast.success('Group deleted successfully!');
            if (groups.length === 1 && groupCurrentPage > 1) {
              setGroupCurrentPage(groupCurrentPage - 1);
            } else {
              fetchGroups();
            }
          } else {
            toast.error('Group deletion failed');
          }
        })
        .catch((err) => toast.error('Group deletion failed'));
    }
  };

  // -----------------------------
  // CRUD for Position
  // -----------------------------
  const handlePositionFormSubmit = (e) => {
    e.preventDefault();
    setPositionFormErrors('');
    const method = editingPosition ? 'PUT' : 'POST';
    const url = editingPosition
      ? `${API_BASE_URL}/position/${editingPosition.positionName}`
      : `${API_BASE_URL}/position`;

    fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify(positionFormData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast.success(
            editingPosition
              ? 'Position updated successfully!'
              : 'Position added successfully!',
          );
          fetchPositions();
          setShowPositionForm(false);
          setPositionFormData({ positionName: '', description: '' });
          setEditingPosition(null);
        } else {
          setPositionFormErrors(data.error?.message || 'Error saving position');
          toast.error('Position operation failed');
        }
      })
      .catch((err) => {
        setPositionFormErrors(err.message || 'Server connection error');
        toast.error('Position operation failed');
      });
  };

  const handleEditPosition = (position) => {
    setEditingPosition(position);
    setPositionFormData({
      positionName: position.positionName,
      description: position.description,
    });
    setPositionFormErrors('');
    setShowPositionForm(true);
  };

  const handleDeletePosition = (positionName) => {
    if (window.confirm('Are you sure you want to delete this position?')) {
      fetch(`${API_BASE_URL}/position/${positionName}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            toast.success('Position deleted successfully!');
            if (positions.length === 1 && positionCurrentPage > 1) {
              setPositionCurrentPage(positionCurrentPage - 1);
            } else {
              fetchPositions();
            }
          } else {
            toast.error('Position deletion failed');
          }
        })
        .catch((err) => toast.error('Position deletion failed'));
    }
  };

  // -----------------------------
  // Render Component
  // -----------------------------
  return (
    <ErrorBoundary>
      <div className='min-h-screen flex flex-col bg-gray-50'>
        <Header />
        {/* Section Header */}
        <div className='container mx-auto py-6 px-4'>
          <h1 className='text-3xl font-bold text-center mb-8'>
            Manage Groups & Positions
          </h1>
        </div>
        <div className='flex-grow container mx-auto px-4 grid gap-6 lg:grid-cols-2'>
          {/* Group Management Card */}
          <div className='bg-white rounded-xl shadow-lg p-6'>
            <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-4'>
              <h2 className='text-2xl font-semibold'>Group</h2>
              <div className='flex items-center gap-3 mt-3 md:mt-0'>
                <input
                  type='text'
                  placeholder='Search group...'
                  value={groupSearchTerm}
                  onChange={(e) => {
                    setGroupSearchTerm(e.target.value);
                    setGroupCurrentPage(1);
                  }}
                  className='border rounded-xl py-2 px-3 text-sm bg-gray-50 focus:ring-2 focus:ring-blue-400 transition-shadow'
                />
                <button
                  onClick={() => {
                    setShowGroupForm(true);
                    setEditingGroup(null);
                    setGroupFormData({
                      groupName: '',
                      location: '',
                      division: '',
                    });
                    setGroupFormErrors('');
                  }}
                  className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl shadow transition'
                >
                  Add Group
                </button>
              </div>
            </div>
            <div className='overflow-x-auto rounded-xl shadow-inner'>
              <table className='min-w-full text-sm'>
                <thead className='bg-gray-100'>
                  <tr>
                    <th className='py-2 px-4 text-left'>Group Name</th>
                    <th className='py-2 px-4 text-left'>Location</th>
                    <th className='py-2 px-4 text-left'>Division</th>
                    <th className='py-2 px-4 text-center'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(groups) &&
                    groups.map((group) => (
                      <tr
                        key={group.groupName}
                        className='border-b hover:bg-gray-50'
                      >
                        <td className='py-2 px-4'>{group.groupName}</td>
                        <td className='py-2 px-4'>{group.location}</td>
                        <td className='py-2 px-4'>{group.division}</td>
                        <td className='py-2 px-4 text-center space-x-2'>
                          <button
                            onClick={() => handleEditGroup(group)}
                            className='text-blue-500 hover:text-blue-700 transition text-sm font-medium'
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteGroup(group.groupName)}
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
            {groupTotalPages > 1 && (
              <div className='flex justify-center items-center mt-4 gap-2'>
                <button
                  onClick={() =>
                    setGroupCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={groupCurrentPage === 1}
                  className={`w-10 h-10 flex items-center justify-center rounded-full transition ${
                    groupCurrentPage === 1
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  <ChevronLeft size={18} />
                </button>
                {Array.from({ length: groupTotalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setGroupCurrentPage(page)}
                      className={`w-10 h-10 flex items-center justify-center rounded-full font-medium transition ${
                        groupCurrentPage === page
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
                    setGroupCurrentPage((prev) =>
                      Math.min(prev + 1, groupTotalPages),
                    )
                  }
                  disabled={groupCurrentPage === groupTotalPages}
                  className={`w-10 h-10 flex items-center justify-center rounded-full transition ${
                    groupCurrentPage === groupTotalPages
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
            {groupFormErrors && (
              <div className='mt-2 text-red-600 text-sm'>{groupFormErrors}</div>
            )}
          </div>

          {/* Position Management Card */}
          <div className='bg-white rounded-xl shadow-lg p-6'>
            <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-4'>
              <h2 className='text-2xl font-semibold'>Position</h2>
              <div className='flex items-center gap-3 mt-3 md:mt-0'>
                <input
                  type='text'
                  placeholder='Search position...'
                  value={positionSearchTerm}
                  onChange={(e) => {
                    setPositionSearchTerm(e.target.value);
                    setPositionCurrentPage(1);
                  }}
                  className='border rounded-xl py-2 px-3 text-sm bg-gray-50 focus:ring-2 focus:ring-blue-400 transition-shadow'
                />
                <button
                  onClick={() => {
                    setShowPositionForm(true);
                    setEditingPosition(null);
                    setPositionFormData({ positionName: '', description: '' });
                    setPositionFormErrors('');
                  }}
                  className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl shadow transition'
                >
                  Add Position
                </button>
              </div>
            </div>
            <div className='overflow-x-auto rounded-xl shadow-inner'>
              <table className='min-w-full text-sm'>
                <thead className='bg-gray-100'>
                  <tr>
                    <th className='py-2 px-4 text-left'>Position Name</th>
                    <th className='py-2 px-4 text-left'>Description</th>
                    <th className='py-2 px-4 text-center'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(positions) &&
                    positions.map((position) => (
                      <tr
                        key={position.positionName}
                        className='border-b hover:bg-gray-50'
                      >
                        <td className='py-2 px-4'>{position.positionName}</td>
                        <td className='py-2 px-4'>{position.description}</td>
                        <td className='py-2 px-4 text-center space-x-2'>
                          <button
                            onClick={() => handleEditPosition(position)}
                            className='text-blue-500 hover:text-blue-700 transition text-sm font-medium'
                          >
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              handleDeletePosition(position.positionName)
                            }
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
            {positionTotalPages > 1 && (
              <div className='flex justify-center items-center mt-4 gap-2'>
                <button
                  onClick={() =>
                    setPositionCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={positionCurrentPage === 1}
                  className={`w-10 h-10 flex items-center justify-center rounded-full transition ${
                    positionCurrentPage === 1
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  <ChevronLeft size={18} />
                </button>
                {Array.from(
                  { length: positionTotalPages },
                  (_, i) => i + 1,
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => setPositionCurrentPage(page)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full font-medium transition ${
                      positionCurrentPage === page
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-blue-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setPositionCurrentPage((prev) =>
                      Math.min(prev + 1, positionTotalPages),
                    )
                  }
                  disabled={positionCurrentPage === positionTotalPages}
                  className={`w-10 h-10 flex items-center justify-center rounded-full transition ${
                    positionCurrentPage === positionTotalPages
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
            {positionFormErrors && (
              <div className='mt-2 text-red-600 text-sm'>
                {positionFormErrors}
              </div>
            )}
          </div>
        </div>

        {/* Modal Form for Group */}
        {showGroupForm && (
          <div className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50'>
            <div className='bg-white rounded-xl shadow-lg w-full max-w-md p-6'>
              <h2 className='text-xl font-bold mb-4'>
                {editingGroup ? 'Edit Group' : 'Add Group'}
              </h2>
              <form onSubmit={handleGroupFormSubmit}>
                {editingGroup ? (
                  <div className='mb-4'>
                    <label className='block text-gray-700'>Group Name</label>
                    <span className='block bg-gray-100 p-2 rounded'>
                      {editingGroup.groupName}
                    </span>
                  </div>
                ) : (
                  <div className='mb-4'>
                    <label className='block text-gray-700'>
                      Group Name<span className='text-red-500 text-2xl'>*</span>
                    </label>
                    <input
                      type='text'
                      name='groupName'
                      value={groupFormData.groupName}
                      onChange={(e) =>
                        setGroupFormData({
                          ...groupFormData,
                          groupName: e.target.value,
                        })
                      }
                      className='w-full border rounded px-3 py-2'
                      required
                    />
                  </div>
                )}
                <div className='mb-4'>
                  <label className='block text-gray-700'>Location</label>
                  <input
                    type='text'
                    name='location'
                    value={groupFormData.location}
                    onChange={(e) =>
                      setGroupFormData({
                        ...groupFormData,
                        location: e.target.value,
                      })
                    }
                    className='w-full border rounded px-3 py-2'
                  />
                </div>
                <div className='mb-4'>
                  <label className='block text-gray-700'>Division</label>
                  <input
                    type='text'
                    name='division'
                    value={groupFormData.division}
                    onChange={(e) =>
                      setGroupFormData({
                        ...groupFormData,
                        division: e.target.value,
                      })
                    }
                    className='w-full border rounded px-3 py-2'
                  />
                </div>
                {groupFormErrors && (
                  <div className='mb-4 text-red-600 text-sm'>
                    {groupFormErrors}
                  </div>
                )}
                <div className='flex justify-end'>
                  <button
                    type='button'
                    onClick={() => setShowGroupForm(false)}
                    className='mr-3 px-4 py-2 border rounded'
                  >
                    Cancel
                  </button>
                  <button
                    type='submit'
                    className='px-4 py-2 bg-blue-500 text-white rounded'
                  >
                    {editingGroup ? 'Update' : 'Add'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Form for Position */}
        {showPositionForm && (
          <div className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50'>
            <div className='bg-white rounded-xl shadow-lg w-full max-w-md p-6'>
              <h2 className='text-xl font-bold mb-4'>
                {editingPosition ? 'Edit Position' : 'Add Position'}
              </h2>
              <form onSubmit={handlePositionFormSubmit}>
                {editingPosition ? (
                  <div className='mb-4'>
                    <label className='block text-gray-700'>Position Name</label>
                    <span className='block bg-gray-100 p-2 rounded'>
                      {editingPosition.positionName}
                    </span>
                  </div>
                ) : (
                  <div className='mb-4'>
                    <label className='block text-gray-700'>
                      Position Name
                      <span className='text-red-500 text-2xl'>*</span>
                    </label>
                    <input
                      type='text'
                      name='positionName'
                      value={positionFormData.positionName}
                      onChange={(e) =>
                        setPositionFormData({
                          ...positionFormData,
                          positionName: e.target.value,
                        })
                      }
                      className='w-full border rounded px-3 py-2'
                      required
                    />
                  </div>
                )}
                <div className='mb-4'>
                  <label className='block text-gray-700'>Description</label>
                  <textarea
                    name='description'
                    value={positionFormData.description}
                    onChange={(e) =>
                      setPositionFormData({
                        ...positionFormData,
                        description: e.target.value,
                      })
                    }
                    className='w-full border rounded px-3 py-2'
                    rows='3'
                  ></textarea>
                </div>
                {positionFormErrors && (
                  <div className='mb-4 text-red-600 text-sm'>
                    {positionFormErrors}
                  </div>
                )}
                <div className='flex justify-end'>
                  <button
                    type='button'
                    onClick={() => setShowPositionForm(false)}
                    className='mr-3 px-4 py-2 border rounded'
                  >
                    Cancel
                  </button>
                  <button
                    type='submit'
                    className='px-4 py-2 bg-blue-500 text-white rounded'
                  >
                    {editingPosition ? 'Update' : 'Add'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <Footer className='fixed bottom-0 left-0 w-full' />
      </div>
    </ErrorBoundary>
  );
};

export default ManageGroupPosition;
