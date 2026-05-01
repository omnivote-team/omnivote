import { useNavigate } from "react-router-dom";
import { BadgeCheck, Calendar, FileText } from "lucide-react";
import UserStatCard from "./UserStatCard";

function UserStatsSection() {
  const navigate = useNavigate();

  return (
    <div className="user-stats-section">
      <UserStatCard
        title="Eligible Elections"
        value="2"
        icon={<BadgeCheck size={28} />}
        iconClassName="green"
      />

      <UserStatCard
        title="Upcoming Elections"
        value="2"
        icon={<Calendar size={28} />}
        iconClassName="blue"
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