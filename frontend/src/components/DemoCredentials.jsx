import loginDemoCredentials from "../data/loginDemoCredentials";

function DemoCredentials({ selectedRole }) {
  const currentCredentials = loginDemoCredentials[selectedRole];

  return (
    <div className="demo-credentials">
      <p>Demo Credentials:</p>

      <div className="demo-box">
        <strong>{currentCredentials.label}:</strong>{" "}
        {currentCredentials.emailHint}, password:{" "}
        {currentCredentials.password}
      </div>
    </div>
  );
}

export default DemoCredentials;