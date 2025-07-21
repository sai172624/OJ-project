import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "../apis/auth";
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const role = localStorage.getItem("role");
      if (role === 'admin') {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/user/problems", { replace: true });
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
        localStorage.setItem("userId", response.userId);

        // Redirect to the page the user came from, or default
        const redirectTo = location.state?.from || (response.role === "admin" ? "/admin/dashboard" : "/user/problems");
        toast.success(`${response.role === "admin" ? "Admin" : "User"} login successful!`);
        navigate(redirectTo, { replace: true });
      } else {
        setError(response.message || "Login failed.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError(err?.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-gray-800 px-4">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl shadow-xl p-8 flex flex-col items-center">
        <h2 className="text-3xl font-extrabold text-white mb-2">Welcome Back <span role='img' aria-label='wave'>👋</span></h2>
        <p className="text-gray-400 mb-6">Login to your account</p>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
          />

          {error && <p className="text-red-400 text-sm text-center -mt-2">{error}</p>}

          <button type="submit" className="w-full py-2 mt-2 rounded-lg bg-green-600 hover:bg-green-500 text-white font-bold text-lg transition">Login</button>
        </form>
        <div className="mt-4 text-center text-gray-400 text-sm">
          Don't have an account?{' '}
          <a href="/register" className="text-green-400 hover:underline">Register</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
