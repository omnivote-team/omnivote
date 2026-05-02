import { useEffect, useState } from "react";
import { getAdminDashboardSummary } from "../api/dashboardApi";
import AdminStatCard from "../components/AdminStatCard";
import "./AdminDashboardPage.css";
import AdminNavbar from "../components/AdminNavbar";
import { useNavigate } from "react-router-dom";
import AdminActionCard from "../components/AdminActionCard";


function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const data = await getAdminDashboardSummary();

      setStats(data);
    } catch (error) {
      console.error("Failed to load dashboard summary", error);
    }
  };

 return (
  <div className="admin-dashboard-page">
    <div className="admin-dashboard-container">
      <AdminNavbar />

      <div className="admin-dashboard-header">
        <h1>Admin Dashboard</h1>

        <p>Manage elections, candidates, and applications</p>
      </div>

      {stats && (
        <div className="admin-stats-container">
          <AdminStatCard
            title="Total Elections"
            value={stats.total_elections}
          />

          <AdminStatCard
            title="Ongoing Elections"
            value={stats.ongoing_elections}
          />

          <AdminStatCard
            title="Pending Applications"
            value={stats.pending_applications}
          />
        </div>
      )}

      <div className="admin-actions-section">
        <AdminActionCard
          title="Manage Elections"
          description="Create, edit, and manage all elections"
          onClick={() => navigate("/admin/elections")}
        />

        <AdminActionCard
            title="Create New Election"
            description="Set up a new election with eligibility rules"
            onClick={() => navigate("/admin/elections/create")}
        />

        <AdminActionCard
          title="Review Applications"
          description="Approve or reject candidate applications"
          onClick={() => navigate("/admin-applications")}
        />
      </div>
    </div>
  </div>
);
}


export default AdminDashboardPage;