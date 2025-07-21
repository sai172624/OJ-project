import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { runCode } from "../apis/compiler";
import { getAICodeExplanation } from "../apis/ai";
import AdminNavbar from "./adminnavbar";
import UserNavbar from "../user/usernavbar";
import { useLocation } from "react-router-dom";
import "../index.css";
import "../css/ProblemSolvePage.css"; // Import shared styles

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
    <div className="min-h-screen flex flex-col bg-[#1e1e1e]">
      {isAdmin ? <AdminNavbar /> : <UserNavbar />}
      <div className="flex-grow flex flex-col lg:flex-row">
        {/* Left Side: Editor + Controls */}
        <div className="w-full lg:w-1/2 flex flex-col p-4">
          {/* Controls */}
          <div className="mb-3 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="font-semibold text-gray-200">Language:</label>
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
          <div className="w-full h-[60vh] lg:h-full lg:flex-grow">
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
          <div className="testcase-run-box flex-grow flex flex-col">
            <h4 className="font-semibold text-gray-200 mb-1">Testcase Input:</h4>
            <textarea
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              rows={4}
              className="w-full rounded bg-[#2d2d2d] border border-gray-700 px-3 py-2 text-gray-100 mb-2 focus:outline-none focus:border-gray-600"
            />
            <h4 className="font-semibold text-gray-200 mb-1">Testcase Output:</h4>
            <div
              className="testcase-output bg-[#2d2d2d] border border-gray-700 rounded px-3 py-2 min-h-[100px] text-white mb-2 flex-grow"
              dangerouslySetInnerHTML={{ __html: testOutputHtml }}
            />
            {/* AI Code Explanation */}
            {(aiLoading || aiExplanation) && (
              <div className="ai-hint-box mt-4 p-4 bg-[#2d2d2d] border border-gray-700 rounded">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-semibold text-gray-200">AI Code Explanation:</h4>
                  {aiExplanation && (
                    <button
                      onClick={() => setAiExplanation(null)}
                      className="close-btn text-lg px-2 text-gray-400 hover:text-white"
                    >
                      &times;
                    </button>
                  )}
                </div>
                <div className="text-sm whitespace-pre-line text-gray-300">
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