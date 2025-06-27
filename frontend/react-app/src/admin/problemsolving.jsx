import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css";
import "../css/ProblemSolvePage.css";
import { getProblemById } from "../apis/Problems";
import axios from "axios";

const templates = {
  cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
  c: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
  python: `print("Hello, World!")`
};

const ProblemSolvePage = () => {
  const { problemId } = useParams();
  const [problem, setProblem] = useState(null);
  const [sampleTestcases, setSampleTestcases] = useState([]);
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(templates["cpp"]);
  const [testInput, setTestInput] = useState("");
  const [testOutput, setTestOutput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await getProblemById(problemId);
        setProblem(res.problem || {});
        const samples = res.sampleTestcases || [];
        setSampleTestcases(samples);
        if (samples.length > 0) setTestInput(samples[0].input);
      } catch (err) {
        console.error("Error fetching problem:", err);
      }
    };

    fetchProblem();
  }, [problemId]);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(templates[lang]);
  };

  const handleRun = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/execute", {
        code,
        language,
        input: testInput
      });
      setTestOutput(res.data.output);
    } catch (err) {
      console.error("Run Error:", err);
      setTestOutput("Error during execution.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    alert("Submit clicked 🚀 (you can later send to judge API)");
  };

  if (!problem) return <p>Loading problem...</p>;

  return (
    <div className="problem-solve-page">
      {/* Left Panel */}
      <div className="left-panel">
        <h2>{problem.name}</h2>
        <p>{problem.statement}</p>

        <h4>Sample Testcases:</h4>
        {sampleTestcases.length === 0 ? (
          <p>No sample testcases available</p>
        ) : (
          sampleTestcases.map((t, index) => (
            <div key={index} className="testcase-box">
              <p><strong>Input:</strong></p>
              <pre>{t.input}</pre>
              <p><strong>Output:</strong></p>
              <pre>{t.expectedOutput}</pre>
            </div>
          ))
        )}
      </div>

      {/* Right Panel */}
      <div className="right-panel">
        <div className="language-select">
          <label>Select Language: </label>
          <select value={language} onChange={(e) => handleLanguageChange(e.target.value)}>
            <option value="cpp">C++</option>
            <option value="c">C</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
          </select>
        </div>

        <Editor
          value={code}
          onValueChange={setCode}
          highlight={(code) => highlight(code, languages.js)}
          padding={10}
          style={{
            fontFamily: '"Fira Code", monospace',
            fontSize: 14,
            minHeight: "300px",
            backgroundColor: "#f8f8f8",
            border: "1px solid #ccc",
            borderRadius: "6px",
            marginTop: "10px",
          }}
        />

        <div className="testcase-run-box">
          <h4>Testcase Input:</h4>
          <textarea
            value={testInput}
            onChange={(e) => setTestInput(e.target.value)}
            rows={4}
            cols={50}
          />

          <h4>Testcase Output:</h4>
          <textarea
            value={testOutput}
            readOnly
            rows={4}
            cols={50}
            placeholder="Output will appear here..."
          />

          <div style={{ marginTop: "10px" }}>
            <button onClick={handleRun} disabled={loading}>
              {loading ? "Running..." : "Run ▶️"}
            </button>
            <button onClick={handleSubmit} style={{ marginLeft: "10px" }}>
              Submit 🚀
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemSolvePage;
