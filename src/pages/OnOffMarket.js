import React, { useState, useEffect } from 'react';

const UpdateMarket = () => {

  const [markets, setMarkets] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const [selectedMarket, setSelectedMarket] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {

    const fetchMarkets = () => {
      const marketData = [
        { id: 1, name: 'Market 1' },
        { id: 2, name: 'Market 2' },
        { id: 3, name: 'Market 3' },
      ];
      setMarkets(marketData);
    };

    const fetchStatuses = () => {
      const statusData = [
        { id: 'active', name: 'Active' },
        { id: 'inactive', name: 'Inactive' },
      ];
      setStatuses(statusData);
    };

    fetchMarkets();
    fetchStatuses();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log('Selected Market:', selectedMarket);
    // console.log('Selected Status:', selectedStatus);
    alert(`Market: ${selectedMarket}, Status: ${selectedStatus}`);
  };

  return (
    <div className="bg-white shadow-md rounded-md p-6 mx-auto">
      <h2 className="text-xl font-bold mb-2">Update Market</h2>
      <p className="text-sm text-gray-600 mb-4">Update All Market</p>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Market Name
          </label>
          <select
            value={selectedMarket}
            onChange={(e) => setSelectedMarket(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          >
            <option value="">-- Please Select Market Name --</option>
            {markets.map((market) => (
              <option key={market.id} value={market.name}>
                {market.name}
              </option>
            ))}
          </select>
        </div>


        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          >
            <option value="">-- Please Select Status --</option>
            {statuses.map((status) => (
              <option key={status.id} value={status.id}>
                {status.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-span-1 sm:col-span-2 flex justify-start sm:justify-center">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
          >
            Update Market
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateMarket;
