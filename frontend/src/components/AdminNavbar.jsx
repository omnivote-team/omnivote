import { useNavigate } from "react-router-dom";
import OmniVoteLogo from "./OmniVoteLogo";

function AdminNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="user-top-navbar">
      <div className="user-navbar-logo">
        <OmniVoteLogo />
      </div>

      <div className="user-nav-links">
        <span onClick={() => navigate("/admin/elections")}>
          Elections
        </span>

        <span
          className="active-link"
          onClick={() => navigate("/admin-dashboard")}
        >
          Admin Dashboard
        </span>

        <span onClick={handleLogout}>
          Logout
        </span>
      </div>
    </div>
  );
}

export default AdminNavbar;