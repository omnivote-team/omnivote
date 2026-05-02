import { useEffect, useState } from "react";
import { getAdminCandidateApplications } from "../api/candidateApplicationApi";
import { getAdminElections } from "../api/electionApi";
import { decideCandidateApplication } from "../api/candidateApplicationApi";
import AdminNavbar from "../components/AdminNavbar";
import "./AdminApplicationsPage.css";
import { useNavigate } from "react-router-dom";


function AdminApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [elections, setElections] = useState([]);
  const [selectedElectionId, setSelectedElectionId] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  const [remarks, setRemarks] = useState("");
  const navigate = useNavigate();
useEffect(() => {
  loadApplications();
  loadElections();
}, [selectedStatus, selectedElectionId]);

    const loadElections = async () => {
  try {
    const data = await getAdminElections();
    console.log("Admin elections:", data);

    setElections(data);
  } catch (error) {
    console.error("Failed to load elections", error);
  }
};

  const loadApplications = async () => {
  try {
    const filters = {};

    if (selectedStatus) {
      filters.status = selectedStatus;
    }
    if (selectedElectionId) {
        filters.election_id = selectedElectionId;
        }

    const data = await getAdminCandidateApplications(filters);

    setApplications(data);
  } catch (error) {
    console.error("Failed to load applications", error);
  }
};

const handleApprove = async (applicationId) => {
  try {
    await decideCandidateApplication(applicationId, {
      status: "approved",
      remarks: null,
    });

    loadApplications();
  } catch (error) {
    console.error("Failed to approve application", error);
    alert("Failed to approve application.");
  }
};

const handleReject = async (applicationId) => {
  if (!remarks || !remarks.trim()) {
    alert("Please enter rejection remarks.");
    return;
  }

  try {
    await decideCandidateApplication(applicationId, {
      status: "rejected",
      remarks: remarks,
    });

    setShowRejectModal(false);
    setSelectedApplicationId(null);
    setRemarks("");

    loadApplications();
  } catch (error) {
    console.error("Failed to reject application", error);
    alert("Failed to reject application.");
  }
};

return (
  <div className="admin-applications-page">
    <div className="admin-applications-container">
      <AdminNavbar />

      <h1>Candidate Applications</h1>

      <div className="admin-application-filters">
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        <select
          value={selectedElectionId}
          onChange={(e) => setSelectedElectionId(e.target.value)}
        >
          <option value="">All Elections</option>

          {elections.map((election) => (
            <option key={election.id} value={election.id}>
              {election.title}
            </option>
          ))}
        </select>
      </div>

      {applications.map((application) => (
            <div
                key={application.id}
                className="admin-application-card"
                onClick={() =>
                navigate(`/admin-applications/${application.id}`)
                }
            >
          <h3>{application.applicant_name}</h3>

          <p>{application.election_title}</p>

          <p>{application.status}</p>

          {application.status === "pending" && (
            <div>
              <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleApprove(application.id);
                }}
                >
                Approve
              </button>

              <button
                onClick={() => {
                  setSelectedApplicationId(application.id);
                  setRemarks("");
                  setShowRejectModal(true);
                }}
              >
                Reject
              </button>
            </div>
          )}
        </div>
      ))}

      {showRejectModal && (
        <div className="reject-modal-overlay">
          <div className="reject-modal">
            <h2>Reject Application</h2>

            <p>Please enter remarks for rejecting this application.</p>

            <textarea
              placeholder="Enter rejection remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />

            <div className="reject-modal-actions">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedApplicationId(null);
                  setRemarks("");
                }}
              >
                Cancel
              </button>

              <button
                onClick={(e) => {
                    e.stopPropagation();

                    setSelectedApplicationId(application.id);
                    setRemarks("");
                    setShowRejectModal(true);
                }}
                >
                Submit Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);
}
export default AdminApplicationsPage;