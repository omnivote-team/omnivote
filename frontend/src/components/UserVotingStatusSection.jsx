import { useEffect, useState } from "react";
import API from "../api/api";
import VotingStatusRow from "./VotingStatusRow";

function UserVotingStatusSection() {
  const [votingHistory, setVotingHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVotingHistory();
  }, []);

  const loadVotingHistory = async () => {
    try {
      const response = await API.get("/votes/my-history");
      setVotingHistory(response.data);
    } catch (error) {
      console.log("Failed to load voting history", error);
      setVotingHistory([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="user-voting-status-section">
      <div className="voting-status-container">
        <h2>My Voting Status</h2>

        <div className="voting-status-list">
          {loading ? (
            <p>Loading voting history...</p>
          ) : votingHistory.length > 0 ? (
            votingHistory.map((vote, index) => (
              <VotingStatusRow
                key={vote.id}
                title={vote.election_title}
                subtext={`Candidate ID: ${vote.candidate_id}`}
                status="Voted"
                isLast={index === votingHistory.length - 1}
              />
            ))
          ) : (
            <p className="voting-history-empty">
              You have not voted in any election yet.
            </p>
          )}
        </div>

        <a href="/history" className="voting-history-link">
          View Full History →
        </a>
      </div>
    </section>
  );
}

export default UserVotingStatusSection;