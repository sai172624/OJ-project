import { useState } from "react";
import { loginUser } from "../apis/auth";  // your API function

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.email || !formData.password) {
            setError("All fields are required.");
            return;
        }

        setError("");
        //console.log(formData);

        try {
            const response = await loginUser(formData);  // API call to backend
            console.log("Login Success:", response);

            const userRole = response.role;

            // Redirect based on role:
            if (userRole === "admin") {
                // Navigate to Admin Dashboard
                alert("Admin login successful!");
                // Example: navigate("/admin/dashboard");
            } else {
                // Navigate to User Problem Solving Page
                alert("User login successful!");
                // Example: navigate("/user/problems");
            }

        } catch (err) {
            console.error("Login Error:", err);
            setError(err?.response?.data?.message || "Login failed. Please try again.");
        }
    };

    return (
        <div className="login">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <br /><br />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <br /><br />

                {/* Show error if any */}
                {error && <p style={{ color: "red" }}>{error}</p>}

                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
