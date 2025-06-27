import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { fetchProblems, deleteProblem } from "../apis/adminproblem";
import { FaTrash, FaEdit } from "react-icons/fa";
import "../css/problemList.css";

const ProblemList = () => {
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [topics, setTopics] = useState([]);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [selectedTopic, setSelectedTopic] = useState("All");

  // Load all problems from backend
  const loadProblems = useCallback(async () => {
    try {
      const newProblems = await fetchProblems();
      setProblems(newProblems);
      setFilteredProblems(newProblems);

      // Extract unique topics
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

  // Delete handler
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete this problem?")) {
      try {
        await deleteProblem(id);
        const updated = problems.filter(p => p._id !== id);
        setProblems(updated);
        setFilteredProblems(updated);
      } catch (err) {
        alert("Failed to delete.");
        console.error(err);
      }
    }
  };
  

  // Filter logic
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProblems.map((p, index) => (
            <tr key={p._id}>
              <td>{index + 1}</td>
              <td>
                <Link to={`/admin/solve/${p._id}`} className="title-link">
                  {p.name}
                </Link>
              </td>
              <td>
                <span className={`difficulty-tag ${p.difficulty.toLowerCase()}`}>
                  {p.difficulty}
                </span>
              </td>
              <td>
               <Link to={`/admin/edit/${p._id}`}>
  <FaEdit className="action-icon edit-icon" title="Edit" />
</Link>

                <FaTrash className="icon delete" title="Delete" onClick={() => handleDelete(p._id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredProblems.length === 0 && <p>No matching problems found.</p>}
    </div>
  );
};

export default ProblemList;
