import { useNavigate } from "react-router-dom";
import ElectionCard from "./ElectionCard";
import mockElections from "../data/mockElections";

function UserOngoingElectionsSection() {
  const navigate = useNavigate();

  const ongoingElections = mockElections.filter(
    (election) => election.status === "Ongoing"
  );

  const handleViewDetails = (election) => {
    navigate(`/user-elections/${election.id}`);
  };

  return (
    <section className="user-ongoing-elections-section">
      <div className="section-header">
        <h2>Ongoing Elections</h2>
        <a href="/user-elections">View All</a>
      </div>

      <div className="election-list-container">
        {ongoingElections.map((election) => (
          <ElectionCard
            key={election.id}
            election={election}
            onViewDetails={() => handleViewDetails(election)}
          />
        ))}
      </div>
    </section>
  );
}

export default UserOngoingElectionsSection;