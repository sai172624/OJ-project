import { Link, useNavigate } from "react-router-dom";
import React, { useState ,useEffect} from "react";

const AdminNavbar = () => {
  const navigate = useNavigate();
  
  const [menuOpen, setMenuOpen] = useState(false);
  const firstname = localStorage.getItem("firstname") || "Admin";
  useEffect(()=>{
    const token=localStorage.getItem("token")
    if(!token){
      navigate("/",{replace:true});
    }
  },[navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("firstname");
    localStorage.removeItem("role");
    localStorage.clear();
    alert("Logged out successfully!");
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">
        {/* Left: Logo & Title */}
        <div className="flex items-center space-x-3">
          <span className="bg-green-600 rounded-lg px-3 py-1 text-2xl font-bold text-white flex items-center justify-center" style={{fontFamily: 'monospace', letterSpacing: '-1px'}}>CJ</span>
          <span className="text-2xl font-extrabold text-white tracking-tight">CodeJudge</span>
          <span className="ml-4 text-sm text-gray-300 hidden lg:inline">{firstname} <span className="text-yellow-400">(Admin)</span></span>
        </div>
        {/* Center: Nav Links (Desktop) */}
        <div className="hidden lg:flex space-x-6">
          <Link to="/admin/dashboard" className="hover:text-yellow-400 transition-colors font-medium">Dashboard</Link>
          <Link to="/admin/addproblem" className="hover:text-yellow-400 transition-colors font-medium">Add Problems</Link>
          <Link to="/admin/problemlist" className="hover:text-yellow-400 transition-colors font-medium">Solve Problems</Link>
          <Link to="/admin/compiler" className="hover:text-yellow-400 transition-colors font-medium">Compiler</Link>
          <Link to="/admin/contests" className="hover:text-yellow-400 transition-colors font-medium">Add Contests</Link>
        </div>
        {/* Right: Logout & Hamburger */}
        <div className="flex items-center">
          {/* Logout only on large screens */}
          <button onClick={handleLogout} className="ml-4 text-red-400 hover:text-red-300 font-semibold transition-colors bg-transparent shadow-none border-none hidden lg:inline-block">Logout</button>
          <button className="lg:hidden ml-2 p-2 rounded hover:bg-gray-800 focus:outline-none" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-gray-900 border-t border-gray-800 px-4 pb-2 flex flex-col space-y-2">
          <Link to="/admin/dashboard" className="block py-2 text-sm font-semibold text-white hover:text-yellow-400 transition" onClick={() => setMenuOpen(false)}>Dashboard</Link>
          <Link to="/admin/addproblem" className="block py-2 text-sm font-semibold text-white hover:text-yellow-400 transition" onClick={() => setMenuOpen(false)}>Add Problems</Link>
          <Link to="/admin/problemlist" className="block py-2 text-sm font-semibold text-white hover:text-yellow-400 transition" onClick={() => setMenuOpen(false)}>Solve Problems</Link>
          <Link to="/admin/compiler" className="block py-2 text-sm font-semibold text-white hover:text-yellow-400 transition" onClick={() => setMenuOpen(false)}>Compiler</Link>
          <Link to="/admin/contests" className="block py-2 text-sm font-semibold text-white hover:text-yellow-400 transition" onClick={() => setMenuOpen(false)}>Add Contests</Link>
          {/* Logout only on mobile */}
          <button onClick={handleLogout} className="block py-2 text-sm font-semibold text-red-400 hover:text-red-300 transition text-left bg-transparent shadow-none border-none lg:hidden">Logout</button>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar; 