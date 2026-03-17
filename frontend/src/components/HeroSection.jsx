import { useNavigate } from "react-router-dom";

function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="hero-section">
      <div className="hero-glow-orb"></div>

      <h1>Welcome to OmniVote</h1>

      <p>
        A secure, transparent, and efficient online voting platform
        for universities, schools, and organizations.
      </p>

      <div className="hero-buttons">
        <button onClick={() => navigate("/elections")}>
          Browse Elections
        </button>

        <button>
          Get Started
        </button>
      </div>

      <div className="hero-bottom-fade"></div>
    </section>
  );
}

export default HeroSection;