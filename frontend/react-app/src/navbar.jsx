import "./css/navbar.css";
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="navbar-left">
        <span>Logo</span>
        <span>CodeJudge</span>
      </div>
      <div className="navbar-right">
        <Link to="/explore">Explore</Link>
        <Link to="/login"><button>Home</button></Link>
        <Link to="/login"><button>Login</button></Link>
       <Link to="/register"><button>Register</button></Link>
      </div>
    </div>
  );
};

export default Navbar;
