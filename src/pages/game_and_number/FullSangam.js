import React from "react";

const FullSangam = () => {
  // Generate numbers from 000 to 999
  const generateNumbers = () => {
    const numbers = [];
    for (let i = 0; i <= 999; i++) {
      numbers.push(i.toString().padStart(3, "0"));
    }
    return numbers;
  };

  const numbers = generateNumbers();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-start justify-start p-10">
      <div className="w-full max-w-6xl bg-white p-6 rounded-md shadow-md">
        <h2 className="text-2xl font-bold mb-6">Full Sangam Numbers</h2>

        {/* Open Ank Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Open Ank</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-3">
            {numbers.map((number) => (
              <button
                key={`open-${number}`}
                className="bg-green-100 text-green-800 border border-green-500 font-semibold py-2 px-4 rounded-md hover:shadow-lg"
              >
                {number}
              </button>
            ))}
          </div>
        </div>

        {/* Close Ank Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Close Ank</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-3">
            {numbers.map((number) => (
              <button
                key={`close-${number}`}
                className="bg-green-100 text-green-800 border border-green-500 font-semibold py-2 px-4 rounded-md hover:shadow-lg"
              >
                {number}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullSangam;
