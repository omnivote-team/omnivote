import { useParams, useNavigate } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";
import mockElections from "../data/mockElections";
import "./UserElectionDetailsPage.css";

function UserElectionDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const election = mockElections.find(
    (election) => election.id === Number(id)
  );

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
              <strong>{election.institution}</strong>
            </div>

            <div>
              <span>Start Date</span>
              <strong>{election.startDate}</strong>
            </div>

            <div>
              <span>Category</span>
              <strong>{election.category}</strong>
            </div>

            <div>
              <span>End Date</span>
              <strong>{election.endDate}</strong>
            </div>
          </div>

          <div className="details-divider"></div>

          <h2>Eligibility</h2>
          <p>{election.eligibility}</p>

          <h2>Rules</h2>
          <ul>
            {election.rules.map((rule, index) => (
              <li key={index}>{rule}</li>
            ))}
          </ul>
        </section>

        <section className="details-main-card">
          <h2>Candidates</h2>

          <div className="candidate-details-list">
            {election.candidates.map((candidate) => (
              <div className="candidate-details-card" key={candidate.id}>
                <div className="candidate-avatar">👤</div>

                <div>
                  <h3>{candidate.name}</h3>
                  <p>{candidate.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="vote-button-container">
          <button className="vote-now-btn">Vote Now</button>
        </div>
      </div>
    </div>
  </>
);
}

export default UserElectionDetailsPage;