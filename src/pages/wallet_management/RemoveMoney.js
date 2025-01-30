import React, { useState } from 'react';

const RemoveMoney = () => {
  const [user, setUser] = useState("9878789878-demo");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Deducted Amount: ${amount} from User: ${user}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md mx-auto">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Deduct Balance In User Wallet</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">User List</label>
                <select
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                >
                  <option value="9878789878-demo">9878789878-demo</option>
                  <option value="1234567890-demo">1234567890-demo</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">Amount</label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                  placeholder="Enter Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RemoveMoney;
