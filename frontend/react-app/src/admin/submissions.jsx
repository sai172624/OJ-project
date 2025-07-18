import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserProblemSubmissions } from "../apis/submission";

const SubmissionsPage = () => {
  const { problemId, userId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const data = await getUserProblemSubmissions(problemId, userId);
        setSubmissions(data || []);
      } catch (err) {
        console.error("Error fetching submissions:", err);
      }
    };
    fetchSubmissions();
  }, [problemId, userId]);

  // Improved time ago logic
  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '-';
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // in seconds
    if (diff < 60) return `${diff} second${diff !== 1 ? "s" : ""} ago`;
    const mins = Math.floor(diff / 60);
    if (mins < 60) return `${mins} minute${mins !== 1 ? "s" : ""} ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days !== 1 ? "s" : ""} ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months !== 1 ? "s" : ""} ago`;
    const years = Math.floor(months / 12);
    return `${years} year${years !== 1 ? "s" : ""} ago`;
  };

  return (
    <div className="min-h-screen bg-[#18181b] text-gray-100 px-2 py-6 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-6">My Submissions</h2>
      <div className="w-full max-w-3xl overflow-x-auto rounded-lg shadow-lg bg-[#232323]">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-800 text-gray-200">
              <th className="px-3 py-2">Username</th>
              <th className="px-3 py-2">Result</th>
              <th className="px-3 py-2">Runtime (ms)</th>
              <th className="px-3 py-2">Language</th>
              <th className="px-3 py-2">Submitted At</th>
              <th className="px-3 py-2">Code</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((s, idx) => (
              <tr
                key={idx}
                className={
                  (s.verdict === "Accepted"
                    ? "bg-green-900/40 hover:bg-green-900/60"
                    : "bg-red-900/40 hover:bg-red-900/60") +
                  " transition-colors"
                }
              >
                <td className="px-3 py-2 font-semibold text-blue-300 text-base whitespace-nowrap">{s.userName || "User"}</td>
                <td className="px-3 py-2 font-semibold">{s.verdict}</td>
                <td className="px-3 py-2">{s.timeTaken ?? '-'}</td>
                <td className="px-3 py-2">{s.language ?? '-'}</td>
                <td className="px-3 py-2 whitespace-nowrap">{formatTimeAgo(s.createdAt)}</td>
                <td className="px-3 py-2">
                  <button
                    className="text-blue-400 hover:text-blue-200 transition-colors text-lg"
                    onClick={() => setSelectedSubmission(s)}
                    title="View Code"
                  >
                    <i className="fas fa-code"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setSelectedSubmission(null)}>
          <div
            className="bg-[#232323] rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-green-400">{selectedSubmission.verdict}</h3>
              <button onClick={() => setSelectedSubmission(null)} className="text-2xl text-gray-400 hover:text-red-400 transition">&times;</button>
            </div>
            <pre className="bg-gray-900 rounded p-4 text-sm overflow-x-auto max-h-96 whitespace-pre-wrap">
              {selectedSubmission.code}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionsPage;
