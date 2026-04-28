import { useTheme } from "../context/ThemeContext";

export default function Sidebar({ menuItems, section, setSection, logout, title, subtitle }) {
  const { theme, toggle } = useTheme();

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h2>📚 WorkStudy</h2>
        <span>{title || "Management"}</span>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.value}
            className={`sidebar-btn ${section === item.value ? "active" : ""}`}
            onClick={() => setSection(item.value)}
          >
            <span className="icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="theme-btn" onClick={toggle}>
          <span>{theme === "light" ? "🌙" : "☀️"}</span>
          {theme === "light" ? "Dark Mode" : "Light Mode"}
        </button>
        <button className="logout-btn" onClick={logout}>
          <span>🚪</span> Logout
        </button>
      </div>
    </div>
  );
}
