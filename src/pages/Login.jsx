import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { useTheme } from "../context/ThemeContext";
import { authStore } from "../utils/storage";
import "../styles/login.css";

export default function Login() {
  const { role } = useParams();
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();
  const captchaRef = useRef(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captchaDone, setCaptchaDone] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  const useFakeCaptcha = !SITE_KEY || SITE_KEY === "your_site_key";

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (!captchaDone && !useFakeCaptcha) {
      setError("Please complete the CAPTCHA verification.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const result = authStore.login(username, password, role);
      if (!result.ok) {
        setError(result.message);
        captchaRef.current?.reset();
        setCaptchaDone(false);
        setLoading(false);
        return;
      }
      navigate(role === "admin" ? "/admin" : "/student");
    }, 400);
  };

  return (
    <div className="login-page">
      <button className="theme-toggle-top" onClick={toggle} title="Toggle theme">
        {theme === "light" ? "🌙" : "☀️"}
      </button>

      <div className="login-box">
        <div className="login-header">
          <span className="login-icon">{role === "admin" ? "🛡️" : "🎒"}</span>
          <h2>{role === "admin" ? "Admin Login" : "Student Login"}</h2>
          <p>Work-Study Management System</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="login-field">
            <label>Username</label>
            <input
              type="text"
              placeholder={role === "admin" ? "admin" : "Enter your username"}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="login-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="captcha-wrap">
            {useFakeCaptcha ? (
              <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "var(--text2)", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={captchaDone}
                  onChange={(e) => setCaptchaDone(e.target.checked)}
                  style={{ width: 18, height: 18 }}
                />
                I am not a robot ✅
              </label>
            ) : (
              <ReCAPTCHA
                ref={captchaRef}
                sitekey={SITE_KEY}
                onChange={(token) => setCaptchaDone(!!token)}
                onExpired={() => setCaptchaDone(false)}
                theme={theme}
              />
            )}
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="login-back">
          <button onClick={() => navigate("/")}>← Back to role selection</button>
        </div>
      </div>
    </div>
  );
}
