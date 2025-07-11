import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


function Login() {
  const navigate = useNavigate(); 
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const { email, password } = loginData;

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
console.log(data.data)
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      alert("Login successful!");
      localStorage.setItem("fullname", data.data.fullName); // Save token to localStorage
      localStorage.setItem("loginTime", Date.now()); // store current timestamp
      navigate("/dashboard"); // Navigate to dashboard
      console.log("Logged in user:", data);
      // TODO: Save token or session and navigate to dashboard
    } catch (err) {
      console.error("Login error:", err.message);
      setError(err.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 text-success">User Login</h2>
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <form onSubmit={handleLogin} className="border p-4 rounded shadow bg-light">
            {error && <div className="alert alert-danger">{error}</div>}

            {/* Email */}
            <div className="mb-3">
              <label className="form-label">Email address</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={loginData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={loginData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-success w-100">
              Login
            </button>
            <button
  type="button"
  className="btn btn-outline-secondary w-100 mt-2"
  onClick={() => navigate("/register")}
>
  Not registered? Go to Register
</button>

            
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
