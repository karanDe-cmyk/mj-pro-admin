import React from "react";

const SinglePana = () => {

  const singleAnkData = {
    0: ["127", "136", "145", "190", "235", "280", "370", "479", "460", "569", "389", "578"],
    1: ["128", "137", "146", "236", "245", "290", "380", "470", "489", "560", "678", "579"],
    2: ["129", "138", "147", "156", "237", "246", "345", "390", "480", "570", "679", "589"],
    3: ["120", "139", "148", "157", "238", "247", "256", "346", "490", "580", "670", "689"],
    4: ["130", "149", "158", "167", "239", "248", "257", "347", "356", "590", "680", "789"],
    5: ["140", "159", "168", "230", "249", "258", "267", "348", "357", "456", "690", "780"],
    6: ["123", "150", "169", "178", "240", "259", "268", "349", "358", "367", "457", "790"],
    7: ["124", "160", "278", "179", "250", "269", "340", "359", "368", "458", "467", "890"],
    8: ["125", "134", "170", "189", "260", "279", "350", "369", "468", "378", "459", "567"],
    9: ["126", "135", "180", "234", "270", "289", "360", "379", "450", "469", "478", "568"],
    0: ["127", "136", "145", "190", "235", "280", "370", "389", "460", "479", "569", "578"]
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-6xl bg-white p-6 rounded-md shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Single Pana Numbers</h2>
        {Object.entries(singleAnkData).map(([ank, numbers]) => (
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

export default SinglePana;