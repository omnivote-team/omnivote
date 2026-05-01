import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";
import CandidateFormHeader from "../components/CandidateFormHeader";
import ElectionDropdown from "../components/ElectionDropdown";
import CandidateFormFields from "../components/CandidateFormFields";
import CandidateFormNote from "../components/CandidateFormNote";
import "./ApplyAsCandidate.css";
import API from "../api/api";

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

      await API.post(
        "/candidate-applications/",
        {
          election_id: Number(selectedElection),
          manifesto: formData.manifesto,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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