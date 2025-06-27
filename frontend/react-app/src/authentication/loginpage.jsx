import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../apis/auth";
import "../css/login.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("All fields are required.");
      return;
    }

    setError("");

    try {
      const response = await loginUser(formData);
      if (response.success) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("firstname", response.firstname);
        localStorage.setItem("role", response.role);

        if (response.role === "admin") {
          alert("Admin login successful!");
          navigate("/admin/dashboard");
        } else {
          alert("User login successful!");
          navigate("/user/dashboard");
        }
      } else {
        setError(response.message || "Login failed.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError(err?.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>Welcome Back 👋</h2>
        <p className="subtitle">Login to your account</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {error && <p className="error-text">{error}</p>}

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
