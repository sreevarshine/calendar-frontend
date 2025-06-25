import React, { useState } from "react";
import axios from "axios";
import "./LoginSignup.css";
import { FiMail, FiLock } from "react-icons/fi";
import loginImage from "./assets/login-illustration.png";

function Login({ setUser, switchToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("https://calendar-backend-six-phi.vercel.app/api/auth/login", {
        email,
        password,
      });

      const token = res.data.token;

      // ✅ Store token and user in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // ✅ Set Authorization header globally for axios
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      console.log(
        "✅ Authorization Header Set:",
        axios.defaults.headers.common["Authorization"]
      );

      // ✅ Set user state
      setUser(res.data.user);
    } catch (err) {
      console.error("❌ Login error:", err);
      alert(
        err.response?.data?.message || "❌ Login failed. Please try again."
      );
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-form-container">
        <h1>📅 Calendar Dashboard</h1>
        <form onSubmit={handleLogin}>
          <h2>Login</h2>
          <div className="input-group">
            <FiMail className="input-icon" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <FiLock className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
        <p className="switch-text">
          Don’t have an account?{" "}
          <button type="button" onClick={switchToSignup}>
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
