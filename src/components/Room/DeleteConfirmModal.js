import React from 'react';

export default function DeleteConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50'>
      <div className='bg-white rounded-xl shadow-xl p-8 max-w-sm w-full'>
        <h3 className='text-2xl font-semibold text-gray-800 text-center mb-4'>
          Confirm deletion
        </h3>
        <p className='text-center text-gray-600 mb-6'>{message}</p>
        <div className='flex justify-center space-x-4'>
          <button
            onClick={onCancel}
            className='px-5 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 transition'
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className='px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition'
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
