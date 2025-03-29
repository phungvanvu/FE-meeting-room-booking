import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GroupManagement = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [groups, setGroups] = useState([
    { id: 1, name: 'DU3.1', division: 'IT', location: '789 Tower' },
    { id: 2, name: 'DKR1', division: 'HR', location: 'Thành Công Building' },
    { id: 3, name: 'DJ2', division: 'Kế toán', location: 'The Wét Building' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);

  const locations = [
    '789 Tower',
    'Thành Công Building',
    'The Wét Building',
    'CMC Coporation',
  ];

  const handleAddGroup = () => {
    setCurrentGroup(null);
    setShowForm(true);
  };

  const handleEditGroup = (group) => {
    setCurrentGroup(group);
    setShowForm(true);
  };

  const handleDeleteGroup = (id) => {
    setGroupToDelete(id);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    setGroups(groups.filter((group) => group.id !== groupToDelete));
    setShowConfirm(false);
  };

  const cancelDelete = () => {
    setShowConfirm(false);
  };

  const saveGroup = (newGroup) => {
    if (currentGroup) {
      setGroups(
        groups.map((group) =>
          group.id === currentGroup.id ? newGroup : group,
        ),
      );
    } else {
      setGroups([...groups, { ...newGroup, id: groups.length + 1 }]);
    }
    setShowForm(false);
  };

  return (
    <div className='flex flex-col p-6 max-w-4xl mx-auto space-y-6 min-h-screen'>
      <div className='flex items-center mb-4'>
        <button
          onClick={() => navigate('/user-management')}
          className='text-blue-500 mr-4 text-lg'
        >
          &larr; Quay lại
        </button>
        <h2 className='text-center text-2xl font-bold flex-grow'>
          Danh sách Nhóm{' '}
        </h2>
      </div>

      <div className='flex items-center mb-4'>
        <input
          type='text'
          placeholder='Tìm kiếm theo tên...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='border rounded w-full p-2 mr-2'
        />
        <button
          onClick={handleAddGroup}
          className='border border-blue-700 text-blue-700 rounded py-2 px-4 hover:bg-blue-700 hover:text-white transition'
        >
          Thêm
        </button>
      </div>

      <table className='min-w-full bg-white border border-gray-300'>
        <thead>
          <tr className='bg-gray-200'>
            <th className='py-2 px-4 border'>Tên</th>
            <th className='py-2 px-4 border'>Division</th>
            <th className='py-2 px-4 border'>Location</th>
            <th className='py-2 px-4 border'>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {groups
            .filter((group) =>
              group.name.toLowerCase().includes(searchTerm.toLowerCase()),
            ) // Lọc theo tên
            .map((group) => (
              <tr
                key={group.id}
                className='border-b hover:bg-gray-100 transition'
              >
                <td className='py-2 px-4 border'>{group.name}</td>
                <td className='py-2 px-4 border'>{group.division}</td>
                <td className='py-2 px-4 border'>{group.location}</td>
                <td className='py-2 px-4 border text-center'>
                  <button
                    onClick={() => handleEditGroup(group)}
                    className='text-blue-500 hover:text-blue-700 transition'
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDeleteGroup(group.id)}
                    className='text-red-500 hover:text-red-700 transition ml-2'
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {showForm && (
        <GroupForm
          currentGroup={currentGroup}
          onSave={saveGroup}
          onCancel={() => setShowForm(false)}
          locations={locations}
        />
      )}

      {showConfirm && (
        <div className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-30'>
          <div className='bg-white p-6 rounded-lg shadow-lg'>
            <h2 className='text-lg font-bold mb-4'>Xác nhận xóa</h2>
            <p>Bạn có chắc chắn muốn xóa nhóm này?</p>
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
    </div>
  );
};

const GroupForm = ({ currentGroup, onSave, onCancel, locations }) => {
  const [name, setName] = useState(currentGroup ? currentGroup.name : '');
  const [division, setDivision] = useState(
    currentGroup ? currentGroup.division : '',
  );
  const [location, setLocation] = useState(
    currentGroup ? currentGroup.location : '',
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      id: currentGroup ? currentGroup.id : null,
      name,
      division,
      location,
    });
  };

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-30'>
      <div
        className='bg-white p-6 rounded-lg shadow-lg'
        style={{ width: '400px' }}
      >
        <h2 className='text-xl font-bold mb-4'>
          {currentGroup ? 'Sửa Nhóm' : 'Thêm Nhóm'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label className='block mb-1'>Tên:</label>
            <input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='border rounded w-full p-2'
              required
            />
          </div>
          <div className='mb-4'>
            <label className='block mb-1'>Division:</label>
            <input
              type='text'
              value={division}
              onChange={(e) => setDivision(e.target.value)}
              className='border rounded w-full p-2'
              required
            />
          </div>
          <div className='mb-4'>
            <label className='block mb-1'>Location:</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className='border rounded w-full p-2'
              required
            >
              {locations.map((loc, index) => (
                <option key={index} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
          <div className='flex justify-end'>
            <button
              type='submit'
              className='border border-blue-700 text-blue-700 rounded py-2 px-4 hover:bg-blue-700 hover:text-white transition mr-2'
            >
              Lưu
            </button>
            <button
              type='button'
              onClick={onCancel}
              className='border border-gray-300 text-black rounded py-2 px-4 hover:bg-gray-200 transition'
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GroupManagement;
