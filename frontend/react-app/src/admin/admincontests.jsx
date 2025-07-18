import React from "react";
import AdminNavbar from "./adminnavbar";

const AdminContests = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <AdminNavbar />
      <main className="flex-1 flex items-center justify-center">
        <div className="bg-gray-900 rounded-2xl shadow-xl p-10 flex flex-col items-center w-full max-w-xl border border-gray-800">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-pink-400 mb-3 text-center">
            Inspire the Next Coding Champions!
          </h2>
          <p className="text-gray-300 mb-6 text-center text-lg">
            Your creativity and problem-setting skills can shape the future of coding competitions.<br />
            Design challenging, fun, and innovative contest problems to ignite the passion of thousands of coders.<br />
            <span className="text-pink-300 font-semibold">Be the architect of legendary contests!</span>
          </p>
        </div>
      </main>
    </div>
  );
};

export default AdminContests; 