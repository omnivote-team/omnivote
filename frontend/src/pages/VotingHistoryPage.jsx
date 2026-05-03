import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";
import API from "../api/api";
import "./VotingHistoryPage.css";

function VotingHistoryPage() {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVotingHistory();
  }, []);

  const loadVotingHistory = async () => {
    try {
      const response = await API.get("/votes/my-history");
      setHistory(response.data);
    } catch (error) {
      console.log("Failed to load voting history", error);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-page voting-history-page">
      <UserNavbar />

      <div className="voting-history-container">
        <button
          className="voting-history-back-btn"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>

        <div className="voting-history-card">
          <h1>Voting History</h1>
          <p className="voting-history-subtitle">
            View all elections you have voted in.
          </p>

          {loading ? (
            <p>Loading voting history...</p>
          ) : history.length > 0 ? (
            <div className="voting-history-list">
              {history.map((vote) => (
                <div className="voting-history-item" key={vote.id}>
                  <div>
                    <h3>{vote.election_title}</h3>
                    <p>Candidate ID: {vote.candidate_id}</p>
                  </div>

                  <span className="voting-history-status">Voted</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="voting-history-empty-box">
              <h3>No voting history yet</h3>
              <p>You have not voted in any election yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VotingHistoryPage;