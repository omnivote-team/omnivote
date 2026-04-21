const CandidateFormHeader = ({ onBack }) => {
  return (
    <div className="candidate-header">
      <button className="back-btn" onClick={onBack}>← Back to Dashboard</button>
      <h1>Apply as Candidate</h1>
      <p>Submit your candidacy for an upcoming election</p>
    </div>
  );
};

export default CandidateFormHeader;