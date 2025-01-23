import React, { useState } from "react";

const UserBidHistory = () => {

    const [filters, setFilters] = useState({
        date: "2025-01-20",
        marketName: "",
        gameName: "",
    });

    const [bidHistory, setBidHistory] = useState([]);

    const markets = ["Market 1", "Market 2", "Market 3"];
    const games = ["Game 1", "Game 2", "Game 3"];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        console.log("Filters applied:", filters);

        const filteredData = [
            {
                id: 1,
                userMobile: "1234567890",
                gameName: "Game 1",
                paanaAndDigit: "Paana 123",
                points: 100,
                date: "2025-01-20",
                time: "10:00 AM",
                type: "Win",
            },
        ];
        setBidHistory(filteredData);
    };

    return (
        <div className="p-6">

            <div className="bg-white p-6 rounded-md shadow-md mb-6">
                <h1 className="text-2xl font-bold mb-4">Bid History Report</h1>
                <form className="grid grid-cols-3 gap-4" onSubmit={handleFilterSubmit}>

                    <div>
                        <label className="block font-medium mb-1">Select Date</label>
                        <input
                            type="date"
                            name="date"
                            value={filters.date}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Market Name</label>
                        <select
                            name="marketName"
                            value={filters.marketName}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-md p-2"
                        >
                            <option value="">- Please Select Market Name -</option>
                            {markets.map((market, index) => (
                                <option key={index} value={market}>
                                    {market}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Game Name</label>
                        <select
                            name="gameName"
                            value={filters.gameName}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-md p-2"
                        >
                            <option value="">- Please Select Game Name -</option>
                            {games.map((game, index) => (
                                <option key={index} value={game}>
                                    {game}
                                </option>
                            ))}
                        </select>
                    </div>


                </form>
                <div className="flex items-end mt-4">
                    <button
                        type="submit"
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                    >
                        Submit
                    </button>
                </div>
            </div>


            <div className="bg-white p-6 rounded-md shadow-md">
                <h2 className="text-xl font-bold mb-4">Bid History List</h2>
                <table className="w-full border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-2">Sr No</th>
                            <th className="border p-2">User Mobile</th>
                            <th className="border p-2">Game Name</th>
                            <th className="border p-2">Paana and Digit</th>
                            <th className="border p-2">Points</th>
                            <th className="border p-2">Date</th>
                            <th className="border p-2">Time</th>
                            <th className="border p-2">Type</th>
                            <th className="border p-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bidHistory.length > 0 ? (
                            bidHistory.map((bid, index) => (
                                <tr key={bid.id} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                                    <td className="border p-2">{index + 1}</td>
                                    <td className="border p-2">{bid.userMobile}</td>
                                    <td className="border p-2">{bid.gameName}</td>
                                    <td className="border p-2">{bid.paanaAndDigit}</td>
                                    <td className="border p-2">{bid.points}</td>
                                    <td className="border p-2">{bid.date}</td>
                                    <td className="border p-2">{bid.time}</td>
                                    <td className="border p-2">{bid.type}</td>
                                    <td className="border p-2">
                                        <button className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-green-500">
                                            Bid Reverse
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="text-center p-4">
                                    No Data Found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className="mt-4 flex justify-between">
                    <span>Showing 0 to 0 of 0 entries</span>
                    <div>
                        <button className="bg-gray-300 text-gray-700 px-3 py-1 rounded-md mr-2" disabled>
                            Previous
                        </button>
                        <button className="bg-gray-300 text-gray-700 px-3 py-1 rounded-md" disabled>
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserBidHistory;
