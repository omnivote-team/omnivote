import ElectionCard from "./ElectionCard";
import mockElections from "../data/mockElections";

function UserOngoingElectionsSection() {
  const ongoingElections = mockElections.filter(
    (election) => election.status === "Ongoing"
  );

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
            title={election.title}
            organization={election.organization}
            status={election.status}
            dates={election.dates}
          />
        ))}
      </div>
    </section>
  );
}

export default UserOngoingElectionsSection;