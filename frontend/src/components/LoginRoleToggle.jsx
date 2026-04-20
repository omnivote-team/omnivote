function LoginRoleToggle({ selectedRole, setSelectedRole }) {
  return (
    <div className="login-role-toggle">
      <button
        type="button"
        className={selectedRole === "user" ? "active" : ""}
        onClick={() => setSelectedRole("user")}
      >
        User
      </button>

      <button
        type="button"
        className={selectedRole === "admin" ? "active" : ""}
        onClick={() => setSelectedRole("admin")}
      >
        Admin
      </button>
    </div>
  );
}

export default LoginRoleToggle;