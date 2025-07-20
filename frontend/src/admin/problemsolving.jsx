import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import Editor from "@monaco-editor/react";
import Split from "react-split";
import "../css/ProblemSolvePage.css";
import { getProblemById } from "../apis/Problems";
import { runCode, submitCode } from "../apis/compiler";
import { getAIHint, getAICodeReview } from "../apis/ai";
import UserNavbar from "../user/usernavbar";
import AdminNavbar from "./adminnavbar";
import "../index.css";
import Navbar from "../navbar";

// Custom hook to detect large screens
function useIsLargeScreen() {
  const [isLarge, setIsLarge] = useState(() => window.innerWidth >= 1024);
  useEffect(() => {
    const onResize = () => setIsLarge(window.innerWidth >= 1024);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return isLarge;
}

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

const languageMap = {
  cpp: "cpp",
  c: "c",
  java: "java",
  python: "python"
};

const ProblemSolvePage = () => {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [problem, setProblem] = useState(null);
  const [sampleTestcases, setSampleTestcases] = useState([]);
  const [language, setLanguage] = useState("cpp");
  const [codeMap, setCodeMap] = useState({});
  const [testInput, setTestInput] = useState("");
  const [testOutputHtml, setTestOutputHtml] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiHint, setAiHint] = useState(null);
  const [hintLoading, setHintLoading] = useState(false);
  const [showReviewButton, setShowReviewButton] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [aiReview, setAiReview] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [runLoading, setRunLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const isUser = localStorage.getItem("role") === "user";
  const isAdmin = localStorage.getItem("role") === "admin";
  const isLargeScreen = useIsLargeScreen();
  const code = codeMap[language] || "";

  // Redirect to login if not logged in, and pass current location
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate('/login', { state: { from: location.pathname }, replace: true });
    }
  }, [navigate, location]);

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

  useEffect(() => {
    const loadCodeMap = () => {
      const stored = {};
      for (const lang in templates) {
        const saved = localStorage.getItem(`code-${problemId}-${lang}`);
        stored[lang] = saved || templates[lang];
      }
      setCodeMap(stored);
    };

    if (problemId) loadCodeMap();
  }, [problemId]);

  const handleLanguageChange = (lang) => setLanguage(lang);

  const handleCodeChange = (newCode) => {
    const updated = { ...codeMap, [language]: newCode || "" };
    setCodeMap(updated);
    localStorage.setItem(`code-${problemId}-${language}`, newCode || "");
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

  const handleSubmit = async () => {
    setSubmitLoading(true);
    setTestOutputHtml("Evaluating...");
    try {
      const result = await submitCode({
        code,
        language,
        problemId,
        userId: localStorage.getItem("userId"),
      });

      if (result.error) {
        setTestOutputHtml(
          `<pre style="color:red;">${result.error}</pre>`
        );
        return;
      }

      let allPassed = true;
      let html = `<h4>Test Cases :</h4><div style="display: flex; flex-wrap: wrap; gap: 10px;">`;

      result.testResults.forEach((t, i) => {
        if (t.status === "pass") {
          html += `<div style="background: #22c55e; color: white; padding: 8px 14px; border-radius: 5px;">Test Case ${
            i + 1
          }</div>`;
        } else {
          allPassed = false;
          html += `<div style="background: #ef4444; color: white; padding: 8px 14px; border-radius: 5px;">Test Case ${
            i + 1
          }</div>`;
        }
      });

      html += "</div>";

      if (allPassed) {
        html =
          `<h3 style="color:green;">Result : Accepted ✅</h3>` + html;
        setShowReviewButton(true);
      } else {
        const failed = result.testResults.find((t) => t.status !== "pass");
        let reason = "Wrong Answer";
        if (failed.status === "tle") reason = "Time Limit Exceeded";
        if (failed.status === "mle") reason = "Memory Limit Exceeded";

        const failedIndex = result.testResults.indexOf(failed) + 1;
        html =
          `<h3 style="color:red;">Result : Not Accepted ❌</h3>` + html;
        html += `<p><b style="color:red;">${reason} on Test Case ${failedIndex}</b></p>`;
        setShowReviewButton(false);
      }

      setTestOutputHtml(html);
    } catch {
      setTestOutputHtml(
        `<pre style="color:red;">Unexpected error during submission.</pre>`
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleGetAIHint = async () => {
    if (!problem) return;
    setHintLoading(true);
    try {
      const hint = await getAIHint(problem.name, problem.statement);
      setAiHint(hint);
    } catch {
      setAiHint("Failed to get AI hint. Please try again later.");
    } finally {
      setHintLoading(false);
    }
  };

  const handleAICodeReview = async () => {
    if (!problem) return;
    setReviewLoading(true);
    setAiReview(null);
    try {
      const review = await getAICodeReview(
        code,
        language,
        problem.name,
        problem.statement
      );
      setAiReview(review);
    } catch {
      setAiReview("Failed to get AI review. Please try again later.");
    } finally {
      setReviewLoading(false);
    }
  };

  if (!problem) return <p>Loading problem...</p>;

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  let navbarComponent;
  if (!token) {
    navbarComponent = <Navbar />;
  } else if (role === "admin") {
    navbarComponent = <AdminNavbar />;
  } else {
    navbarComponent = <UserNavbar />;
  }

  // Responsive: Use react-split for large screens, stacked layout for small/medium
  return (
    <>
      {navbarComponent}
      <div className="problem-solve-page min-h-screen w-full">
        {isLargeScreen ? (
          <Split className="split-container h-full" sizes={[50, 50]} minSize={200} gutterSize={10}>
            {/* LEFT PANEL */}
            <div className="left-panel flex flex-col h-full">
              <div className="problem-header">
                <div className="title-and-button flex flex-col gap-2 items-start">
                  <h2>{problem.name}</h2>
                  <div className="flex gap-2 flex-wrap">
                    {localStorage.getItem("userId") && (
                      <Link
                        to={`/submissions/${problemId}/${localStorage.getItem("userId")}`}
                        className="submissions-btn submissions-btn-sm"
                      >
                        Submissions 📄
                      </Link>
                    )}
                    <button
                      onClick={handleGetAIHint}
                      disabled={hintLoading}
                      className="ai-hint-btn ai-hint-btn-sm"
                    >
                      {hintLoading ? "Thinking..." : "Get AI Hint 💡"}
                    </button>
                    {showReviewButton && (
                      <button onClick={handleAICodeReview} className="ai-hint-btn ai-hint-btn-sm">
                        {reviewLoading ? "Reviewing..." : "AI Code Review 🤖"}
                      </button>
                    )}
                  </div>
                </div>
                {aiHint && (
                  <div className="ai-hint-box">
                    <button
                      onClick={() => setAiHint(null)}
                      className="close-btn"
                    >
                      &times;
                    </button>
                    <h4>AI Suggestion:</h4>
                    <p>{aiHint}</p>
                  </div>
                )}
              </div>
              <div className="scrollable-content">
                <div className="problem-statement" style={{ whiteSpace: "pre-wrap" }}>
                  {problem.statement}
                </div>

                <h4>Sample Testcases:</h4>
                {sampleTestcases.length === 0 ? (
                  <p>No sample testcases available</p>
                ) : (
                  sampleTestcases.map((t, index) => (
                    <div key={index} className="testcase-box">
                      <p>
                        <strong>Input:</strong>
                      </p>
                      <pre>{t.input}</pre>
                      <p>
                        <strong>Output:</strong>
                      </p>
                      <pre>{t.expectedOutput}</pre>
                    </div>
                  ))
                )}
              </div>
            </div>
            {/* RIGHT PANEL */}
            <div className="right-panel flex flex-col h-full">
              <div className="right-panel-content">
                <div className="language-select">
                  <label>Select Language:</label>
                  <select
                    value={language}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                  >
                    <option value="cpp">C++</option>
                    <option value="c">C</option>
                    <option value="java">Java</option>
                    <option value="python">Python</option>
                  </select>
                </div>

                <div className="editor-container h-full flex-1">
                  <Editor
                    height="100%"
                    theme="vs-dark"
                    language={languageMap[language]}
                    value={code}
                    onChange={handleCodeChange}
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

                  <div className="action-buttons flex gap-3 mt-3">
                    <button
                      onClick={handleRun}
                      disabled={runLoading || submitLoading}
                      className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 text-white font-semibold transition-colors duration-150"
                    >
                      {runLoading ? "Running..." : "Run ▶️"}
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={submitLoading || runLoading}
                      className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 disabled:bg-green-900 text-white font-semibold transition-colors duration-150"
                    >
                      {submitLoading ? "Submitting..." : "Submit 🚀"}
                    </button>
                  </div>
                </div>

                {aiReview && (
                  <div className="ai-review-box">
                    <h4>AI Code Review:</h4>
                    <div
                      dangerouslySetInnerHTML={{ __html: aiReview }}
                    />
                  </div>
                )}
              </div>
            </div>
          </Split>
        ) : (
          <div className="flex flex-col w-full">
            {/* LEFT PANEL */}
            <div className="left-panel w-full flex flex-col">
              <div className="problem-header">
                <div className="title-and-button flex flex-col gap-2 items-start">
                  <h2>{problem.name}</h2>
                  <div className="flex gap-2 flex-wrap">
                    {localStorage.getItem("userId") && (
                      <Link
                        to={`/submissions/${problemId}/${localStorage.getItem("userId")}`}
                        className="submissions-btn submissions-btn-sm"
                      >
                        Submissions 📄
                      </Link>
                    )}
                    <button
                      onClick={handleGetAIHint}
                      disabled={hintLoading}
                      className="ai-hint-btn ai-hint-btn-sm"
                    >
                      {hintLoading ? "Thinking..." : "Get AI Hint 💡"}
                    </button>
                    {showReviewButton && (
                      <button onClick={handleAICodeReview} className="ai-hint-btn ai-hint-btn-sm">
                        {reviewLoading ? "Reviewing..." : "AI Code Review 🤖"}
                      </button>
                    )}
                  </div>
                </div>
                {aiHint && (
                  <div className="ai-hint-box">
                    <button
                      onClick={() => setAiHint(null)}
                      className="close-btn"
                    >
                      &times;
                    </button>
                    <h4>AI Suggestion:</h4>
                    <p>{aiHint}</p>
                  </div>
                )}
              </div>
              <div className="scrollable-content">
                <div className="problem-statement" style={{ whiteSpace: "pre-wrap" }}>
                  {problem.statement}
                </div>

                <h4>Sample Testcases:</h4>
                {sampleTestcases.length === 0 ? (
                  <p>No sample testcases available</p>
                ) : (
                  sampleTestcases.map((t, index) => (
                    <div key={index} className="testcase-box">
                      <p>
                        <strong>Input:</strong>
                      </p>
                      <pre>{t.input}</pre>
                      <p>
                        <strong>Output:</strong>
                      </p>
                      <pre>{t.expectedOutput}</pre>
                    </div>
                  ))
                )}
              </div>
            </div>
            {/* RIGHT PANEL */}
            <div className="right-panel w-full flex flex-col">
              <div className="right-panel-content">
                <div className="language-select">
                  <label>Select Language:</label>
                  <select
                    value={language}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                  >
                    <option value="cpp">C++</option>
                    <option value="c">C</option>
                    <option value="java">Java</option>
                    <option value="python">Python</option>
                  </select>
                </div>

                <div className="editor-container min-h-[350px] w-full">
                  <Editor
                    height="350px"
                    theme="vs-dark"
                    language={languageMap[language]}
                    value={code}
                    onChange={handleCodeChange}
                    options={{ minimap: { enabled: false } }}
                  />
                </div>

                <div className="testcase-run-box mt-2">
                  <h4 className="font-semibold mb-1">Testcase Input:</h4>
                  <textarea
                    value={testInput}
                    onChange={(e) => setTestInput(e.target.value)}
                    rows={4}
                    className="w-full rounded bg-custom-232323   px-3 py-2 text-gray-100 mb-2 border border-gray-700 focus:outline-none focus:border-gray-700"
                  />
                  <h4 className="font-semibold mb-1">Testcase Output:</h4>
                  <div
                    className="testcase-output bg-black border border-gray-700 rounded px-3 py-2 min-h-[40px] text-white mb-2"
                    dangerouslySetInnerHTML={{ __html: testOutputHtml }}
                  />

                  <div className="action-buttons flex gap-3 mt-3">
                    <button
                      onClick={handleRun}
                      disabled={runLoading || submitLoading}
                      className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 text-white font-semibold transition-colors duration-150"
                    >
                      {runLoading ? "Running..." : "Run ▶️"}
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={submitLoading || runLoading}
                      className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 disabled:bg-green-900 text-white font-semibold transition-colors duration-150"
                    >
                      {submitLoading ? "Submitting..." : "Submit 🚀"}
                    </button>
                  </div>
                </div>

                {aiReview && (
                  <div className="ai-review-box">
                    <h4>AI Code Review:</h4>
                    <div
                      dangerouslySetInnerHTML={{ __html: aiReview }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProblemSolvePage;
