import OmniVoteLogo from "./OmniVoteLogo";

function SignupHeader() {
  return (
    <div className="login-header">
      <div className="login-icon">
        <OmniVoteLogo size={36} showText={false} />
      </div>
      <h1>Create Account</h1>
      <p>Sign up for your OmniVote account</p>
    </div>
  );
}

export default SignupHeader;