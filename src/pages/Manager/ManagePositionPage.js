// src/pages/Manager/ManagePositionPage.js
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import DeleteConfirmModal from '../../components/DeleteConfirmModal';
import API_BASE_URL from '../../config';

const ManagePositionPage = () => {
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

  // State cho modal confirm delete cho Position
  const [showPositionDeleteModal, setShowPositionDeleteModal] = useState(false);
  const [positionToDelete, setPositionToDelete] = useState(null);

  const getAuthHeaders = () => {
    const accessToken = sessionStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      Authorization: accessToken ? `Bearer ${accessToken}` : '',
    };
  };

  const fetchPositions = () => {
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
          setPositions(data.data?.content || []);
          setPositionTotalPages(data.data?.totalPages || 0);
        } else {
          toast.error('Error fetching positions');
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchPositions();
  }, [positionCurrentPage, positionSearchTerm]);

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

  // Thay window.confirm bằng modal cho Position
  const initiateDeletePosition = (position) => {
    setPositionToDelete(position);
    setShowPositionDeleteModal(true);
  };

  const confirmDeletePosition = () => {
    if (!positionToDelete) return;
    fetch(`${API_BASE_URL}/position/${positionToDelete.positionName}`, {
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
      .catch((err) => toast.error('Position deletion failed'))
      .finally(() => {
        setShowPositionDeleteModal(false);
        setPositionToDelete(null);
      });
  };

  const cancelDeletePosition = () => {
    setShowPositionDeleteModal(false);
    setPositionToDelete(null);
  };

  return (
    <div className='min-h-screen flex flex-col bg-gray-50'>
      <Header />
      <div className='flex-grow container mx-auto py-6 px-4 pb-20'>
        <h1 className='text-3xl font-bold text-center mb-8'>
          Manage Positions
        </h1>
        <div className='bg-white rounded-xl shadow-lg p-6'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-4'>
            <h2 className='text-2xl font-semibold'>Positions</h2>
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
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Position Name
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Description
                  </th>
                  <th className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Actions
                  </th>
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
                      <td className='py-2 px-4'>
                        <div className='flex justify-center items-center gap-2'>
                          <button
                            onClick={() => handleEditPosition(position)}
                            className='text-blue-500 hover:text-blue-700 transition text-sm font-medium'
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => initiateDeletePosition(position)}
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
              {Array.from({ length: positionTotalPages }, (_, i) => i + 1).map(
                (page) => (
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
                ),
              )}
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

      {/* Modal Form cho Position */}
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

      {/* Modal Confirm Delete cho Position */}
      {showPositionDeleteModal && positionToDelete && (
        <DeleteConfirmModal
          message={`Are you sure you want to delete position "${positionToDelete.positionName}"?`}
          onConfirm={confirmDeletePosition}
          onCancel={cancelDeletePosition}
        />
      )}

      <Footer className='fixed bottom-0 left-0 w-full' />
    </div>
  );
};

export default ManagePositionPage;
