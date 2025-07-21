import React, { useState,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
//import '../css/userdashboard.css';


const UserNavbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(()=>{
    const token=localStorage.getItem("token")
    if(!token){
      navigate("/",{replace:true});
    }
  },[navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('firstname');
    localStorage.removeItem('role');
    localStorage.clear();
    alert("Logged out successfully!");
    navigate('/');
  };

  const isLoggedIn = Boolean(localStorage.getItem('token'));

  return (
    <nav className="sticky top-0 z-50 w-full bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">
        {/* Left: Logo & Title */}
        <div className="flex items-center space-x-3">
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 focus:outline-none">
            <span className="bg-green-600 rounded-lg px-3 py-1 text-2xl font-bold text-white flex items-center justify-center" style={{fontFamily: 'monospace', letterSpacing: '-1px'}}>CJ</span>
            <span className="text-2xl font-extrabold text-white tracking-tight">CodeJudge</span>
          </Link>
          <span className="ml-4 text-sm text-gray-300 hidden md:inline">{localStorage.getItem("firstname") || "User"}</span>
        </div>
        {/* Center: Nav Links (Desktop) */}
        <div className="hidden md:flex space-x-6">
          <Link to="/user/problems" className="hover:text-yellow-400 transition-colors font-medium">Solve Problems</Link>
          <Link to="/user/compiler" className="hover:text-yellow-400 transition-colors font-medium">Compiler</Link>
          <Link to="/user/contests" className="hover:text-yellow-400 transition-colors font-medium">Contests</Link>
        </div>
        {/* Right: Logout & Hamburger */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleLogout}
            className="text-red-500 font-semibold px-3 py-1 rounded hover:underline transition-colors text-sm"
            style={{ background: 'none', border: 'none' }}
          >
            Logout
          </button>
          {/* Hamburger for mobile */}
          <button className="md:hidden ml-2 p-2 rounded hover:bg-gray-800 focus:outline-none" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800 px-4 pb-2">
          <Link to="/user/problems" className="block py-2 text-sm hover:text-yellow-400 font-medium" onClick={() => setMenuOpen(false)}>Solve Problems</Link>
          <Link to="/user/compiler" className="block py-2 text-sm hover:text-yellow-400 font-medium" onClick={() => setMenuOpen(false)}>Compiler</Link>
          <Link to="/user/contests" className="block py-2 text-sm hover:text-yellow-400 font-medium" onClick={() => setMenuOpen(false)}>Contests</Link>
        </div>
      )}
    </nav>
  );
};

export default UserNavbar;
