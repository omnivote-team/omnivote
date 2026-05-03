import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BadgeCheck, Calendar, FileText } from "lucide-react";
import UserStatCard from "./UserStatCard";
import { getEligibleElectionsForApplication } from "../api/candidateApplicationApi";
import API from "../api/api";

function UserStatsSection() {
  const navigate = useNavigate();

  const [eligibleCount, setEligibleCount] = useState(0);
  const [upcomingCount, setUpcomingCount] = useState(0);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const eligibleElections = await getEligibleElectionsForApplication();
      setEligibleCount(eligibleElections.length);

      const response = await API.get("/public/elections/");
      const upcoming = response.data.filter(
        (election) => election.status === "upcoming"
      );

      setUpcomingCount(upcoming.length);
    } catch (error) {
      console.log("Failed to load user stats", error);
    }
  };

  return (
    <div className="user-stats-section">
      <UserStatCard
        title="Eligible Elections"
        value={eligibleCount}
        icon={<BadgeCheck size={28} />}
        iconClassName="green"
        onClick={() => navigate("/apply-candidate")}
      />

      <UserStatCard
        title="Upcoming Elections"
        value={upcomingCount}
        icon={<Calendar size={28} />}
        iconClassName="blue"
        onClick={() => navigate("/user-elections")}
      />

      <UserStatCard
        title="View My Applications"
        value=""
        icon={<FileText size={28} />}
        iconClassName="purple"
        onClick={() => navigate("/my-applications")}
      />
    </div>
  );
}

export default UserStatsSection;