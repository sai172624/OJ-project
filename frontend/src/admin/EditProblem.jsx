import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminNavbar from "./adminnavbar";
import Split from "react-split";
import Editor from "@monaco-editor/react";
import { getUpdateFormData, updateProblem } from "../apis/admin";
import { runCode, verifyCode } from "../apis/compiler";
import "../index.css";
import toast from "react-hot-toast";

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
  const [sampleTestcases, setSampleTestcases] = useState([]);
  const [hiddenTestcases, setHiddenTestcases] = useState([]);
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState("");
  const [testInput, setTestInput] = useState("");
  const [testOutputHtml, setTestOutputHtml] = useState("");
  const [runLoading, setRunLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const templates = {
    cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // your code goes here\n    return 0;\n}`,
    c: `#include <stdio.h>\n\nint main() {\n    // your code goes here\n    return 0;\n}`,
    java: `public class Main {\n    public static void main(String[] args) {\n        // your code goes here\n    }\n}`,
    python: `print(\"Hello, World!\")`
  };

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await getUpdateFormData(problemId);
        setProblemData({
          name: res.problem.name,
          statement: res.problem.statement,
          code: res.problem.code, // unique code, only for the form
          difficulty: res.problem.difficulty,
          topics: res.problem.topics.join(", ")
        });
        setSampleTestcases(res.sampleTestcases || []);
        setHiddenTestcases(res.hiddenTestcases || []);
        setCode(templates[language]);
      } catch (err) {
        console.error("Error fetching problem:", err);
        toast.error("Failed to load problem");
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

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...problemData,
      topics: problemData.topics.split(",").map((t) => t.trim()),
      sampleTestcases,
      hiddenTestcases,
    };
    try {
      await updateProblem(problemId, payload);
      toast.success("Problem updated successfully!");
      navigate("/admin/problemlist");
    } catch (err) {
      console.error("Error updating problem:", err);
      toast.error("Update failed. Try again.");
    }
  };

  const handleRun = async () => {
    setRunLoading(true);
    try {
      const res = await runCode({ code, language, input: testInput });
      const output = res.output || res.error || "";
      setTestOutputHtml(`<pre>${String(output)}</pre>`);
    } catch {
      setTestOutputHtml(`<pre>Unexpected error.</pre>`);
    } finally {
      setRunLoading(false);
    }
  };

  const handleVerifySubmit = async () => {
    setSubmitLoading(true);
    setTestOutputHtml("Evaluating...");
    try {
      const allTestcases = [...sampleTestcases, ...hiddenTestcases];
      const result = await verifyCode({ code, language, testcases: allTestcases });
      if (result.error) {
        setTestOutputHtml(`<pre style=\"color:red;\">${result.error}</pre>`);
        return;
      }
      let allPassed = true;
      let html = `<h4>Test Cases :</h4><div style=\"display: flex; flex-wrap: wrap; gap: 10px;\">`;
      result.results.forEach((t, i) => {
        if (t.status === "pass") {
          html += `<div style=\"background: #22c55e; color: white; padding: 8px 14px; border-radius: 5px;\">Test Case ${i + 1}</div>`;
        } else if (t.status === "fail") {
          allPassed = false;
          html += `<div style=\"background: #ef4444; color: white; padding: 8px 14px; border-radius: 5px;\">Test Case ${i + 1}</div>`;
        } else if (t.status === "tle") {
          allPassed = false;
          html += `<div style=\"background: #f59e42; color: white; padding: 8px 14px; border-radius: 5px;\">TLE ${i + 1}</div>`;
        } else if (t.status === "mle") {
          allPassed = false;
          html += `<div style=\"background: #a855f7; color: white; padding: 8px 14px; border-radius: 5px;\">MLE ${i + 1}</div>`;
        }
      });
      html += "</div>";
      if (allPassed) {
        html = `<h3 style=\"color:green;\">Result : Accepted ✅</h3>` + html;
      } else {
        html = `<h3 style=\"color:red;\">Result : Not Accepted ❌</h3>` + html;
      }
      setTestOutputHtml(html);
    } catch {
      setTestOutputHtml(`<pre style=\"color:red;\">Unexpected error during verification.</pre>`);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(templates[lang]);
  };

  return (
    <>
      <AdminNavbar />
      <div className="h-screen w-full text-gray-100">
        <Split className="split-container h-full" sizes={[50, 50]} minSize={200} gutterSize={6} direction="horizontal">
          {/* LEFT PANEL */}
          <div className="left-panel flex flex-col h-full border-r border-gray-800 bg-gray-900">
            <Split direction="vertical" sizes={[50, 50]} minSize={50} gutterSize={6} className="h-full" style={{ height: "100%" }}>
              {/* TOP: PROBLEM FORM */}
              <div className="overflow-auto h-full p-6 ">
                <form className="flex flex-col gap-3">
                  <label className="font-semibold">Problem Name:</label>
                  <input name="name" value={problemData.name} onChange={handleProblemChange} required className="rounded bg-custom-232323 text-gray-100 border border-gray-700 px-3 py-2 placeholder-gray-400" />
                  <label className="font-semibold">Statement:</label>
                  <textarea name="statement" value={problemData.statement} onChange={handleProblemChange} rows={11} required className="rounded bg-custom-232323 text-gray-100 border border-gray-700 px-3 py-2 placeholder-gray-400 focus:outline-none focus:border-gray-700" />
                  <label className="font-semibold">Unique Code:</label>
                  <input name="code" value={problemData.code} onChange={handleProblemChange} required className="rounded bg-custom-232323 text-gray-100 border border-gray-700 px-3 py-2 placeholder-gray-400" />
                  <label className="font-semibold">Difficulty:</label>
                  <input name="difficulty" value={problemData.difficulty} onChange={handleProblemChange} required className="rounded bg-custom-232323 text-gray-100 border border-gray-700 px-3 py-2 placeholder-gray-400" />
                  <label className="font-semibold">Topics (comma-separated):</label>
                  <input name="topics" value={problemData.topics} onChange={handleProblemChange} required className="rounded bg-custom-232323 text-gray-100 border border-gray-700 px-3 py-2 placeholder-gray-400" />
                </form>
              </div>
              {/* BOTTOM: TESTCASES */}
              <div className="overflow-auto h-full p-6 ">
                <form className="flex flex-col gap-3" onSubmit={handleUpdateSubmit}>
                  <h3 className="font-semibold text-lg mb-2 text-blue-400">Sample Testcases</h3>
                  {sampleTestcases.map((t, index) => (
                    <div key={index} className="mb-2 border border-gray-700 rounded p-2">
                      <textarea name="input" placeholder="Input" value={t.input} onChange={(e) => handleChange(sampleTestcases, setSampleTestcases, index, e)} rows={2} required className="rounded bg-custom-232323 border border-gray-700 px-3 py-2 text-gray-100 mb-1 w-full placeholder-gray-400 focus:outline-none focus:border-gray-700" />
                      <textarea name="expectedOutput" placeholder="Expected Output" value={t.expectedOutput} onChange={(e) => handleChange(sampleTestcases, setSampleTestcases, index, e)} rows={2} required className="rounded bg-custom-232323 border border-gray-700 px-3 py-2 text-gray-100 w-full placeholder-gray-400 focus:outline-none focus:border-gray-700" />
                      {sampleTestcases.length > 1 && (
                        <button type="button" className="text-red-400 mt-1 text-xs px-2 py-1 border border-red-400 rounded" onClick={() => removeTestcase(sampleTestcases, setSampleTestcases, index)}>🗑 Remove</button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => addTestcase(setSampleTestcases)} className="text-green-400 border border-green-400 rounded px-2 py-1 text-sm hover:bg-green-900/30 w-fit">+ Add Sample Testcase</button>
                  <h3 className="font-semibold text-lg mt-4 mb-2 text-yellow-400">Hidden Testcases</h3>
                  {hiddenTestcases.map((t, index) => (
                    <div key={index} className="mb-2 border border-gray-700 rounded p-2">
                      <textarea name="input" placeholder="Input" value={t.input} onChange={(e) => handleChange(hiddenTestcases, setHiddenTestcases, index, e)} rows={2} required className="rounded bg-custom-232323 border border-gray-700 px-3 py-2 text-gray-100 mb-1 w-full placeholder-gray-400 focus:outline-none focus:border-gray-700" />
                      <textarea name="expectedOutput" placeholder="Expected Output" value={t.expectedOutput} onChange={(e) => handleChange(hiddenTestcases, setHiddenTestcases, index, e)} rows={2} required className="rounded bg-custom-232323 border border-gray-700 px-3 py-2 text-gray-100 w-full placeholder-gray-400 focus:outline-none focus:border-gray-700" />
                      {hiddenTestcases.length > 1 && (
                        <button type="button" className="text-red-400 mt-1 text-xs px-2 py-1 border border-red-400 rounded" onClick={() => removeTestcase(hiddenTestcases, setHiddenTestcases, index)}>🗑 Remove</button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => addTestcase(setHiddenTestcases)} className="text-green-400 border border-green-400 rounded px-2 py-1 text-sm hover:bg-green-900/30 w-fit">+ Add Hidden Testcase</button>
                  <button type="submit" className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 rounded mt-4">Save Changes</button>
                </form>
              </div>
            </Split>
          </div>
          {/* RIGHT PANEL */}
          <div className="right-panel flex flex-col h-full p-4 ">
            <div className="right-panel-content flex flex-col h-full">
              <div className="language-select mb-3">
                <label className="mr-2 font-semibold">Select Language:</label>
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="bg-black border border-gray-700 text-gray-100 rounded px-3 py-1"
                >
                  <option value="cpp">C++</option>
                  <option value="c">C</option>
                  <option value="java">Java</option>
                  <option value="python">Python</option>
                </select>
              </div>
              <div className="editor-container flex-1 mb-3">
                <Editor
                  height="100%"
                  theme="vs-dark"
                  language={language}
                  value={code}
                  onChange={setCode}
                  options={{ minimap: { enabled: false } }}
                />
              </div>
              <div className="testcase-run-box mt-2">
                <h4 className="font-semibold mb-1">Testcase Input:</h4>
                <textarea
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  rows={4}
                  className="w-full rounded bg-custom-232323 border border-gray-700 px-3 py-2 text-gray-100 mb-2 focus:outline-none focus:border-gray-700"
                />
                <h4 className="font-semibold mb-1">Testcase Output:</h4>
                <div
                  className="testcase-output bg-black border border-gray-700 rounded px-3 py-2 min-h-[40px] text-white mb-2"
                  dangerouslySetInnerHTML={{ __html: testOutputHtml }}
                />
                <div className="action-buttons flex gap-3 mt-2">
                  <button onClick={handleRun} disabled={runLoading || submitLoading} className="px-4 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold transition">
                    {runLoading ? "Running..." : "Run ▶️"}
                  </button>
                  <button onClick={handleVerifySubmit} disabled={submitLoading || runLoading} className="px-4 py-1 rounded bg-green-600 hover:bg-green-500 text-white font-semibold transition">
                    {submitLoading ? "Submitting..." : "Submit 🚀"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Split>
      </div>
    </>
  );
};

export default EditProblem;
