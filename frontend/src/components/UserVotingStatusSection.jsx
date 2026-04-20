import mockVotingStatus from "../data/mockVotingStatus";
import VotingStatusRow from "./VotingStatusRow";

function UserVotingStatusSection() {
  return (
    <section className="user-voting-status-section">
        <div className="voting-status-container">
            <h2>My Voting Status</h2>

            <div className="voting-status-list">
            {mockVotingStatus.map((item, index) => (
                <VotingStatusRow
                key={item.id}
                title={item.title}
                subtext={item.subtext}
                status={item.status}
                isLast={index === mockVotingStatus.length - 1}
                />
            ))}
            </div>

            <a href="/history" className="voting-history-link">
            View Full History →
            </a>
        </div>
    </section>
  );
}

export default UserVotingStatusSection;