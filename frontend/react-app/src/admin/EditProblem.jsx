 import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUpdateFormData,updateProblem } from "../apis/adminproblem";

import "../css/addProblem.css";

const EditProblem = () => {
  const { problemId } = useParams();
  const navigate = useNavigate();

  const [problemData, setProblemData] = useState({
    name: "",
    statement: "",
    code: "",
    difficulty: "",
    topics: ""
  });

  const [sampleTestcases, setSampleTestcases] = useState([{ input: "", expectedOutput: "" }]);
  const [hiddenTestcases, setHiddenTestcases] = useState([{ input: "", expectedOutput: "" }]);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await getUpdateFormData(problemId);
        setProblemData({
          name: res.problem.name,
          statement: res.problem.statement,
          code: res.problem.code,
          difficulty: res.problem.difficulty,
          topics: res.problem.topics.join(", ")
        });
        setSampleTestcases(res.sampleTestcases);
        setHiddenTestcases(res.hiddenTestcases);
      } catch (err) {
        console.error("Error fetching problem:", err);
        alert("Failed to load problem");
      }
    };

    fetchProblem();
  }, [problemId]);

  const handleProblemChange = (e) => {
    setProblemData({ ...problemData, [e.target.name]: e.target.value });
  };

  const handleChange = (list, setList, index, e) => {
    const updated = [...list];
    updated[index][e.target.name] = e.target.value;
    setList(updated);
  };

  const addTestcase = (setList) => {
    setList(prev => [...prev, { input: "", expectedOutput: "" }]);
  };

  const removeTestcase = (list, setList, index) => {
    const updated = list.filter((_, i) => i !== index);
    setList(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...problemData,
      topics: problemData.topics.split(",").map((t) => t.trim()),
      sampleTestcases,
      hiddenTestcases,
    };

    try {
      await updateProblem(problemId, payload);
      alert("Problem updated successfully!");
      navigate("/admin/problemlist");
    } catch (err) {
      console.error("Error updating problem:", err);
      alert("Update failed. Try again.");
    }
  };

  return (
    <div className="add-problem-container">
      <h2>Edit Problem</h2>
      <form onSubmit={handleSubmit} className="problem-form">
        <label>Problem Name:</label>
        <input name="name" value={problemData.name} onChange={handleProblemChange} required />

        <label>Statement:</label>
        <textarea name="statement" value={problemData.statement} onChange={handleProblemChange} rows={5} required />

        <label>Unique Code:</label>
        <input name="code" value={problemData.code} onChange={handleProblemChange} required />

        <label>Difficulty:</label>
        <input name="difficulty" value={problemData.difficulty} onChange={handleProblemChange} required />

        <label>Topics (comma-separated):</label>
        <input name="topics" value={problemData.topics} onChange={handleProblemChange} required />

        <h3>Sample Testcases</h3>
        {sampleTestcases.map((t, index) => (
          <div key={index} className="testcase-box">
            <textarea name="input" value={t.input} onChange={(e) => handleChange(sampleTestcases, setSampleTestcases, index, e)} rows={2} required />
            <textarea name="expectedOutput" value={t.expectedOutput} onChange={(e) => handleChange(sampleTestcases, setSampleTestcases, index, e)} rows={2} required />
            {sampleTestcases.length > 1 && (
              <button type="button" className="remove-btn" onClick={() => removeTestcase(sampleTestcases, setSampleTestcases, index)}>🗑</button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => addTestcase(setSampleTestcases)}>+ Add Sample Testcase</button>

        <h3>Hidden Testcases</h3>
        {hiddenTestcases.map((t, index) => (
          <div key={index} className="testcase-box">
            <textarea name="input" value={t.input} onChange={(e) => handleChange(hiddenTestcases, setHiddenTestcases, index, e)} rows={2} required />
            <textarea name="expectedOutput" value={t.expectedOutput} onChange={(e) => handleChange(hiddenTestcases, setHiddenTestcases, index, e)} rows={2} required />
            {hiddenTestcases.length > 1 && (
              <button type="button" className="remove-btn" onClick={() => removeTestcase(hiddenTestcases, setHiddenTestcases, index)}>🗑</button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => addTestcase(setHiddenTestcases)}>+ Add Hidden Testcase</button>

        <br />
        <button type="submit" className="submit-btn">Save Changes</button>
      </form>
    </div>
  );
};

export default EditProblem;
