import { useState, useEffect } from "react";
import Split from "react-split";
import Editor from "@monaco-editor/react";
import { runCode } from "../apis/compiler";
import { getAICodeExplanation } from "../apis/ai";
import AdminNavbar from "./adminnavbar";
import UserNavbar from "../user/usernavbar";
import { useLocation } from "react-router-dom";
import "../index.css";

const templates = {
  cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // your code goes here\n    return 0;\n}`,
  c: `#include <stdio.h>\n\nint main() {\n    // your code goes here\n    return 0;\n}`,
  java: `public class Main {\n    public static void main(String[] args) {\n        // your code goes here\n    }\n}`,
  python: `print(\"Hello, World!\")`
};

const CompilerPage = () => {
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(templates["cpp"]);
  const [testInput, setTestInput] = useState("");
  const [testOutputHtml, setTestOutputHtml] = useState("");
  const [runLoading, setRunLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiExplanation, setAiExplanation] = useState(null);

  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      // Chrome requires returnValue to be set
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(templates[lang]);
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

  // Placeholder for AI code explanation handler
  const handleAICodeExplanation = async () => {
    setAiLoading(true);
    setAiExplanation(null);
    try {
      const explanation = await getAICodeExplanation(code, language);
      setAiExplanation(explanation);
    } catch {
      setAiExplanation("Failed to get AI code explanation. Please try again later.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#18181b] text-gray-100 flex flex-col">
      {isAdmin ? <AdminNavbar /> : <UserNavbar />}

      {/* Responsive Layout: Vertical on mobile, Horizontal on desktop */}
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Left Side: Editor + Controls */}
        <div className="w-full lg:w-1/2 flex flex-col p-4">
          {/* Controls */}
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <div className="flex items-center gap-2">
              <label className="font-semibold">Select Language:</label>
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
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={handleAICodeExplanation}
                disabled={aiLoading}
                className="ai-hint-btn ai-hint-btn-sm"
              >
                {aiLoading ? "Explaining..." : "AI Code Explanation 🤖"}
              </button>
              <button
                onClick={handleRun}
                disabled={runLoading}
                className="px-4 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold transition"
              >
                {runLoading ? "Running..." : "Run ▶️"}
              </button>
            </div>
          </div>
          {/* Editor */}
          <div className="flex-1 w-full min-h-[350px] lg:h-auto">
            <Editor
              height="100%"
              theme="vs-dark"
              language={language}
              value={code}
              onChange={setCode}
              options={{ minimap: { enabled: false } }}
            />
          </div>
        </div>

        {/* Right Side: Input/Output */}
        <div className="w-full lg:w-1/2 flex flex-col p-4">
          <div className="testcase-run-box mt-2 flex-1 flex flex-col">
            <h4 className="font-semibold mb-1">Testcase Input:</h4>
            <textarea
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              rows={4}
              className="w-full rounded bg-custom-232323 border border-gray-700 px-3 py-2 text-gray-100 mb-2 focus:outline-none focus:border-gray-700"
            />
            <h4 className="font-semibold mb-1">Testcase Output:</h4>
            <div
              className="testcase-output bg-custom-232323 border border-gray-700 rounded px-3 py-2 min-h-[40px] text-white mb-2 flex-1"
              dangerouslySetInnerHTML={{ __html: testOutputHtml }}
            />
            {/* AI Code Explanation */}
            {(aiLoading || aiExplanation) && (
              <div className="ai-hint-box mt-4">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-semibold">AI Code Explanation:</h4>
                  {aiExplanation && (
                    <button
                      onClick={() => setAiExplanation(null)}
                      className="close-btn text-lg px-2"
                    >
                      &times;
                    </button>
                  )}
                </div>
                <div className="text-sm whitespace-pre-line">
                  {aiLoading ? "Explaining..." : aiExplanation}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompilerPage; 