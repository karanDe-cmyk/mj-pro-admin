import React from "react";

const HalfSangam = () => {
  // Mock data for Open Ank and Close Ank numbers
  const openAnk = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const closeAnk = [
    "000", "100", "110", "111", "112", "113", "114", "115",
    "123", "124", "125", "126", "127", "128", "129", "130",
    "133", "134", "135", "136", "137", "138", "139", "140",
    "144", "145", "146", "147", "148", "149", "150", "155",
    "156", "157", "158", "159", "177", "178", "179", "180",
    "188", "189", "190", "199", "200", "222", "223", "224",
    "225", "226", "227", "228", "229", "230", "233", "234",
    "235", "236", "237", "238", "239", "240", "244", "245",
    "246", "247", "248", "249", "250", "255", "256", "257",
    "258", "259", "260", "268", "269", "270", "277", "278",
    "279", "280", "288", "289", "290", "295", "296", "297",
    "298", "299", "300", "330", "333",
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-start justify-start p-10">
      <div className="w-full max-w-6xl bg-white p-6 rounded-md shadow-md">
        <h2 className="text-2xl font-bold mb-6">Half Sangam Numbers</h2>

        {/* Open Ank Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Open Ank</h3>
          <div className="flex flex-wrap gap-4 justify-start">
            {openAnk.map((ank) => (
              <button
                key={ank}
                className="bg-green-100 text-green-800 border border-green-500 font-semibold py-2 px-4 rounded-md hover:shadow-md"
              >
                {ank}
              </button>
            ))}
          </div>
        </div>

        {/* Close Ank Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Close Ank</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-5">
            {closeAnk.map((ank) => (
              <button
                key={ank}
                className="bg-green-100 text-green-800 border border-green-500 font-semibold py-2 px-4 rounded-md hover:shadow-md"
              >
                {ank}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HalfSangam;
