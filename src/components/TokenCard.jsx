import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

const TokenCard = ({ token, onEdit, onDelete }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
     
      <div className="text-sm text-gray-600 break-all">{token.token}</div>
      
      <div className="flex justify-end gap-2 mt-4">
        <button onClick={() => onEdit(token)} className="text-blue-600 hover:text-blue-800">
          <Pencil size={18} />
        </button>
        <button onClick={() => onDelete(token)} className="text-red-600 hover:text-red-800">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default TokenCard;
