
import { useState } from "react";
import { registerUser } from "../apis/auth";  
const Register = () => {
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
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
        console.log(formData);

        // Basic validation:
        if (!formData.firstname || !formData.lastname || !formData.email || !formData.password) {
            setError("All fields are required.");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setError("");  // clear error if all is good

        try {
            const response = await registerUser(formData);  // API call to backend
            console.log("Success:", response.data);
            alert("Registration successful!");

            // Optional: reset form
            setFormData({
                firstname: "",
                lastname: "",
                email: "",
                password: ""
            });
        } catch (err) {
            console.error("Error:", err.response?.data);
            setError(err.response?.data?.message || "Registration failed. Please try again.");
            alert("Registration failed. Please try again.");
        }
    };

    return (
        <div className="register">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="firstname"
                    placeholder="First Name"
                    value={formData.firstname}
                    onChange={handleChange}
                    required
                />
                <br /><br />

                <input
                    type="text"
                    name="lastname"
                    placeholder="Last Name"
                    value={formData.lastname}
                    onChange={handleChange}
                    required
                />
                <br /><br />

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

                {/* show error if any */}
                {error && <p style={{ color: "red" }}>{error}</p>}

                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;