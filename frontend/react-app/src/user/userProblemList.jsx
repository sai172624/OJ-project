import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { fetchProblems } from "../apis/adminproblem"; // still using same fetch
import "../css/problemList.css";

const UserProblemList = () => {
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

  useEffect(() => {
    loadProblems();
  }, [loadProblems]);

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

  return (
    <div className="problem-list-page">
      <h2>📋 Problem List</h2>

      {/* Filters Section */}
      <div className="filters">
        <input
          type="text"
          placeholder="🔍 Search problems..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="All">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <select value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)}>
          {topics.map((topic, idx) => (
            <option key={idx} value={topic}>{topic}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <table className="problem-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Difficulty</th>
          </tr>
        </thead>
        <tbody>
          {filteredProblems.map((p, index) => (
            <tr key={p._id}>
              <td>{index + 1}</td>
              <td>
                <Link to={`/user/solve/${p._id}`} className="title-link">
                  {p.name}
                </Link>
              </td>
              <td>
                <span className={`difficulty-tag ${p.difficulty.toLowerCase()}`}>
                  {p.difficulty}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredProblems.length === 0 && <p>No matching problems found.</p>}
    </div>
  );
};

export default UserProblemList;
