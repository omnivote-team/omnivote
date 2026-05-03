import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";
import API from "../api/api";
import "./MyApplicationsPage.css";

function MyApplicationsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchApplications = async () => {
    try {
      setLoading(true);

      const response = await API.get("/candidate-applications/my-applications");

      setApplications(response.data);
    } catch (error) {
      console.log(error);
      alert("Failed to load applications.");
    } finally {
      setLoading(false);
    }
  };

  fetchApplications();
}, [location.key]);

  console.log(applications);
  return (
    <div className="my-applications-page">
      <UserNavbar />

      <div className="my-applications-container">
        <button
          className="my-applications-back-btn"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>

        <div className="my-applications-card">
          <h1>My Candidate Applications</h1>
          <p className="my-applications-subtitle">
            Track the status of your submitted candidate applications.
          </p>

          {loading ? (
            <p>Loading applications...</p>
          ) : applications.length > 0 ? (
            <div className="my-applications-list">
              {applications.map((application) => (
                <div className="my-application-item" key={application.id}>
                  <div>
                    <h3>{application.election_title || `Election ID: ${application.election_id}`}</h3>
                    <p className="application-institution">
                    {application.institution_name}
                    </p>
                    <p>{application.manifesto}</p>

                    {application.status === "rejected" && application.remarks && (
                        <p className="application-remarks">
                          <strong>Admin Remarks:</strong> {application.remarks}
                        </p>
                      )}
                    </div>
                  <span className={`application-status ${application.status}`}>
                    {application.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="my-applications-empty">
              <h3>No applications yet</h3>
              <p>
                When you apply as a candidate, your application status will
                appear here.
              </p>
              <button onClick={() => navigate("/apply-candidate")}>
                Apply as Candidate
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyApplicationsPage;