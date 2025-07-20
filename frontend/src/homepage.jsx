import Navbar from './navbar';
import { useState, useEffect } from 'react';
import { fetchProblems } from './apis/admin';
import { Link, useNavigate } from 'react-router-dom';

const Homepage = () => {
  const [featuredProblems, setFeaturedProblems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getProblems = async () => {
      try {
        const problems = await fetchProblems(1); // Fetch first page
        setFeaturedProblems(problems); // Show all problems
      } catch (error) {
        console.error("Failed to fetch problems:", error);
      }
    };
    getProblems();
  }, []);

  const difficultyColors = {
    Easy: 'bg-green-700 text-green-200',
    Medium: 'bg-yellow-700 text-yellow-200',
    Hard: 'bg-red-700 text-red-200',
  };

  // Custom Navbar for homepage without Login button
  const HomeNavbar = () => (
    <nav className="sticky top-0 z-50 w-full bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">
        <div className="flex items-center space-x-3">
          <span className="bg-green-600 rounded-lg px-3 py-1 text-2xl font-bold text-white flex items-center justify-center" style={{fontFamily: 'monospace', letterSpacing: '-1px'}}>CJ</span>
          <span className="text-2xl font-extrabold text-white tracking-tight">CodeJudge</span>
        </div>
        <div className="hidden md:flex space-x-4">
          <Link to="/register" className="px-4 py-1 rounded font-semibold text-white bg-green-600 hover:bg-green-500 transition">Register</Link>
        </div>
      </div>
    </nav>
  );

  // Handler for Get Started button
  const handleGetStarted = (e) => {
    e.preventDefault();
    console.log("Get Started button clicked");
    
    const token = localStorage.getItem('token');
    if (!token) {
      console.log("No token found, navigating to login");
      navigate('/login');
    } else {
      console.log("Token found, scrolling to featured section");
      const featuredSection = document.getElementById('featured');
      if (featuredSection) {
        featuredSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        console.log("Featured section not found, scrolling to top");
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <HomeNavbar />
      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="w-full bg-gradient-to-r from-green-600 to-blue-600 py-16 px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">Sharpen Your Coding Skills</h1>
            <p className="text-lg sm:text-xl text-blue-100 mb-6">Practice with curated problems to ace your next technical interview</p>
            <button
              onClick={handleGetStarted}
              className="inline-block px-6 py-3 bg-yellow-400 text-gray-900 font-bold rounded-lg shadow hover:bg-yellow-300 transition"
            >
              Get Started
            </button>
          </div>
        </section>
        {/* Platform Features Section */}
        <section className="max-w-5xl mx-auto mt-12 px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Compiler with AI Code Explanation */}
            <div className="bg-gray-900 rounded-xl shadow-lg p-6 flex flex-col items-center text-center border border-gray-800 hover:border-green-500 transition">
              <div className="bg-green-600 rounded-full p-3 mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.5a5.5 5.5 0 11-9 0" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 20V10" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-green-400">Compiler</h3>
              <p className="text-gray-300">Run code instantly in C, C++, Java, and Python. Get AI-powered code explanation and review as you code.</p>
            </div>
            {/* AI Hints & Review */}
            <div className="bg-gray-900 rounded-xl shadow-lg p-6 flex flex-col items-center text-center border border-gray-800 hover:border-blue-500 transition">
              <div className="bg-blue-600 rounded-full p-3 mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m4 0h-1v4h-1m-4 0h-1v-4h-1" /><circle cx="12" cy="12" r="10" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-blue-400">AI Hints & Code Review</h3>
              <p className="text-gray-300">Stuck on a problem? Get AI-powered hints and receive instant code reviews to improve your solutions and ace interviews.</p>
            </div>
            {/* High-Quality Problems */}
            <div className="bg-gray-900 rounded-xl shadow-lg p-6 flex flex-col items-center text-center border border-gray-800 hover:border-yellow-500 transition">
              <div className="bg-yellow-400 rounded-full p-3 mb-4">
                <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /><circle cx="12" cy="12" r="10" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-yellow-300">Curated Quality Problems</h3>
              <p className="text-gray-300">Solve handpicked, high-quality problems designed to challenge and prepare you for real-world technical interviews.</p>
            </div>
          </div>
        </section>
        {/* Featured Problems Table */}
        <section id="featured" className="max-w-3xl mx-auto mt-12 px-2">
          <h2 className="text-2xl font-bold mb-4 text-center">Featured Problems</h2>
          <div className="overflow-x-auto overflow-y-auto rounded shadow bg-gray-900" style={{ maxHeight: '350px' }}>
            <table className="min-w-full text-sm">
              <thead className="bg-gray-800">
                <tr>
                  <th className="py-3 px-2 text-left font-semibold text-gray-300">S.No</th>
                  <th className="py-3 px-2 text-left font-semibold text-gray-300">Title</th>
                  <th className="py-3 px-2 text-left font-semibold text-gray-300">Difficulty</th>
                </tr>
              </thead>
              <tbody>
                {featuredProblems.map((problem, idx) => (
                  <tr key={problem._id} className="border-b border-gray-800 hover:bg-gray-800 transition">
                    <td className="py-2 px-2 text-gray-200">{idx + 1}</td>
                    <td className="py-2 px-2">
                      <Link
                        to={`/solve/${problem._id}`}
                        className="text-blue-400 hover:underline font-medium"
                      >
                        {problem.name}
                      </Link>
                    </td>
                    <td className="py-2 px-2">
                      <span className={`inline-block border rounded-full px-3 py-1 text-xs font-semibold ${difficultyColors[problem.difficulty] || 'bg-gray-800 text-gray-300'}`}>{problem.difficulty}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      {/* Footer Section */}
      <footer className="bg-gray-900 mt-12 py-8 px-4 text-gray-300">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:justify-between gap-8">
          <div className="md:w-1/3">
            <h3 className="text-xl font-bold text-white mb-2">CodeJudge</h3>
            <p className="text-gray-400">Helping developers prepare for technical interviews since 2025 with high-quality coding challenges and interview preparation resources.</p>
          </div>
          <div className="md:w-1/3">
            <h3 className="text-lg font-semibold text-white mb-2">Connect</h3>
            <ul className="space-y-1">
              <li><a href="https://www.instagram.com/aviresh_laxman/" className="hover:text-yellow-400">Instagram</a></li>
              <li><a href="https://github.com/sai172624/OJ-project" className="hover:text-yellow-400">GitHub</a></li>
              <li><a href="https://www.linkedin.com/in/sai-laxman-70baa6324/" className="hover:text-yellow-400">LinkedIn</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-gray-500 mt-8 text-xs">
          © 2025 CodeJudge. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
