import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import Split from "react-split";
import "../css/ProblemSolvePage.css";
import { getProblemById } from "../apis/Problems";
import { runCode, submitCode } from "../apis/compiler";

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
  java: `class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
  python: `print("Hello, World!")`
};

const languageMap = {
  cpp: "cpp",
  c: "c",
  java: "java",
  python: "python"
};

const ProblemSolvePage = () => {
  const { problemId } = useParams();
  const [problem, setProblem] = useState(null);
  const [sampleTestcases, setSampleTestcases] = useState([]);
  const [language, setLanguage] = useState("cpp");
  const [codeMap, setCodeMap] = useState(() => {
    const stored = {};
    for (const lang in templates) {
      stored[lang] = localStorage.getItem(`code-${lang}`) || templates[lang];
    }
    return stored;
  });
  const [testInput, setTestInput] = useState("");
  const [testOutputHtml, setTestOutputHtml] = useState("");
  const [loading, setLoading] = useState(false);

  const code = codeMap[language];

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
  };

  const handleCodeChange = (newCode) => {
    const updated = { ...codeMap, [language]: newCode || "" };
    setCodeMap(updated);
    localStorage.setItem(`code-${language}`, newCode || "");
  };

  const handleRun = async () => {
  setLoading(true);
  try {
    const res = await runCode({ code, language, input: testInput });

    const output = res.output || res.error || "";
    setTestOutputHtml(`<pre>${String(output)}</pre>`);
  } catch (err) {
    setTestOutputHtml(`<pre>Unexpected error.</pre>`);
  } finally {
    setLoading(false);
  }
};


  const handleSubmit = async () => {
  setLoading(true);
  setTestOutputHtml("Evaluating...");

  try {
    const result = await submitCode({ code, language, problemId });

    if (result.error) {
      setTestOutputHtml(`<pre style="color:red;">${result.error}</pre>`);
      return;
    }

    let html = `<h3 style="color:green;">Result : Accepted</h3><h4>Test Cases :</h4><div style="display: flex; flex-wrap: wrap; gap: 10px;">`;
    let allPassed = true;

    result.testResults.forEach((t, i) => {
      if (t.status === "pass") {
        html += `<div style="background: #22c55e; color: white; padding: 8px 14px; border-radius: 5px;">Test Case ${i + 1}</div>`;
      } else {
        allPassed = false;
        html += `<div style="background: #ef4444; color: white; padding: 8px 14px; border-radius: 5px;">Test Case ${i + 1}</div>`;
      }
    });

    html += "</div>";

    if (!allPassed) {
      const failed = result.testResults[result.testResults.length - 1];
      let reason = "Wrong Answer";
      if (failed.status === "tle") reason = "Time Limit Exceeded";
      if (failed.status === "mle") reason = "Memory Limit Exceeded";

      html += `<p><b style="color:red;">${reason} on Test Case ${result.testResults.length}</b></p>`;
    }

    setTestOutputHtml(html);
  } catch (err) {
    setTestOutputHtml(`<pre style="color:red;">Unexpected error during submission.</pre>`);
  } finally {
    setLoading(false);
  }
};

  if (!problem) return <p>Loading problem...</p>;

  return (
    <div className="problem-solve-page">
      <Split className="split-container" sizes={[50, 50]} minSize={200} gutterSize={10}>
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

          <div style={{ flex: 1, overflow: "auto" }}>
            <Editor
              height="85vh"
              theme="vs-dark"
              language={languageMap[language]}
              value={code}
              onChange={handleCodeChange}
              options={{
                fontSize: 14,
                autoClosingBrackets: "always",
                autoClosingQuotes: "always",
                formatOnPaste: true,
                formatOnType: true,
                wordWrap: "off",
                scrollBeyondLastLine: true,
                minimap: { enabled: false },
                lineNumbers: "on",
                scrollbar: {
                  vertical: "auto",
                  horizontal: "auto"
                }
              }}
            />
          </div>

          <div className="testcase-run-box">
            <h4>Testcase Input:</h4>
            <textarea
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              rows={4}
              cols={50}
            />

            <h4>Testcase Output:</h4>
            <div
              className="testcase-output"
              style={{ whiteSpace: "pre-wrap" }}
              dangerouslySetInnerHTML={{ __html: testOutputHtml }}
            />

            <div style={{ marginTop: "10px" }}>
              <button onClick={handleRun} disabled={loading}>
                {loading ? "Running..." : "Run ▶️"}
              </button>
              <button onClick={handleSubmit} style={{ marginLeft: "10px" }} disabled={loading}>
                {loading ? "Submitting..." : "Submit 🚀"}
              </button>
            </div>
          </div>
        </div>
      </Split>
    </div>
  );
};

export default ProblemSolvePage;
