import React from 'react'

const DoublePana = () => {
    const doubleAnkData = {
        0: ["500", "136", "555", "190", "456", "280", "370", "479", "460"],
        1: ["100", "137", "146", "236", "245", "290", "380", "470", "489"],
        2: ["200", "138", "147", "156", "237", "246", "345", "390", "480"],
        3: ["300", "139", "148", "157", "238", "247", "256", "346", "490"],
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10 px-4">
            <div className="w-full max-w-6xl bg-white p-6 rounded-md shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Double Pana Numbers</h2>
                {Object.entries(doubleAnkData).map(([ank, numbers]) => (
                    <div key={ank} className="mb-6">
                        <div className="mb-2">
                            <p className="text-lg font-semibold text-gray-700">Single Ank</p>
                        </div>

                        <div className="flex justify-start mb-4">
                            <div className="bg-red-500 text-white text-xl font-semibold py-2 px-4 rounded-md shadow-md">
                                {ank}
                            </div>
                        </div>

                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-3">
                            {numbers.map((number) => (
                                <button
                                    key={number}
                                    className="bg-green-100 text-green-800 border border-green-500 font-semibold p-4 rounded-md hover:shadow-lg"
                                >
                                    {number}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DoublePana;
