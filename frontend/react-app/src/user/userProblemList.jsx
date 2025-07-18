import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { fetchProblems } from "../apis/admin";
import { getAllUserSubmissions } from "../apis/submission";
import UserNavbar from "./usernavbar";

const DIFFICULTY_COLORS = {
  Easy: "text-green-400 bg-green-900 border-green-700",
  Medium: "text-yellow-300 bg-yellow-900 border-yellow-700",
  Hard: "text-red-400 bg-red-900 border-red-700",
};

const UserProblemList = () => {
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [topics, setTopics] = useState([]);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [submissionMap, setSubmissionMap] = useState({});

  const userId = localStorage.getItem("userId");

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

  const loadSubmissions = useCallback(async () => {
    try {
      const subs = await getAllUserSubmissions(userId);
      const map = {};
      subs.forEach(sub => {
        const pid = sub.problemId;
        if (!map[pid]) {
          map[pid] = { submissions: [], hasAccepted: false };
        }
        map[pid].submissions.push(sub);
        if (sub.verdict === "Accepted") {
          map[pid].hasAccepted = true;
        }
      });
      setSubmissionMap(map);
    } catch (err) {
      console.error("Failed to load user submissions:", err);
    }
  }, [userId]);

  useEffect(() => {
    loadProblems();
    loadSubmissions();
  }, [loadProblems, loadSubmissions]);

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

  const getStatus = (problemId) => {
    const status = submissionMap[problemId];
    if (!status) return null;
    if (status.hasAccepted) return { text: "Accepted", color: "text-green-400", icon: "✔️" };
    if (status.submissions.length > 0) return { text: "Not Accepted", color: "text-red-400", icon: "❌" };
    return null;
  };

  // Progress ring
  const totalProblems = problems.length;
  const solvedProblems = problems.filter(p => submissionMap[p._id]?.hasAccepted).length;
  const percentage = totalProblems === 0 ? 0 : Math.round((solvedProblems / totalProblems) * 100);
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="min-h-screen w-full bg-gray-950">
      <UserNavbar />
      <main className="px-1 sm:px-4 py-4 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-100 flex items-center gap-2">📋 Practice Problems</h2>
            <p className="text-gray-400 text-sm mt-1">Filter and solve problems. Track your progress.</p>
          </div>
          <div className="flex flex-col items-center">
            <svg width="90" height="90">
              <circle cx="45" cy="45" r={radius} stroke="#334155" strokeWidth="10" fill="transparent" />
              <circle
                cx="45"
                cy="45"
                r={radius}
                stroke="#22c55e"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
              />
              <text x="45" y="52" textAnchor="middle" fontSize="18" fill="#e5e7eb" fontWeight="bold">
                {percentage}%
              </text>
            </svg>
            <div className="text-xs text-gray-400 mt-1">{solvedProblems}/{totalProblems} solved</div>
          </div>
        </div>

        {/* Filters */}
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
                <th className="py-3 px-2 text-left font-semibold text-gray-300">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredProblems.map((p, index) => {
                const status = getStatus(p._id);
                return (
                  <tr key={p._id} className="border-b border-gray-800 hover:bg-gray-800 transition">
                    <td className="py-2 px-2 text-gray-200">{index + 1}</td>
                    <td className="py-2 px-2">
                      <Link
                        to={`/user/solve/${p._id}`}
                        className="block sm:inline text-blue-400 hover:text-blue-300 font-semibold text-base sm:text-sm px-2 py-1 rounded transition focus:outline-none focus:ring-2 focus:ring-blue-400"
                        style={{ wordBreak: 'break-word' }}
                      >
                        {p.name}
                      </Link>
                    </td>
                    <td className="py-2 px-2">
                      <span className={`inline-block border rounded-full px-3 py-1 text-xs font-semibold ${DIFFICULTY_COLORS[p.difficulty] || "bg-gray-800 text-gray-300 border-gray-700"}`}>
                        {p.difficulty}
                      </span>
                    </td>
                    <td className="py-2 px-2">
                      {status ? (
                        <span className={`inline-flex items-center gap-1 font-medium ${status.color}`}>
                          <span>{status.icon}</span> {status.text}
                        </span>
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredProblems.length === 0 && (
          <div className="text-center text-gray-400 py-8">No matching problems found.</div>
        )}
      </main>
    </div>
  );
};

export default UserProblemList;
