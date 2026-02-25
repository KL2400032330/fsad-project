import { useNavigate } from "react-router-dom";
import "../styles/role.css";

export default function RoleSelection() {
  const navigate = useNavigate();

  return (
    <div className="role-page">
      <h1>Work-Study Management System</h1>

      <div className="role-tiles">
        <div className="tile" onClick={() => navigate("/login/admin")}>
          ADMIN
        </div>

        <div className="tile" onClick={() => navigate("/login/student")}>
          STUDENT
        </div>
      </div>
    </div>
  );
}