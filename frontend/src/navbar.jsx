import { Link } from 'react-router-dom';
import React, { useState } from 'react';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const isLoggedIn = Boolean(localStorage.getItem('token'));

  return (
    <nav className="sticky top-0 z-50 w-full bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">
        {/* Left: Logo & Title */}
        <div className="flex items-center space-x-3">
          <span className="bg-green-600 rounded-lg px-3 py-1 text-2xl font-bold text-white flex items-center justify-center" style={{fontFamily: 'monospace', letterSpacing: '-1px'}}>CJ</span>
          <span className="text-2xl font-extrabold text-white tracking-tight">CodeJudge</span>
        </div>
        {/* Right: Auth Buttons & Hamburger */}
        <div className="hidden md:flex space-x-4">
          {!isLoggedIn && (
            <>
              <Link to="/login" className="px-4 py-1 rounded font-semibold text-white bg-blue-600 hover:bg-blue-500 transition">Login</Link>
              <Link to="/register" className="px-4 py-1 rounded font-semibold text-white bg-green-600 hover:bg-green-500 transition">Register</Link>
            </>
          )}
        </div>
        <button className="md:hidden ml-2 p-2 rounded hover:bg-gray-800 focus:outline-none" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800 px-4 pb-2 flex flex-col space-y-2">
          {!isLoggedIn && (
            <>
              <Link to="/login" className="block py-2 text-sm font-semibold text-white bg-blue-600 rounded hover:bg-blue-500 transition" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="block py-2 text-sm font-semibold text-white bg-green-600 rounded hover:bg-green-500 transition" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
