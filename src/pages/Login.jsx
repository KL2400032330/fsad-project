import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/login.css";

export default function Login() {
  const { role } = useParams();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (role === "admin") {
      if (username === "admin" && password === "admin123") {
        localStorage.setItem("user", JSON.stringify({ role: "admin" }));
        navigate("/admin");
      } else alert("Invalid Admin Credentials");
    }

    if (role === "student") {
      const students = JSON.parse(localStorage.getItem("students")) || [];
      const found = students.find(
        s => s.username === username && s.password === password
      );

      if (found) {
        localStorage.setItem("user", JSON.stringify({ role: "student", username }));
        navigate("/student");
      } else alert("Invalid Student Credentials");
    }
  };

  return (
    <div className="login-page">
      <form className="login-box" onSubmit={handleSubmit}>
        <h2>{role.toUpperCase()} LOGIN</h2>

        <input
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}