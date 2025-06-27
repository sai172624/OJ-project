import "./css/navbar.css";
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="nav-brand">
        <span className="logo">CJ</span>
        <span className="brand-name">CodeJudge</span>
      </div>
      <div className="auth-buttons">
        <Link to="/login" className="login-btn">Login</Link>
        <Link to="/register" className="register-btn">Register</Link>
      </div>
    </div>
  );
};

export default Navbar;
