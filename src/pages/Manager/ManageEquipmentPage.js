// src/pages/Manager/ManageEquipmentPage.js
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import DeleteConfirmModal from '../../components/DeleteConfirmModal';
import API_BASE_URL from '../../config';

const ManageEquipmentPage = () => {
  const [equipments, setEquipments] = useState([]);
  const [equipmentFormData, setEquipmentFormData] = useState({
    equipmentName: '',
    description: '',
    available: true,
  });
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [showEquipmentForm, setShowEquipmentForm] = useState(false);
  const [equipmentFormErrors, setEquipmentFormErrors] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 5;

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [equipmentToDelete, setEquipmentToDelete] = useState(null);

  const getAuthHeaders = () => {
    const accessToken = sessionStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      Authorization: accessToken ? `Bearer ${accessToken}` : '',
    };
  };

  // Fetch equipment với phân trang, tìm kiếm, sắp xếp
  const fetchEquipments = () => {
    let url = `${API_BASE_URL}/equipment/search?`;
    if (searchTerm) {
      url += `equipmentName=${encodeURIComponent(searchTerm)}&`;
    }
    url += `page=${
      currentPage - 1
    }&size=${itemsPerPage}&sortBy=equipmentName&sortDirection=ASC`;
    fetch(url, { headers: getAuthHeaders() })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setEquipments(data.data?.content || []);
          setTotalPages(data.data?.totalPages || 0);
        } else {
          toast.error('Error fetching equipments');
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchEquipments();
  }, [currentPage, searchTerm]);

  // Handler thêm / cập nhật equipment
  const handleEquipmentFormSubmit = (e) => {
    e.preventDefault();
    setEquipmentFormErrors('');
    const method = editingEquipment ? 'PUT' : 'POST';
    const url = editingEquipment
      ? `${API_BASE_URL}/equipment/${editingEquipment.equipmentName}`
      : `${API_BASE_URL}/equipment`;
    fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify(equipmentFormData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast.success(
            editingEquipment
              ? 'Equipment updated successfully!'
              : 'Equipment added successfully!',
          );
          fetchEquipments();
          setShowEquipmentForm(false);
          setEquipmentFormData({
            equipmentName: '',
            description: '',
            available: true,
          });
          setEditingEquipment(null);
        } else {
          setEquipmentFormErrors(
            data.error?.message || 'Error saving equipment',
          );
          toast.error('Equipment operation failed');
        }
      })
      .catch((err) => {
        setEquipmentFormErrors(err.message || 'Server connection error');
        toast.error('Equipment operation failed');
      });
  };

  const handleEditEquipment = (equipment) => {
    setEditingEquipment(equipment);
    setEquipmentFormData({
      equipmentName: equipment.equipmentName,
      description: equipment.description,
      available: equipment.available,
    });
    setEquipmentFormErrors('');
    setShowEquipmentForm(true);
  };

  // Khi nhấn nút Delete, hiển thị modal confirm
  const initiateDeleteEquipment = (equipment) => {
    setEquipmentToDelete(equipment);
    setShowDeleteModal(true);
  };

  // Xử lý confirm từ modal
  const confirmDeleteEquipment = () => {
    if (!equipmentToDelete) return;
    fetch(`${API_BASE_URL}/equipment/${equipmentToDelete.equipmentName}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast.success('Equipment deleted successfully!');
          if (equipments.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          } else {
            fetchEquipments();
          }
        } else {
          toast.error('Equipment deletion failed');
        }
      })
      .catch((err) => toast.error('Equipment deletion failed'))
      .finally(() => {
        setShowDeleteModal(false);
        setEquipmentToDelete(null);
      });
  };

  // Cancel xóa
  const cancelDeleteEquipment = () => {
    setShowDeleteModal(false);
    setEquipmentToDelete(null);
  };

  return (
    <div className='min-h-screen flex flex-col bg-gray-50'>
      <Header />
      <div className='flex-grow container mx-auto py-6 px-4 pb-20'>
        <h1 className='text-3xl font-bold text-center mb-8'>
          Manage Equipments
        </h1>
        <div className='bg-white rounded-xl shadow-lg p-6'>
          {/* Thanh tìm kiếm và nút thêm mới */}
          <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-4'>
            <h2 className='text-2xl font-semibold'>Equipments</h2>
            <div className='flex items-center gap-3 mt-3 md:mt-0'>
              <input
                type='text'
                placeholder='Search equipment...'
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className='border rounded-xl py-2 px-3 text-sm bg-gray-50 focus:ring-2 focus:ring-blue-400 transition-shadow'
              />
              <button
                onClick={() => {
                  setShowEquipmentForm(true);
                  setEditingEquipment(null);
                  setEquipmentFormData({
                    equipmentName: '',
                    description: '',
                    available: true,
                  });
                  setEquipmentFormErrors('');
                }}
                className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl shadow transition'
              >
                Add Equipment
              </button>
            </div>
          </div>
          {/* Bảng hiển thị danh sách Equipment */}
          <div className='overflow-x-auto rounded-xl shadow-inner'>
            <table className='min-w-full text-sm'>
              <thead className='bg-gray-100'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Equipment Name
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Description
                  </th>
                  <th className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Available
                  </th>
                  <th className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(equipments) &&
                  equipments.map((equipment) => (
                    <tr
                      key={equipment.equipmentName}
                      className='border-b hover:bg-gray-50'
                    >
                      <td className='py-2 px-4'>{equipment.equipmentName}</td>
                      <td className='py-2 px-4'>{equipment.description}</td>
                      <td className='py-2 px-4 text-center'>
                        {equipment.available ? 'Yes' : 'No'}
                      </td>
                      <td className='py-2 px-4'>
                        <div className='flex justify-center items-center gap-2'>
                          <button
                            onClick={() => handleEditEquipment(equipment)}
                            className='text-blue-500 hover:text-blue-700 transition text-sm font-medium'
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => initiateDeleteEquipment(equipment)}
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
          {/* Phân trang */}
          {totalPages > 1 && (
            <div className='flex justify-center items-center mt-4 gap-2'>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition ${
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
                    className={`w-10 h-10 flex items-center justify-center rounded-full font-medium transition ${
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
                className={`w-10 h-10 flex items-center justify-center rounded-full transition ${
                  currentPage === totalPages
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
          {equipmentFormErrors && (
            <div className='mt-2 text-red-600 text-sm'>
              {equipmentFormErrors}
            </div>
          )}
        </div>
      </div>

      {/* Modal Form cho Equipment */}
      {showEquipmentForm && (
        <div className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50'>
          <div className='bg-white rounded-xl shadow-lg w-full max-w-md p-6'>
            <h2 className='text-xl font-bold mb-4'>
              {editingEquipment ? 'Edit Equipment' : 'Add Equipment'}
            </h2>
            <form onSubmit={handleEquipmentFormSubmit}>
              {editingEquipment ? (
                <div className='mb-4'>
                  <label className='block text-gray-700'>Equipment Name</label>
                  <span className='block bg-gray-100 p-2 rounded'>
                    {editingEquipment.equipmentName}
                  </span>
                </div>
              ) : (
                <div className='mb-4'>
                  <label className='block text-gray-700'>
                    Equipment Name
                    <span className='text-red-500 text-2xl'>*</span>
                  </label>
                  <input
                    type='text'
                    name='equipmentName'
                    value={equipmentFormData.equipmentName}
                    onChange={(e) =>
                      setEquipmentFormData({
                        ...equipmentFormData,
                        equipmentName: e.target.value,
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
                  value={equipmentFormData.description}
                  onChange={(e) =>
                    setEquipmentFormData({
                      ...equipmentFormData,
                      description: e.target.value,
                    })
                  }
                  className='w-full border rounded px-3 py-2'
                  rows='3'
                ></textarea>
              </div>
              <div className='mb-4'>
                <label className='block text-gray-700 mb-1'>Available</label>
                <div className='flex items-center'>
                  <label className='relative inline-flex items-center cursor-pointer'>
                    <input
                      type='checkbox'
                      checked={equipmentFormData.available}
                      onChange={(e) =>
                        setEquipmentFormData({
                          ...equipmentFormData,
                          available: e.target.checked,
                        })
                      }
                      className='sr-only peer'
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer dark:bg-gray-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                  </label>
                  <span className='ml-3 text-sm text-gray-700'>
                    {equipmentFormData.available ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
              {equipmentFormErrors && (
                <div className='mb-4 text-red-600 text-sm'>
                  {equipmentFormErrors}
                </div>
              )}
              <div className='flex justify-end'>
                <button
                  type='button'
                  onClick={() => setShowEquipmentForm(false)}
                  className='mr-3 px-4 py-2 border rounded'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-4 py-2 bg-blue-500 text-white rounded'
                >
                  {editingEquipment ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Delete Confirm */}
      {showDeleteModal && equipmentToDelete && (
        <DeleteConfirmModal
          message={`Are you sure you want to delete equipment "${equipmentToDelete.equipmentName}"?`}
          onConfirm={confirmDeleteEquipment}
          onCancel={cancelDeleteEquipment}
        />
      )}

      {/* Footer cố định ở đáy trang */}
      <Footer className='fixed bottom-0 left-0 w-full' />
    </div>
  );
};

export default ManageEquipmentPage;
