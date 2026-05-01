import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";
import API from "../api/api";
import "./VotePage.css";

function VotePage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [election, setElection] = useState(null);
  const [selectedCandidateId, setSelectedCandidateId] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchElection = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await API.get(`/user/elections/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(response.data);
        setElection(response.data);
      } catch (error) {
        console.log(error);
        alert("Failed to load voting page.");
      } finally {
        setLoading(false);
      }
    };

    fetchElection();
  }, [id]);

  const handleSubmitVote = async () => {
    if (!selectedCandidateId) {
      alert("Please select a candidate first.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await API.post(
        "/votes/",
        {
          election_id: Number(id),
          candidate_id: Number(selectedCandidateId),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Vote submitted successfully.");
      navigate(`/user-elections/${id}`);
    } catch (error) {
      console.log(error);
      setMessage(error.response?.data?.detail || "Failed to submit vote.");
    }
  };

  if (loading) {
    return (
      <>
        <UserNavbar />
        <div className="vote-page">
          <div className="vote-container">
            <div className="vote-card">
              <h1>Loading voting page...</h1>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!election) {
    return (
      <>
        <UserNavbar />
        <div className="vote-page">
          <div className="vote-container">
            <div className="vote-card">
              <h1>Election not found</h1>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <UserNavbar />

      <div className="vote-page">
        <div className="vote-container">
          <button
            className="vote-back-button"
            onClick={() => navigate(`/user-elections/${id}`)}
          >
            ← Back to Election Details
          </button>

          <div className="vote-card">
            <div className="vote-header-row">
              <div>
                <h1>{election.title}</h1>
                <p>{election.institution_name}</p>
              </div>

              <span className="vote-status-badge">{election.status}</span>
            </div>

            <div className="vote-info-box">
              <strong>
                Voting as: {JSON.parse(localStorage.getItem("user"))?.full_name}
                </strong>
                <p>Your vote is anonymous and cannot be changed once submitted.</p>
            </div>
            {message && <div className="vote-message">{message}</div>}
            <h2>Select Your Candidate</h2>

            <div className="vote-candidate-list">
              {election.candidates && election.candidates.length > 0 ? (
                election.candidates.map((candidate) => (
                  <label
                    className={
                      selectedCandidateId === String(candidate.id)
                        ? "vote-candidate-card selected"
                        : "vote-candidate-card"
                    }
                    key={candidate.id}
                  >
                    <input
                      type="radio"
                      name="candidate"
                      value={candidate.id}
                      checked={selectedCandidateId === String(candidate.id)}
                      onChange={(e) => setSelectedCandidateId(e.target.value)}
                    />

                    <div>
                      <h3>{candidate.candidate_name}</h3>
                      <p>{candidate.manifesto || "No manifesto added."}</p>
                    </div>
                  </label>
                ))
              ) : (
                <p>No candidates available for this election.</p>
              )}
            </div>

            <button className="submit-vote-btn" onClick={handleSubmitVote}>
              Submit Vote
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default VotePage;