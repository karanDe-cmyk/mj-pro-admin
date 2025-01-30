import React, { useState } from "react";

const BidHistory = () => {
    const [date, setDate] = useState("");
    const [selectedGame, setSelectedGame] = useState("");
    const [search, setSearch] = useState("");

    const gameOptions = [
        "Game 1", "Game 2", "Game 3", "Game 4"
    ];

    const bidHistoryData = [];

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">Bid History Report</h2>

            <div className="bg-white p-4 shadow-md rounded-lg flex flex-wrap gap-4 items-center justify-between">
                <div className="w-full sm:w-auto">
                    <label className="font-semibold block">Result Date</label>
                    <input
                        type="date"
                        className="border px-3 py-2 rounded w-full sm:w-auto"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
                <div className="w-full sm:w-auto">
                    <label className="font-semibold block">Game Name</label>
                    <select
                        className="border px-3 py-2 rounded w-full sm:w-auto"
                        value={selectedGame}
                        onChange={(e) => setSelectedGame(e.target.value)}
                    >
                        <option value="">- Please Select Game -</option>
                        {gameOptions.map((game, index) => (
                            <option key={index} value={game}>{game}</option>
                        ))}
                    </select>
                </div>
                <div className="w-full sm:w-auto">
                    <label className="font-semibold block">Number</label>
                    <input
                        type="text"
                        className="border px-3 py-2 rounded w-full sm:w-auto"
                        placeholder="Enter Number"
                    />
                </div>
                <div className="mt-4  ">

                    <button className="bg-blue-500 mr-4 text-white px-4 py-2 rounded flex-1 sm:flex-none">Declare Result</button>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded flex-1 sm:flex-none">Declare Allot</button>
                </div>

            </div>
            <button className=" bg-blue-500 mt-4 text-white px-4 py-2 rounded">Show Winner List</button>



            <div className="mt-6 bg-white p-4 shadow-md rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Bid History List</h3>
                <div className="flex justify-between mb-2">
                    <div>
                        Show
                        <select className="border px-2 py-1 mx-2 rounded">
                            <option>10</option>
                            <option>25</option>
                            <option>50</option>
                        </select>
                        entries
                    </div>
                    <input
                        type="text"
                        className="border px-3 py-2 rounded"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <table className="min-w-full bg-white border">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="py-2 px-4 border">Sr No</th>
                            <th className="py-2 px-4 border">Member Name</th>
                            <th className="py-2 px-4 border">Betting Amount</th>
                            <th className="py-2 px-4 border">Betting Number</th>
                            <th className="py-2 px-4 border">Betting Time</th>
                            <th className="py-2 px-4 border">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bidHistoryData.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-4">No data available in table</td>
                            </tr>
                        ) : (
                            bidHistoryData.map((bid, index) => (
                                <tr key={index} className="border-b">
                                    <td className="py-2 px-4 border">{index + 1}</td>
                                    <td className="py-2 px-4 border">{bid.memberName}</td>
                                    <td className="py-2 px-4 border">{bid.bettingAmount}</td>
                                    <td className="py-2 px-4 border">{bid.bettingNumber}</td>
                                    <td className="py-2 px-4 border">{bid.bettingTime}</td>
                                    <td className="py-2 px-4 border">
                                        <button className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                <div className="flex justify-between mt-4">
                    <span>Showing 0 to 0 of 0 entries</span>
                    <div>
                        <button className="px-3 py-1 border rounded-l bg-gray-300">Previous</button>
                        <button className="px-3 py-1 border rounded-r bg-gray-300">Next</button>
                    </div>
                </div>
            </div>

            <div className="mt-6 bg-white p-4 shadow-md rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Game Result History</h3>
                <p className="text-center text-gray-600">No data available</p>
            </div>
        </div>
    );
};

export default BidHistory;
