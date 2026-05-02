import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

function LoginForm({ selectedRole }) {
  const isAdmin = selectedRole === "admin";
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
        const response = await API.post("/auth/login", {
        identifier: identifier,
        password: password,
        requested_role: selectedRole,
      });

      if (response.data.error) {
        setError(response.data.error);
        return;
      }

      localStorage.setItem("token", response.data.user.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      if (selectedRole === "admin") {
        navigate("/admin-dashboard");
        } 
        else {
          navigate("/dashboard");
        }
    } catch (error) {
      console.log(error);
      setError("Login failed. Please check your email and password.");
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <label>{isAdmin ? "Admin Email" : "Email / Student ID"}</label>
      <input
        type="text"
        required
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
        required
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <a href="#" className="forgot-password">
        Forgot password?
      </a>

      {error && <p className="login-error-message">{error}</p>}
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