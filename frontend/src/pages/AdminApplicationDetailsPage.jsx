import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAdminApplicationDetails } from "../api/adminApplicationApi";
import { decideCandidateApplication } from "../api/candidateApplicationApi";
import AdminNavbar from "../components/AdminNavbar";
import "./AdminApplicationDetailsPage.css";


function AdminApplicationDetailsPage() {
  const { id } = useParams();

  const [application, setApplication] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [remarks, setRemarks] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadApplicationDetails();
  }, [id]);

  const loadApplicationDetails = async () => {
    try {
      const data = await getAdminApplicationDetails(id);

      setApplication(data);
    } catch (error) {
      console.error("Failed to load application details", error);
    }
  };

  const handleApprove = async () => {
  try {
    await decideCandidateApplication(application.id, {
      status: "approved",
      remarks: null,
    });

    loadApplicationDetails();
  } catch (error) {
    console.error("Failed to approve application", error);
    alert("Failed to approve application.");
  }
};


const handleReject = async () => {
  if (!remarks || !remarks.trim()) {
    alert("Please enter rejection remarks.");
    return;
  }

  try {
    await decideCandidateApplication(application.id, {
      status: "rejected",
      remarks: remarks,
    });

    setShowRejectModal(false);
    setRemarks("");

    loadApplicationDetails();
  } catch (error) {
    console.error("Failed to reject application", error);
    alert("Failed to reject application.");
  }
};

  if (!application) {
    return <p>Loading...</p>;
  }

  

 return (
  <div className="admin-application-details-page">
    <div className="admin-application-details-container">
      <AdminNavbar />

      <div className="application-details-card">
        <button
            className="back-button"
            onClick={() => navigate("/admin-applications")}
            >
            ← Back to Applications
        </button>

        <h1>{application.applicant_name}</h1>

        <p>Status: {application.status}</p>
        <p>Email: {application.applicant_email}</p>
        <p>Student ID: {application.student_id}</p>
        <p>Election: {application.election_title}</p>
        <p>Institution: {application.institution_name}</p>
        <p>Department: {application.department_name}</p>
        <p>Batch: {application.batch_name}</p>
        <p>Section: {application.section_name}</p>
        <p>Manifesto: {application.manifesto}</p>
        <p>Applied At:{" "} {new Date(application.created_at).toLocaleString()}</p>

        {application.status === "rejected" && (
          <p>Remarks: {application.remarks}</p>
        )}

        {application.status === "pending" && (
          <div className="application-details-actions">
            <button onClick={handleApprove}>Approve</button>

            <button onClick={() => setShowRejectModal(true)}>
              Reject
            </button>
          </div>
        )}
      </div>

      {showRejectModal && (
        <div className="reject-modal-overlay">
          <div className="reject-modal">
            <h2>Reject Application</h2>

            <textarea
              placeholder="Enter rejection remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />

            <div className="reject-modal-actions">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRemarks("");
                }}
              >
                Cancel
              </button>

              <button onClick={handleReject}>
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


export default AdminApplicationDetailsPage;