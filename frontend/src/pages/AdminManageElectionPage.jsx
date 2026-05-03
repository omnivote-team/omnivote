import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAdminElections, deleteElection } from "../api/electionApi";
import AdminNavbar from "../components/AdminNavbar";
import "./AdminManageElectionPage.css";

function AdminManageElectionPage() {
  const [elections, setElections] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.successMessage;

 useEffect(() => {
  setLoading(true);
  setError("");
  loadElections();
}, [location.key]);

  const loadElections = async () => {
    try {
      const data = await getAdminElections();
      setElections(data);
    } catch (err) {
      console.error("Failed to load elections", err);
      setError("Failed to load elections.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteElection(deleteId);
      setElections((prev) => prev.filter((e) => e.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      alert(err.response?.data?.detail || "Delete failed.");
    }
  };

  const filtered = elections.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase())
  );

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

  return (
    <div className="app-page admin-election-list-page">
      <AdminNavbar />

      <div className="admin-election-list-container">

        <div className="admin-election-list-header">
          <div>
            <button
              className="back-link"
              onClick={() => navigate("/admin-dashboard")}
            >
              ← Back to Admin Dashboard
            </button>
            <h1>Manage Elections</h1>
          </div>
          <button
            className="create-btn"
            onClick={() => navigate("/admin/elections/create")}
          >
            + Create Election
          </button>
        </div>

        <input
          type="text"
          className="admin-election-search"
          placeholder="Search elections..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {successMessage && (
        <p className="admin-election-success">{successMessage}</p>
        )}

        {error && <p className="admin-election-error">{error}</p>}

        {loading ? (
          <p className="admin-election-loading">Loading...</p>
        ) : (
          <div className="admin-election-table-wrapper">
            <table className="admin-election-table">
              <thead>
                <tr>
                  <th>Election</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="admin-election-empty">
                      No elections found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((election) => (
                    <tr key={election.id}>
                      <td className="admin-election-title">{election.title}</td>
                      <td>
                        <span className={`admin-election-status ${getStatusClass(election.status)}`}>
                          {getStatusLabel(election.status)}
                        </span>
                      </td>
                      <td>
                        <div className="admin-election-actions">
                          <button
                            className="action-btn view-btn"
                            onClick={() => navigate(`/admin/elections/${election.id}`)}
                            title="View Details"
                          >
                            👁
                          </button>
                          {election.status === "upcoming" ? (
                            <button
                              className="action-btn delete-btn"
                              onClick={() => setDeleteId(election.id)}
                              title="Delete Election"
                            >
                              🗑
                            </button>
                          ) : (
                            <button
                              className="delete-btn-disabled"
                              disabled
                              title="Cannot delete ongoing or past elections"
                            >
                              🗑
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {deleteId && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Delete Election?</h2>
            <p>This action cannot be undone. The election will be permanently removed.</p>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setDeleteId(null)}>
                Cancel
              </button>
              <button className="modal-confirm" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminManageElectionPage;