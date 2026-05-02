import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAdminElectionDetails } from "../api/electionApi";
import AdminNavbar from "../components/AdminNavbar";
import "./AdminManageElectionPage.css";

function AdminElectionDetailsPage() {
  const { election_id } = useParams();
  const navigate = useNavigate();
  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadElectionDetails();
  }, [election_id]);

  const loadElectionDetails = async () => {
    try {
      const data = await getAdminElectionDetails(election_id);
      setElection(data);
    } catch (err) {
      console.error("Failed to load election details", err);
      setError("Failed to load election details.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dt) =>
    new Date(dt).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

  const getStatusClass = (status) => {
        if (status === "open") return "status-ongoing";
        if (status === "upcoming") return "status-upcoming";
        if (status === "closed") return "status-past";
        return "status-past";
    };

    const getStatusLabel = (status) => {
        if (status === "open") return "Ongoing";
        if (status === "upcoming") return "Upcoming";
        if (status === "closed") return "Closed";
        return status;
    };
  const showVotes = ["open", "ongoing", "past"].includes(election?.status);

  // Merge candidate with its manifesto and result
  const enrichedCandidates = election
    ? election.candidates.map((c) => {
        const app = election.applications.find((a) => a.user_id === c.user_id);
        const result = election.results?.find((r) => r.candidate_id === c.id);
        return {
          ...c,
          manifesto: app?.manifesto,
          vote_count: result?.vote_count,
          is_winner: result?.is_winner,
        };
      })
    : [];

  if (loading) return (
    <div className="election-details-page">
      <AdminNavbar />
      <p className="election-details-loading">Loading...</p>
    </div>
  );

  if (error) return (
    <div className="election-details-page">
      <AdminNavbar />
      <p className="election-details-error">{error}</p>
    </div>
  );

  return (
    <div className="election-details-page">
      <AdminNavbar />

      <div className="election-details-container">

        {/* Back */}
        <button
          className="back-link"
          onClick={() => navigate("/admin/elections")}
        >
          ← Back to Manage Elections
        </button>

        {/* Election Info Card */}
        <div className="details-card">
          <div className="details-card-header">
            <div>
              <h1 className="details-title">{election.title}</h1>
              {election.description && (
                <p className="details-description">{election.description}</p>
              )}
            </div>
           <div className="details-header-actions">
           {election.status === "upcoming" && (
            <button
                className="edit-election-btn"
                onClick={() =>
                navigate(`/admin/elections/${election.id}/edit`)
                }
            >
                Edit
            </button>
            )}
            <span className={`election-status ${getStatusClass(election.status)}`}>
                {getStatusLabel(election.status)}
            </span>

            </div>
          </div>
          {/* Meta Grid */}
          <div className="details-meta-grid">
            <div className="details-meta-item">
              <span className="meta-label">Institution</span>
              <span className="meta-value">
                {election.institution_name || `Institution #${election.institution_id}`}
              </span>
            </div>
            <div className="details-meta-item">
              <span className="meta-label">Start Date</span>
              <span className="meta-value">{formatDate(election.start_datetime)}</span>
            </div>
            <div className="details-meta-item">
              <span className="meta-label">Category</span>
              <span className="meta-value">{election.election_type}</span>
            </div>
            <div className="details-meta-item">
              <span className="meta-label">End Date</span>
              <span className="meta-value">{formatDate(election.end_datetime)}</span>
            </div>
            {election.department_name && (
            <div className="details-meta-item">
                <span className="meta-label">Department</span>
                <span className="meta-value">
                {election.department_name}
                </span>
            </div>
            )}
            {election.batch_name && (
            <div className="details-meta-item">
                <span className="meta-label">Batch</span>
                <span className="meta-value">
                {election.batch_name}
                </span>
            </div>
            )}
            {election.section_name && (
            <div className="details-meta-item">
                <span className="meta-label">Section</span>
                <span className="meta-value">
                {election.section_name}
                </span>
            </div>
            )}
          </div>

          {/* Vote Stats — only for ongoing/past */}
          {showVotes && (
            <div className="details-stats-row">
              <div className="details-stat">
                <span className="stat-number">{election.total_votes}</span>
                <span className="stat-label">Total Votes</span>
              </div>
              <div className="details-stat">
                <span className="stat-number">{election.total_candidates}</span>
                <span className="stat-label">Candidates</span>
              </div>
              <div className="details-stat">
                <span className="stat-number">{election.total_applications}</span>
                <span className="stat-label">Applications</span>
              </div>
            </div>
          )}
        </div>

        {/* Candidates Card */}
        <div className="details-card">
          <h2 className="candidates-heading">Candidates</h2>

          {enrichedCandidates.length === 0 ? (
            <p className="no-candidates">No approved candidates yet.</p>
          ) : (
            <div className="candidates-list">
              {enrichedCandidates.map((c) => (
                <div key={c.id} className="candidate-card">
                  <div className="candidate-avatar">
                    <span>👤</span>
                  </div>
                  <div className="candidate-info">
                    <div className="candidate-info-header">
                      <span className="candidate-name">
                        Candidate #{c.user_id}
                      </span>
                      {showVotes && c.vote_count !== undefined && (
                        <div className="candidate-votes">
                          {c.is_winner && (
                            <span className="winner-badge">Winner</span>
                          )}
                          <span className="vote-count">
                            {c.vote_count} votes
                          </span>
                        </div>
                      )}
                    </div>
                    {c.manifesto && (
                      <p className="candidate-manifesto">{c.manifesto}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default AdminElectionDetailsPage;