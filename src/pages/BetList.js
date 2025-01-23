import React, { useState, useEffect } from 'react';

const BetList = () => {
    const [marketName, setMarketName] = useState('');
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [search, setSearch] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [page, setPage] = useState(1);


    const marketOptions = [
        { id: 1, name: 'Market 1' },
        { id: 2, name: 'Market 2' },
        { id: 3, name: 'Market 3' },
    ];

    const dummyData = [
        { id: 1, memberName: 'John Doe', marketName: 'Market 1', number: '123', amount: 100, date: '2025-01-20', time: '10:00 AM', type: 'Win' },
        { id: 2, memberName: 'Jane Smith', marketName: 'Market 2', number: '456', amount: 200, date: '2025-01-20', time: '11:00 AM', type: 'Loss' },

    ];

    useEffect(() => {
        setData(dummyData);
        setFilteredData(dummyData);
         // eslint-disable-next-line
    }, []);

    useEffect(() => {
        const filtered = data.filter(
            (item) =>
                (!marketName || item.marketName === marketName) &&
                item.memberName.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredData(filtered);
    }, [marketName, search, data]);

    const paginatedData = filteredData.slice(
        (page - 1) * entriesPerPage,
        page * entriesPerPage
    );

    const handleMarketChange = (e) => {
        setMarketName(e.target.value);
        setPage(1);
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-2xl font-bold mb-4">Bet All Game</h2>

            <div className="bg-white shadow-md rounded-md p-4 mb-6">
                <label className="block font-medium mb-1">Select Market Name</label>
                <select
                    value={marketName}
                    onChange={handleMarketChange}
                    className="border border-gray-300 rounded-md p-2 "
                >
                    <option value="">-- Please Select Market Name --</option>
                    {marketOptions.map((market) => (
                        <option key={market.id} value={market.name}>
                            {market.name}
                        </option>
                    ))}
                </select>
            </div>


            <div className="bg-white shadow-md rounded-md p-4">
                <h3 className="text-lg font-semibold mb-4">Member List</h3>

                <div className="flex justify-between items-center mb-4">
                    <div>
                        <label>Show</label>
                        <select
                            className="border border-gray-300 rounded-md p-2 ml-2"
                            value={entriesPerPage}
                            onChange={(e) => {
                                setEntriesPerPage(parseInt(e.target.value));
                                setPage(1);
                            }}
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                        <span className="ml-2">entries</span>
                    </div>
                    <input
                        type="text"
                        placeholder="Search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border border-gray-300 rounded-md p-2"
                    />
                </div>

                <table className="w-full border-collapse border border-gray-300">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="border border-gray-300 p-2">Sr No</th>
                            <th className="border border-gray-300 p-2">Member Name</th>
                            <th className="border border-gray-300 p-2">Market Name</th>
                            <th className="border border-gray-300 p-2">Number</th>
                            <th className="border border-gray-300 p-2">Amount</th>
                            <th className="border border-gray-300 p-2">Date</th>
                            <th className="border border-gray-300 p-2">Time</th>
                            <th className="border border-gray-300 p-2">Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.length > 0 ? (
                            paginatedData.map((item, index) => (
                                <tr key={item.id}>
                                    <td className="border border-gray-300 p-2 text-center">{(page - 1) * entriesPerPage + index + 1}</td>
                                    <td className="border border-gray-300 p-2">{item.memberName}</td>
                                    <td className="border border-gray-300 p-2">{item.marketName}</td>
                                    <td className="border border-gray-300 p-2">{item.number}</td>
                                    <td className="border border-gray-300 p-2">{item.amount}</td>
                                    <td className="border border-gray-300 p-2">{item.date}</td>
                                    <td className="border border-gray-300 p-2">{item.time}</td>
                                    <td className="border border-gray-300 p-2">{item.type}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td className="border border-gray-300 p-2 text-center" colSpan="8">
                                    No data available in table
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className="mt-4 flex justify-between items-center">
                    <button
                        className="bg-gray-300 px-4 py-2 rounded-md"
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                    >
                        Previous
                    </button>
                    <span>
                        Page {page} of {Math.ceil(filteredData.length / entriesPerPage)}
                    </span>
                    <button
                        className="bg-gray-300 px-4 py-2 rounded-md"
                        onClick={() =>
                            setPage((prev) => Math.min(prev + 1, Math.ceil(filteredData.length / entriesPerPage)))
                        }
                        disabled={page === Math.ceil(filteredData.length / entriesPerPage)}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BetList;
