const CandidateFormFields = ({ formData, onChange }) => {
  return (
    <>
      <div className="form-group">
        <label>Candidate Name</label>
        <input
          type="text"
          placeholder="John Doe"
          value={formData.name}
          onChange={(e) => onChange("name", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={(e) => onChange("email", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Candidate Statement / Manifesto</label>
        <textarea
          placeholder="Explain why you want to run and what you plan to do if elected..."
          value={formData.manifesto}
          onChange={(e) => onChange("manifesto", e.target.value)}
          rows={6}
        />
        {formData.manifesto.length > 0 && formData.manifesto.length < 50 && (
          <span className="field-hint">Minimum 50 characters required</span>
        )}
      </div>
    </>
  );
};

export default CandidateFormFields;