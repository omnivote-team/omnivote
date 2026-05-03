import { useNavigate, useLocation } from "react-router-dom";
import OmniVoteLogo from "./OmniVoteLogo";

function AdminNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isElectionPage = location.pathname.startsWith("/admin/elections");
  const isDashboardPage = location.pathname === "/admin-dashboard";

  return (
    <div className="user-top-navbar">
      <div className="user-navbar-logo" onClick={() => navigate("/admin-dashboard")}>
        <OmniVoteLogo />
      </div>

      <div className="user-nav-links">
        <span
          className={isElectionPage ? "active-link" : ""}
          onClick={() => navigate("/admin/elections")}
        >
          Elections
        </span>

        <span
          className={isDashboardPage ? "active-link" : ""}
          onClick={() => navigate("/admin-dashboard")}
        >
          Admin Dashboard
        </span>

        <span onClick={handleLogout}>Logout</span>
      </div>
    </div>
  );
}

export default AdminNavbar;