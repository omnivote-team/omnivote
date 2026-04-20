import OmniVoteLogo from "./OmniVoteLogo";
import { useNavigate } from "react-router-dom";

function UserNavbar() {
  const navigate = useNavigate();

  return (
    <header className="top-navbar">
      <div className="logo">
        <OmniVoteLogo size={40} showText={true} />
      </div>

      <nav className="nav-links">
        <span onClick={() => navigate("/user-elections")}>Elections</span>
        <span onClick={() => navigate("/dashboard")}>Dashboard</span>
        <span onClick={() => navigate("/profile")}>Profile</span>
        <span onClick={() => navigate("/")}>Logout</span>
      </nav>
    </header>
  );
}

export default UserNavbar;