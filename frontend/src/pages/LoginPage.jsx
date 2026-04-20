import { useState } from "react";
import "./LoginPage.css";
import Navbar from "../components/Navbar";
import LoginHeader from "../components/LoginHeader";
import LoginRoleToggle from "../components/LoginRoleToggle";
import LoginForm from "../components/LoginForm";
import DemoCredentials from "../components/DemoCredentials";

function LoginPage() {
  const [selectedRole, setSelectedRole] = useState("user");

  return (
    <>
      <Navbar />

      <div className="login-page">
        <div className="login-container">
          <LoginHeader />

          <div className="login-card">
            <LoginRoleToggle
              selectedRole={selectedRole}
              setSelectedRole={setSelectedRole}
            />
            <LoginForm selectedRole={selectedRole} />
            <DemoCredentials selectedRole={selectedRole} />
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;