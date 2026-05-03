import { useEffect, useState } from "react";
import { getMyProfile } from "../api/authApi";

function UserWelcomeSection() {
  const [name, setName] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await getMyProfile();
        setName(profile.full_name);
      } catch (error) {
        console.log("Failed to load user name", error);
      }
    };

    loadProfile();
  }, []);

  return (
    <div className="user-welcome-section">
      <div className="user-welcome-text">
        <h2>Welcome back{name ? `, ${name}` : ""}</h2>
        <p>Here is what's happening with elections today.</p>
      </div>
    </div>
  );
}

export default UserWelcomeSection;