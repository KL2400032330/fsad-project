import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import "../styles/role.css";

export default function RoleSelection() {
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();

  return (
    <div className="role-page">
      <button className="role-theme-btn" onClick={toggle} title="Toggle theme">
        {theme === "light" ? "🌙" : "☀️"}
      </button>

      <div className="role-header">
        <span className="brand-icon">🎓</span>
        <h1>Work-Study Management</h1>
        <p>Select your role to continue</p>
      </div>

      <div className="role-tiles">
        <div className="tile" onClick={() => navigate("/login/admin")}>
          <span className="tile-icon">🛡️</span>
          <span className="tile-label">ADMIN</span>
          <span className="tile-sub">Manage students & jobs</span>
        </div>

        <div className="tile" onClick={() => navigate("/login/student")}>
          <span className="tile-icon">🎒</span>
          <span className="tile-label">STUDENT</span>
          <span className="tile-sub">Apply & track your work</span>
        </div>
      </div>
    </div>
  );
}
