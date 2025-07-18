import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchAdminStats } from "../apis/admin";
import AdminNavbar from "./adminnavbar";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const firstname = localStorage.getItem("firstname") || "Admin";

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProblems: 0,
    totalSubmissions: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchAdminStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };
    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <AdminNavbar />
      <main className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-gray-900 rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-3xl mb-2">👤</span>
            <span className="text-lg font-semibold">Total Users</span>
            <span className="text-2xl font-bold text-green-400 mt-1">{stats.totalUsers}</span>
          </div>
          <div className="bg-gray-900 rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-3xl mb-2">❓</span>
            <span className="text-lg font-semibold">Total Problems</span>
            <span className="text-2xl font-bold text-blue-400 mt-1">{stats.totalProblems}</span>
          </div>
          <div className="bg-gray-900 rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-3xl mb-2">✅</span>
            <span className="text-lg font-semibold">Submissions</span>
            <span className="text-2xl font-bold text-yellow-400 mt-1">{stats.totalSubmissions}</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
