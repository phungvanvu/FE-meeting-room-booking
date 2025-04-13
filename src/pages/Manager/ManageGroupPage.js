// src/pages/Manager/ManageGroupPage.js
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import DeleteConfirmModal from '../../components/DeleteConfirmModal';
import API_BASE_URL from '../../config';

const ManageGroupPage = () => {
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

  // State cho modal confirm delete
  const [showGroupDeleteModal, setShowGroupDeleteModal] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);

  const getAuthHeaders = () => {
    const accessToken = sessionStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      Authorization: accessToken ? `Bearer ${accessToken}` : '',
    };
  };

  const fetchGroups = () => {
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
          setGroups(data.data?.content || []);
          setGroupTotalPages(data.data?.totalPages || 0);
        } else {
          toast.error('Error fetching groups');
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchGroups();
  }, [groupCurrentPage, groupSearchTerm]);

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

  // Thay đổi: Thay window.confirm bằng modal
  const initiateDeleteGroup = (group) => {
    setGroupToDelete(group);
    setShowGroupDeleteModal(true);
  };

  const confirmDeleteGroup = () => {
    if (!groupToDelete) return;
    fetch(`${API_BASE_URL}/group/${groupToDelete.groupName}`, {
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
      .catch((err) => toast.error('Group deletion failed'))
      .finally(() => {
        setShowGroupDeleteModal(false);
        setGroupToDelete(null);
      });
  };

  const cancelDeleteGroup = () => {
    setShowGroupDeleteModal(false);
    setGroupToDelete(null);
  };

  return (
    <div className='min-h-screen flex flex-col bg-gray-50'>
      <Header />
      <div className='flex-grow container mx-auto py-6 px-4'>
        <h1 className='text-3xl font-bold text-center mb-8'>Manage Groups</h1>
        <div className='bg-white rounded-xl shadow-lg p-6'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-4'>
            <h2 className='text-2xl font-semibold'>Groups</h2>
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
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Group Name
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Location
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Division
                  </th>
                  <th className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Actions
                  </th>
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
                      <td className='py-2 px-4'>
                        <div className='flex justify-center items-center gap-2'>
                          <button
                            onClick={() => handleEditGroup(group)}
                            className='text-blue-500 hover:text-blue-700 transition text-sm font-medium'
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => initiateDeleteGroup(group)}
                            className='text-red-500 hover:text-red-700 transition text-sm font-medium'
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
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
      </div>

      {/* Modal Form cho Group */}
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
                    Group Name
                    <span className='text-red-500 text-2xl'>*</span>
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

      {/* Modal Confirm Delete cho Group */}
      {showGroupDeleteModal && groupToDelete && (
        <DeleteConfirmModal
          message={`Are you sure you want to delete group "${groupToDelete.groupName}"?`}
          onConfirm={confirmDeleteGroup}
          onCancel={cancelDeleteGroup}
        />
      )}

      <Footer className='mt-auto' />
    </div>
  );
};

export default ManageGroupPage;
