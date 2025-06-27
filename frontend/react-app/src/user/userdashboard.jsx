// src/pages/UserDashboard.jsx
import { Link, useNavigate } from "react-router-dom";
import '../css/userdashboard.css';

const UserDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('firstname');
    localStorage.removeItem('role');
    alert("Logged out successfully!");
    navigate('/');
  };

  return (
    <div>
      <div className="user-navbar">
        <div className="user-navbar-left">
          <span className="logo">CJ</span>
          <span className="title">CodeJudge</span>
          <span className="user-name">{localStorage.getItem("firstname") || "User"}</span>
        </div>

        <div className="user-navbar-right">
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="user-dashboard-content">
        <h2>Welcome to Your Dashboard</h2>
        <div className="dashboard-cards">
          <div className="card">
            <h3>Solve Problems</h3>
            <p>Choose from curated DSA problems and test your coding skills.</p>
            <Link to="/user/problems">Start Solving</Link>
          </div>

          <div className="card">
            <h3>Problems Solved</h3>
            <p>Check how many problems you've successfully solved so far.</p>
            <Link to="/user/solved">View Solved</Link>
          </div>

          <div className="card">
            <h3>Leaderboard</h3>
            <p>See how you rank among other coders on the platform.</p>
            <Link to="/user/leaderboard">Go to Leaderboard</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
