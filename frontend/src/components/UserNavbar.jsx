import OmniVoteLogo from "./OmniVoteLogo";
import { useNavigate, useLocation } from "react-router-dom";

function UserNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="top-navbar">
      <div className="logo">
        <OmniVoteLogo size={40} showText={true} />
      </div>

      <nav className="nav-links">
        <span
          className={location.pathname === "/user-elections" ? "active-nav" : ""}
          onClick={() => navigate("/user-elections")}
        >
          Elections
        </span>

        <span
          className={location.pathname === "/dashboard" ? "active-nav" : ""}
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </span>

        <span
          className={location.pathname === "/profile" ? "active-nav" : ""}
          onClick={() => navigate("/profile")}
        >
          Profile
        </span>

        <span onClick={() => navigate("/")}>Logout</span>
      </nav>
    </header>
  );
}

export default UserNavbar;