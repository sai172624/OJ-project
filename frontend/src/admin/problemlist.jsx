import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchProblems, deleteProblem } from "../apis/admin";
import { FaTrash, FaEdit } from "react-icons/fa";
import AdminNavbar from "./adminnavbar";
import toast from "react-hot-toast";

const DIFFICULTY_COLORS = {
  Easy: "text-green-400 bg-green-900 border-green-700",
  Medium: "text-yellow-300 bg-yellow-900 border-yellow-700",
  Hard: "text-red-400 bg-red-900 border-red-700",
};

const ProblemList = () => {
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [topics, setTopics] = useState([]);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [selectedTopic, setSelectedTopic] = useState("All");

  const loadProblems = useCallback(async () => {
    try {
      const newProblems = await fetchProblems();
      setProblems(newProblems);
      setFilteredProblems(newProblems);
      const allTopics = new Set();
      newProblems.forEach(p => {
        if (Array.isArray(p.topics)) {
          p.topics.forEach(t => allTopics.add(t));
        }
      });
      setTopics(["All", ...Array.from(allTopics)]);
    } catch (err) {
      console.error("Error loading problems:", err);
    }
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this problem?")) {
      try {
        await deleteProblem(id);
        setProblems(problems.filter((p) => p._id !== id));
        toast.success("Problem deleted successfully.");
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete.");
      }
    }
  };

  useEffect(() => {
    let filtered = [...problems];
    if (search.trim()) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }
    if (difficulty !== "All") {
      filtered = filtered.filter(p => p.difficulty === difficulty);
    }
    if (selectedTopic !== "All") {
      filtered = filtered.filter(p => p.topics?.includes(selectedTopic));
    }
    setFilteredProblems(filtered);
  }, [search, difficulty, selectedTopic, problems]);

  useEffect(() => {
    loadProblems();
  }, [loadProblems]);

  return (
    <>
      <AdminNavbar />
      <main className="max-w-5xl mx-auto px-2 sm:px-4 py-4  min-h-screen">
        <h2 className="text-2xl font-bold text-gray-100 mb-6 flex items-center gap-2">📋 Problem List</h2>
        {/* Filters Section */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4">
          <input
            type="text"
            placeholder="🔍 Search problems..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-700 bg-gray-900 text-gray-100 rounded px-3 py-2 w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="border border-gray-700 bg-gray-900 text-gray-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="border border-gray-700 bg-gray-900 text-gray-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            {topics.map((topic, idx) => (
              <option key={idx} value={topic}>{topic}</option>
            ))}
          </select>
        </div>
        {/* Table */}
        <div className="overflow-x-auto rounded shadow bg-gray-900">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-800 sticky top-0 z-10">
              <tr>
                <th className="py-3 px-2 text-left font-semibold text-gray-300">ID</th>
                <th className="py-3 px-2 text-left font-semibold text-gray-300">Title</th>
                <th className="py-3 px-2 text-left font-semibold text-gray-300">Difficulty</th>
                <th className="py-3 px-2 text-left font-semibold text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProblems.map((p, index) => (
                <tr key={p._id} className="border-b border-gray-800 hover:bg-gray-800 transition">
                  <td className="py-2 px-2 text-gray-200">{index + 1}</td>
                  <td className="py-2 px-2">
                    <Link to={`/admin/solve/${p._id}`} className="text-blue-400 hover:underline font-medium">
                      {p.name}
                    </Link>
                  </td>
                  <td className="py-2 px-2">
                    <span className={`inline-block border rounded-full px-3 py-1 text-xs font-semibold ${DIFFICULTY_COLORS[p.difficulty] || "bg-gray-800 text-gray-300 border-gray-700"}`}>
                      {p.difficulty}
                    </span>
                  </td>
                  <td className="py-2 px-2 flex gap-2 items-center">
                    <Link to={`/admin/edit/${p._id}`}>
                      <FaEdit className="text-yellow-400 hover:text-yellow-300 transition" title="Edit" />
                    </Link>
                    <FaTrash className="text-red-500 hover:text-red-400 cursor-pointer transition" title="Delete" onClick={() => handleDelete(p._id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredProblems.length === 0 && (
          <div className="text-center text-gray-400 py-8">No matching problems found.</div>
        )}
      </main>
    </>
  );
};

export default ProblemList;
