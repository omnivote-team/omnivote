const CandidateFormFields = ({ formData, onChange }) => {
  return (
    <>
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