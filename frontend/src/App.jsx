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
      </Routes>
    </BrowserRouter>
  )
}

export default App