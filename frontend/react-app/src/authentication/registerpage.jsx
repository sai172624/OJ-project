import { useState } from "react";
import { registerUser } from "../apis/auth";
import "../css/register.css"; // Make sure this file exists

const Register = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstname || !formData.lastname || !formData.email || !formData.password) {
      setError("All fields are required.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setError("");

    try {
      const response = await registerUser(formData);
      console.log("Success:", response.data);
      alert("Registration successful!");

      setFormData({
        firstname: "",
        lastname: "",
        email: "",
        password: ""
      });
    } catch (err) {
      console.error("Error:", err.response?.data);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="register-page">
      <div className="register-box">
        <h2>Create Account</h2>
        <p className="subtitle">Join the CodeJudge platform</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="firstname"
            placeholder="First Name"
            value={formData.firstname}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="lastname"
            placeholder="Last Name"
            value={formData.lastname}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
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

          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
