import React from "react";
import UserNavbar from "./usernavbar";

const Contests = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <UserNavbar />
      <main className="flex-1 flex items-center justify-center">
        <div className="bg-gray-900 rounded-2xl shadow-2xl p-10 flex flex-col items-center max-w-lg w-full">
          <h2 className="text-3xl font-extrabold text-blue-400 mb-3">Contests Coming Soon!</h2>
          <p className="text-gray-300 mb-6 text-center text-lg">
            Get ready to compete with the best!<br />
            Our coding contests will challenge your skills, boost your ranking, and bring out the champion in you.<br />
            Stay tuned for adrenaline-pumping competitions, exciting prizes, and a chance to prove your coding prowess!
          </p>
          <div className="bg-gradient-to-r from-blue-500 to-green-400 text-white font-bold rounded-lg px-8 py-4 mt-2 shadow-lg text-lg">
            Contests are not yet added!
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contests; 