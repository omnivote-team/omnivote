const CandidateFormNote = ({ onSubmit, disabled }) => {
  return (
    <>
      <div className="note-box">
        <p>
          <strong>Note:</strong> Your application will be reviewed by the admin.
          You will be notified once your application is approved or rejected.
        </p>
      </div>
      <button
        className="submit-btn"
        onClick={onSubmit}
        disabled={disabled}
      >
        Submit Application
      </button>
    </>
  );
};

export default CandidateFormNote;