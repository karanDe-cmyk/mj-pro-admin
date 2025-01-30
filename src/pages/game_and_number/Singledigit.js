import React from 'react'

const Singledigit = () => {
    const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    return (
        <div className="max-w-full bg-gray-100 flex  py-10 px-4   ">
            <div className="w-full bg-white p-6 rounded-md shadow-md m-4 ">
                <h2 className="text-xl font-bold mb-4 text-center">Single Digit Numbers</h2>
                <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-3">
                    {numbers.map((num) => (
                        <button
                            key={num}
                            className="bg-green-100 text-green-800 font-semibold p-3 rounded-md hover:bg-green-200"
                        >
                            {num}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Singledigit;
