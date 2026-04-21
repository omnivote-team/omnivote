import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";
import CandidateFormHeader from "../components/CandidateFormHeader";
import ElectionDropdown from "../components/ElectionDropdown";
import CandidateFormFields from "../components/CandidateFormFields";
import CandidateFormNote from "../components/CandidateFormNote";
import "./ApplyAsCandidate.css";

const ApplyAsCandidate = () => {
  const navigate = useNavigate();

  const [selectedElection, setSelectedElection] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    manifesto: "",
  });

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid =
    selectedElection &&
    formData.name.trim() &&
    formData.email.trim() &&
    formData.manifesto.length >= 50;

  const handleSubmit = () => {
    if (!isFormValid) return;
    console.log("Submitting:", { selectedElection, ...formData });
    // TODO: connect to backend API
  };

  return (
    <div className="apply-candidate-page">
      <UserNavbar />

      <div className="apply-candidate-content">
        <CandidateFormHeader onBack={() => navigate("/dashboard")} />

        <div className="apply-candidate-card">
          <ElectionDropdown
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