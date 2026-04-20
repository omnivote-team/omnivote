import UserNavbar from "../components/UserNavbar";
import UserWelcomeSection from "../components/UserWelcomeSection";
import UserStatsSection from "../components/UserStatsSection";
import UserActionsSection from "../components/UserActionsSection";
import UserOngoingElectionsSection from "../components/UserOngoingElectionsSection";
import UserVotingStatusSection from "../components/UserVotingStatusSection";
import "./UserHomePage.css";

function UserHomePage() {
  return (
    <div className="user-home-page">
      <UserNavbar />

      <div className="user-home-container">
        <UserWelcomeSection />
        <UserStatsSection />
        <UserActionsSection />
        <UserOngoingElectionsSection />
        <UserVotingStatusSection />
      </div>
    </div>
  );
}

export default UserHomePage;