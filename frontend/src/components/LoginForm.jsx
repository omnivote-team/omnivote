import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginForm({ selectedRole }) {
  const isAdmin = selectedRole === "admin";
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!identifier.trim() || !password.trim()) {
      return;
    }

    if (isAdmin) {
      navigate("/dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <label>{isAdmin ? "Admin Email" : "Email / Student ID"}</label>
      <input
        type="text"
        placeholder={
          isAdmin
            ? "admin@omnivote.com"
            : "your.email@institution.edu"
        }
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
      />

      <label>Password</label>
      <input
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <a href="#" className="forgot-password">
        Forgot password?
      </a>

      <button type="submit" className="login-submit-btn">
        {isAdmin ? "Login as Admin" : "Login"}
      </button>

      <p className="login-footer-text">
        Don't have an account? <a href="/signup">Create account</a>
      </p>
    </form>
  );
}

export default LoginForm;