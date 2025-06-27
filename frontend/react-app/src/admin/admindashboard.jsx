import { Link, useNavigate } from "react-router-dom";
import "../css/admindashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("firstname");
    localStorage.removeItem("role");
    alert("Logged out successfully!");
    navigate("/");
  };

  const firstname = localStorage.getItem("firstname") || "Admin";

  return (
    <div>
      <div className="admin-navbar">
        <div className="admin-navbar-left">
          <span className="logo">📦</span>
          <span className="title">CodeJudge</span>
          <span className="admin-name">{firstname}</span>
        </div>

        <div className="admin-navbar-right">
        
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="admin-dashboard-content">
        

        <div className="dashboard-cards">
          <div className="card">👤 Total Users: 124</div>
          <div className="card">❓ Total Problems: 38</div>
          <div className="card">✅ Submissions: 814</div>
        </div>

        <div className="admin-actions">
          <Link to="/admin/addproblem">➕ Add New Problem</Link>
          <Link to="/admin/problemlist">📋 View Problem List</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
