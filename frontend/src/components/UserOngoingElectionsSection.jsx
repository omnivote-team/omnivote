import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ElectionCard from "./ElectionCard";
import API from "../api/api";

function UserOngoingElectionsSection() {
  const navigate = useNavigate();

  const [ongoingElection, setOngoingElection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOngoingElection = async () => {
      try {
        const response = await API.get("/public/elections/");

        const ongoing = response.data.find(
          (election) => election.status?.toLowerCase() === "open"
        );

        setOngoingElection(ongoing || null);
      } catch (error) {
        console.log(error);
        setOngoingElection(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOngoingElection();
  }, []);

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
        {loading ? (
          <p>Loading ongoing election...</p>
        ) : ongoingElection ? (
          <ElectionCard
            election={ongoingElection}
            onViewDetails={() => handleViewDetails(ongoingElection)}
          />
        ) : (
          <div className="dashboard-empty-election">
            <h3>No ongoing elections right now</h3>
            <p>When a live election becomes available, it will appear here.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default UserOngoingElectionsSection;