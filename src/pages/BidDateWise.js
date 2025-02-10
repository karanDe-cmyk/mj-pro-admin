import React, { useState } from "react";

const BidDateWise = () => {
    const [date, setDate] = useState("");
    const members = [
        {
            id: 1,
            memberName: "John Doe",
            marketName: "Market A",
            number: "123",
            amount: "500",
            date: "20-01-2025",
            time: "10:00 AM",
            type: "Win",
        },
        {
            id: 2,
            memberName: "Jane Smith",
            marketName: "Market B",
            number: "456",
            amount: "300",
            date: "20-01-2025",
            time: "11:00 AM",
            type: "Lose",
        },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log("Selected Date:", date);
        
    };

    return (
        <div className="p-4">

            <div className="bg-white shadow-md rounded-md p-4 mb-6 ">
                <h2 className="text-lg font-semibold mb-4">Bet All Game</h2>
                <form className="flex items-end gap-4 " onSubmit={handleSubmit}>


                    <div className="flex-2">
                        <label className="block font-medium mb-1">Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                        Submit
                    </button>
                </form>
            </div>

            <div className="bg-white shadow-md rounded-md p-4">
                <h2 className="text-lg font-semibold mb-4">Member List</h2>
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="border border-gray-300 p-2">Sr No</th>
                            <th className="border border-gray-300 p-2">Member Name</th>
                            <th className="border border-gray-300 p-2">Market Name</th>
                            <th className="border border-gray-300 p-2">Number</th>
                            <th className="border border-gray-300 p-2">Amount</th>
                            <th className="border border-gray-300 p-2">Date</th>
                            <th className="border border-gray-300 p-2">Time</th>
                            <th className="border border-gray-300 p-2">Type</th>
                            <th className="border border-gray-300 p-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.length > 0 ? (
                            members.map((member, index) => (
                                <tr key={member.id} className="text-center">
                                    <td className="border border-gray-300 p-2">{index + 1}</td>
                                    <td className="border border-gray-300 p-2">
                                        {member.memberName}
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                        {member.marketName}
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                        {member.number}
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                        {member.amount}
                                    </td>
                                    <td className="border border-gray-300 p-2">{member.date}</td>
                                    <td className="border border-gray-300 p-2">{member.time}</td>
                                    <td className="border border-gray-300 p-2">{member.type}</td>
                                    <td className="border border-gray-300 p-2">
                                        <button className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600">
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="9"
                                    className="text-center border border-gray-300 p-2"
                                >
                                    No Data Found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BidDateWise;
