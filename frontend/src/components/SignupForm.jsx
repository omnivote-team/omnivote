import institutions from "../data/institutions";

function SignupForm() {
  return (
    <form className="login-form">
      <label>Full Name</label>
      <input type="text" placeholder="John Doe" />

      <label>Email</label>
      <input type="email" placeholder="your.email@institution.edu" />

      <label>Student ID</label>
      <input type="text" placeholder="STU2024001" />

      <label>Institution</label>
      <select>
        <option>Select your institution</option>
        {institutions.map((inst, index) => (
          <option key={index} value={inst}>
            {inst}
          </option>
        ))}
      </select>

      <label>Password</label>
      <input type="password" placeholder="At least 6 characters" />

      <label>Confirm Password</label>
      <input type="password" placeholder="Re-enter your password" />

      <button type="submit" className="login-submit-btn">
        Create Account
      </button>

      <p className="login-footer-text">
        Already have an account? <a href="/login">Login</a>
      </p>
    </form>
  );
}

export default SignupForm;