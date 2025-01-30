import React from "react";

const JodiDigit = () => {

  const jodiNumbers = Array.from({ length: 100 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-6xl bg-white p-6 rounded-md shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Jodi Digit Numbers</h2>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-3">
          {jodiNumbers.map((num) => (
            <button
              key={num}
              className="bg-green-100 text-green-800 font-semibold p-3 rounded-md hover:bg-green-200 text-center"
            >
              {num}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JodiDigit;
