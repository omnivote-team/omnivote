import { BrowserRouter, Routes, Route } from "react-router-dom"
import DashboardPage from "./pages/DashboardPage"
import ElectionListPage from "./pages/ElectionListPage"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage";
import UserHomePage from "./pages/UserHomePage";
import UserProfilePage from "./pages/UserProfilePage";
import UserElectionListPage from "./pages/UserElectionListPage";
import ApplyAsCandidate from "./pages/ApplyAsCandidate";
import UserElectionDetailsPage from "./pages/UserElectionDetailsPage";
import VotePage from "./pages/VotePage";
import MyApplicationsPage from "./pages/MyApplicationsPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminApplicationsPage from "./pages/AdminApplicationsPage";
import AdminApplicationDetailsPage from "./pages/AdminApplicationDetailsPage";
import AdminManageElectionPage from "./pages/AdminManageElectionPage";
import AdminElectionDetailsPage from "./pages/AdminElectionDetailsPage";
import CreateElectionPage from "./pages/CreateElectionPage";
import AdminEditElectionPage from "./pages/AdminEditElectionPage";
import VotingHistoryPage from "./pages/VotingHistoryPage";
import "./App.css"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/elections" element={<ElectionListPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/user-home" element={<UserHomePage />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/dashboard" element={<UserHomePage />} />
        <Route path="/user-elections" element={<UserElectionListPage />} />
        <Route path="/user-elections/:id" element={<UserElectionDetailsPage />} />
        <Route path="/apply-candidate" element={<ApplyAsCandidate />} />
        <Route path="/vote/:id" element={<VotePage />} />
        <Route path="/my-applications" element={<MyApplicationsPage />} />
        <Route path="/history" element={<VotingHistoryPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin-applications" element={<AdminApplicationsPage />} />
        <Route path="/admin-applications/:id" element={<AdminApplicationDetailsPage />} />
        <Route path="/admin/elections" element={<AdminManageElectionPage />} />
         <Route path="/admin/elections/create" element={<CreateElectionPage />} />
        <Route path="/admin/elections/:election_id/edit" element={<AdminEditElectionPage />} />
        <Route path="/admin/elections/:election_id" element={<AdminElectionDetailsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App