import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";
import API from "../api/api";
import "./UserElectionDetailsPage.css";

function UserElectionDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateValue) => {
    if (!dateValue) return "N/A";

    return new Date(dateValue).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  useEffect(() => {
    const fetchElectionDetails = async () => {
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
        alert("Failed to load election details.");
      } finally {
        setLoading(false);
      }
    };

    fetchElectionDetails();
  }, [id]);

  if (loading) {
    return (
      <>
        <UserNavbar />
        <div className="election-details-page">
          <h1>Loading election details...</h1>
        </div>
      </>
    );
  }

  if (!election) {
    return (
      <>
        <UserNavbar />
        <div className="election-details-page">
          <h1>Election not found</h1>
          <button onClick={() => navigate("/user-elections")}>
            Back to Elections
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <UserNavbar />

      <div className="election-details-page">
        <div className="election-details-container">
          <button
            className="back-to-elections-btn"
            onClick={() => navigate("/user-elections")}
          >
            ← Back to Elections
          </button>

          <section className="details-main-card">
            <div className="details-header-row">
              <div>
                <h1>{election.title}</h1>
                <p>{election.description}</p>
              </div>

              <span className="details-status-badge">{election.status}</span>
            </div>

            <div className="details-info-grid">
              <div>
                <span>Institution</span>
                <strong>{election.institution_name}</strong>
              </div>

              <div>
                <span>Start Date</span>
                <strong>{formatDate(election.start_datetime)}</strong>
              </div>

              <div>
                <span>Election Type</span>
                <strong>{election.election_type}</strong>
              </div>

              <div>
                <span>End Date</span>
                <strong>{formatDate(election.end_datetime)}</strong>
              </div>
            </div>

            <div className="details-divider"></div>

            <h2>Eligibility</h2>
            <p>
              This election is available based on institution, department,
              batch, and section eligibility rules.
            </p>

            <h2>Rules</h2>
            <ul>
              <li>You must be logged in to vote.</li>
              <li>You must meet the election eligibility criteria.</li>
              <li>You can vote only once in this election.</li>
            </ul>
          </section>

          <section className="details-main-card">
            <h2>Candidates</h2>

            <div className="candidate-details-list">
              {election.candidates && election.candidates.length > 0 ? (
                election.candidates.map((candidate) => (
                  <div className="candidate-details-card" key={candidate.id}>
                    <div className="candidate-avatar">👤</div>

                    <div>
                      <h3>{candidate.candidate_name}</h3>
                    <p>{candidate.manifesto || "No manifesto added."}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No candidates available yet.</p>
              )}
            </div>
          </section>

          <div className="vote-button-container">
            <button
                className="vote-now-btn"
                onClick={() => navigate(`/vote/${election.id}`)}
                >
            Vote Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserElectionDetailsPage;