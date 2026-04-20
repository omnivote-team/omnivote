import OmniVoteLogo from "./OmniVoteLogo";

function LoginHeader() {
  return (
    <div className="login-header">
      <div className="login-icon">
        <OmniVoteLogo size={36} showText={false} />
      </div>
      <h1>Welcome Back</h1>
      <p>Login to your OmniVote account</p>
    </div>
  );
}

export default LoginHeader;