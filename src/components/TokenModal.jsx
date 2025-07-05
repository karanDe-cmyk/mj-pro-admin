import React, { useState, useEffect } from 'react';

const TokenModal = ({ isOpen, onClose, onSave, editingToken }) => {
  const [form, setForm] = useState({ name: '', token: '', description: '', status: 'active' });

  useEffect(() => {
    if (editingToken) {
      setForm(editingToken);
    } else {
      setForm({ name: '', token: '', description: '', status: 'active' });
    }
  }, [editingToken]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">{editingToken ? 'Edit Token' : 'Add Token'}</h2>
       
        <input
          className="w-full mb-3 p-2 border rounded"
          placeholder="Token"
          value={form.token}
          onChange={(e) => setForm({ ...form, token: e.target.value })}
        />
      
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="text-gray-600">Cancel</button>
          <button onClick={() => onSave(form)} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Save</button>
        </div>
      </div>
    </div>
  );
};

export default TokenModal;
