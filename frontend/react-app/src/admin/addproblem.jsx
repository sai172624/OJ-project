import { useState } from "react";
import { addProblemWithTestcases } from "../apis/adminproblem";

import "../css/addProblem.css";

const AddProblem = () => {
  const [problemData, setProblemData] = useState({
    name: "",
    statement: "",
    code: "",
    difficulty: "",
    topics: ""
  });

  const [sampleTestcases, setSampleTestcases] = useState([{ input: "", expectedOutput: "" }]);
  const [hiddenTestcases, setHiddenTestcases] = useState([{ input: "", expectedOutput: "" }]);

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
    try {
      const payload = {
        ...problemData,
        topics: problemData.topics.split(",").map((t) => t.trim()),
        sampleTestcases,
        hiddenTestcases
      };

      const response = await addProblemWithTestcases(payload);
      console.log("Success:", response);
      alert("Problem and testcases added successfully!");

      setProblemData({ name: "", statement: "", code: "", difficulty: "", topics: "" });
      setSampleTestcases([{ input: "", expectedOutput: "" }]);
      setHiddenTestcases([{ input: "", expectedOutput: "" }]);
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to add problem.");
    }
  };

  return (
    <div className="add-problem-container">
      <h2>Add New Problem</h2>
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
            <textarea
              name="input"
              placeholder="Input"
              value={t.input}
              onChange={(e) => handleChange(sampleTestcases, setSampleTestcases, index, e)}
              rows={2}
              required
            />
            <textarea
              name="expectedOutput"
              placeholder="Expected Output"
              value={t.expectedOutput}
              onChange={(e) => handleChange(sampleTestcases, setSampleTestcases, index, e)}
              rows={2}
              required
            />
            {sampleTestcases.length > 1 && (
              <button type="button" className="remove-btn" onClick={() => removeTestcase(sampleTestcases, setSampleTestcases, index)}>🗑 Remove</button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => addTestcase(setSampleTestcases)}>+ Add Sample Testcase</button>

        <h3>Hidden Testcases</h3>
        {hiddenTestcases.map((t, index) => (
          <div key={index} className="testcase-box">
            <textarea
              name="input"
              placeholder="Input"
              value={t.input}
              onChange={(e) => handleChange(hiddenTestcases, setHiddenTestcases, index, e)}
              rows={2}
              required
            />
            <textarea
              name="expectedOutput"
              placeholder="Expected Output"
              value={t.expectedOutput}
              onChange={(e) => handleChange(hiddenTestcases, setHiddenTestcases, index, e)}
              rows={2}
              required
            />
            {hiddenTestcases.length > 1 && (
              <button type="button" className="remove-btn" onClick={() => removeTestcase(hiddenTestcases, setHiddenTestcases, index)}>🗑 Remove</button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => addTestcase(setHiddenTestcases)}>+ Add Hidden Testcase</button>

        <br />
        <button type="submit" className="submit-btn">🚀 Submit Problem</button>
      </form>
    </div>
  );
};

export default AddProblem;
