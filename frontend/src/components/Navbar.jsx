import OmniVoteLogo from "./OmniVoteLogo";
function Navbar() {
  return (
    <header className="top-navbar">
      <a href="/" className="logo">
        <OmniVoteLogo size={40} showText={true} />
      </a>

      <nav className="nav-links">
        <a href="/elections">Elections</a>
        <a href="/login">Login</a>
      </nav>
    </header>
  );
}

export default Navbar;