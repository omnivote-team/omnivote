import Navbar from "../components/Navbar";
import SignupHeader from "../components/SignupHeader";
import SignupForm from "../components/SignupForm";
import "./LoginPage.css";

function SignupPage() {
  return (
    <>
      <Navbar />

      <div className="login-page">
        <div className="login-container">
          <SignupHeader />

          <div className="login-card">
            <SignupForm />
          </div>
        </div>
      </div>
    </>
  );
}

export default SignupPage;