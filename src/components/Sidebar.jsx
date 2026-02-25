export default function Sidebar({ menuItems, setSection, logout }) {
  return (
    <div className="sidebar">
      <h2 className="logo">WorkStudy</h2>

      {menuItems.map((item, index) => (
        <button
          key={index}
          className="sidebar-btn"
          onClick={() => setSection(item.value)}
        >
          {item.label}
        </button>
      ))}

      <button className="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
}