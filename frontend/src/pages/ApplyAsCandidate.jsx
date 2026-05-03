import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";
import CandidateFormHeader from "../components/CandidateFormHeader";
import EligibleElectionDropdown from "../components/EligibleElectionDropdown";
import CandidateFormFields from "../components/CandidateFormFields";
import CandidateFormNote from "../components/CandidateFormNote";
import "./ApplyAsCandidate.css";
import { createCandidateApplication } from "../api/candidateApplicationApi";

const ApplyAsCandidate = () => {
  const navigate = useNavigate();

  const [selectedElection, setSelectedElection] = useState("");
  const [formData, setFormData] = useState({
    manifesto: "",
  });

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid =
    selectedElection && formData.manifesto.trim().length >= 50;

  const handleSubmit = async () => {
    if (!isFormValid) return;

    try {
      const token = localStorage.getItem("token");

      await createCandidateApplication({
          election_id: Number(selectedElection),
          manifesto: formData.manifesto,
        });

      alert("Candidate application submitted successfully.");
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.detail || "Failed to submit application.");
    }
  };

  return (
    <div className="apply-candidate-page">
      <UserNavbar />

      <div className="apply-candidate-content">
        <CandidateFormHeader onBack={() => navigate("/dashboard")} />

        <div className="apply-candidate-card">
          <EligibleElectionDropdown
            value={selectedElection}
            onChange={setSelectedElection}
          />

          <CandidateFormFields
            formData={formData}
            onChange={handleFieldChange}
          />

          <CandidateFormNote
            onSubmit={handleSubmit}
            disabled={!isFormValid}
          />
        </div>
      </div>
    </div>
  );
};

export default ApplyAsCandidate;