import OmniVoteLogo from "./OmniVoteLogo";
import { useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="top-navbar">
      <div className="logo" onClick={() => navigate("/")}>
        <OmniVoteLogo size={40} showText={true} />
      </div>

      <nav className="nav-links">
        <span
          className={location.pathname === "/elections" ? "active-nav" : ""}
          onClick={() => navigate("/elections")}
        >
          Elections
        </span>

        <span
          className={location.pathname === "/login" ? "active-nav" : ""}
          onClick={() => navigate("/login")}
        >
          Login
        </span>
      </nav>
    </header>
  );
}

export default Navbar;