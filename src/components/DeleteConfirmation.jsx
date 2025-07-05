import React from 'react';

const DeleteConfirmation = ({ isOpen, onClose, onConfirm, tokenName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
        <p>Are you sure you want to delete <strong></strong>?</p>
        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="text-gray-600">Cancel</button>
          <button onClick={onConfirm} className="bg-red-600 text-white px-4 py-2 rounded-lg">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
