import React from 'react'

const TriplePana = () => {

    const numbers = [ 111, 222, 333, 444, 555, 666, 777, 888, 999];

    return (
        <div className="max-w-full bg-gray-100">
            <div className="w-full bg-white p-6 rounded-md shadow-md m-4">
                <h2 className="text-xl font-bold mb-4 text-center">Triple Digit Numbers</h2>
                <div className="grid grid-cols-12 gap-3">
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

export default TriplePana