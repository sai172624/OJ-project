import { useState } from "react";

const Register = () => {
    const [formData, setformData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "" 
    });   

    const handleChange = (e) => {
        setformData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit=async(e)=>{
        e.preventDefault();
        console.log(formData);

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
        const response = await registerUser(formData);  // <-- HERE you call!
        console.log("Success:", response.data);
        alert("Registration successful!");
    } catch (err) {
        console.error("Error:", err.response?.data);
        alert("Registration failed: " + err.response?.data?.message);
    }
    }

    return (
        <div className="register">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="firstname" placeholder="First Name" value={formData.firstname} onChange={handleChange} required />
                <br /> <br />

                <input type="text" name="lastname" placeholder="Last Name" value={formData.lastname} onChange={handleChange} required />
                <br /> <br />

                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <br /> <br />

                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                <br /> <br />

                <button type="submit"> Register</button>
            </form>
        </div>
    );   
};

export default Register;
