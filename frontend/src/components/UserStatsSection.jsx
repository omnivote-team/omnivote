import { BadgeCheck, Calendar, CheckCircle } from "lucide-react";
import UserStatCard from "./UserStatCard";

function UserStatsSection() {
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
        title="Completed Votes"
        value="1"
        icon={<CheckCircle size={28} />}
        iconClassName="purple"
      />
    </div>
  );
}

export default UserStatsSection;