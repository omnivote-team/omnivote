import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import { getAdminElectionDetails, updateElection } from "../api/electionApi";
import "./CreateElectionPage.css";
import {
  getInstitutions,
  getDepartments,
  getBatches,
  getSections,
} from "../api/referenceApi";

function AdminEditElectionPage() {
  const { election_id } = useParams();
  const navigate = useNavigate();

  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [institutions, setInstitutions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [batches, setBatches] = useState([]);
  const [sections, setSections] = useState([]);


  const [formData, setFormData] = useState({
      title: "",
      description: "",
      election_type: "",
      start_datetime: "",
      end_datetime: "",

      institution_id: "",
      department_id: "",
      batch_id: "",
      section_id: "",
});

  useEffect(() => {
    loadElection();
  }, [election_id]);

  useEffect(() => {
  loadInstitutions();
}, []);

  useEffect(() => {
    if (formData.institution_id) {
      loadDepartments(formData.institution_id);
      loadBatches(formData.institution_id);
    }
  }, [formData.institution_id]);

  useEffect(() => {
    if (
      formData.institution_id &&
      formData.department_id &&
      formData.batch_id
    ) {
      loadSections(
        formData.institution_id,
        formData.department_id,
        formData.batch_id
      );
    }
  }, [
    formData.institution_id,
    formData.department_id,
    formData.batch_id,
  ]);

  const loadElection = async () => {
    try {
      const data = await getAdminElectionDetails(election_id);

      if (data.status !== "upcoming") {
        setError("Only upcoming elections can be edited.");
        return;
      }

      setElection(data);
       setFormData({
          title: data.title || "",
          description: data.description || "",
          election_type: data.election_type || "",
          start_datetime: data.start_datetime?.slice(0, 16) || "",
          end_datetime: data.end_datetime?.slice(0, 16) || "",

          institution_id: data.institution_id || "",
          department_id: data.department_id || "",
          batch_id: data.batch_id || "",
          section_id: data.section_id || "",
        });
    } catch (err) {
      console.error("Failed to load election", err);
      setError("Failed to load election details.");
    } finally {
      setLoading(false);
    }
  };

  const loadInstitutions = async () => {
  const data = await getInstitutions();
  setInstitutions(data);
};

const loadDepartments = async (institutionId) => {
  const data = await getDepartments(institutionId);
  setDepartments(data);
};

const loadBatches = async (institutionId) => {
  const data = await getBatches(institutionId);
  setBatches(data);
};

const loadSections = async (
  institutionId,
  departmentId,
  batchId
) => {
  const data = await getSections(
    institutionId,
    departmentId,
    batchId
  );

  setSections(data);
};

  const handleChange = (e) => {
  setFormData((prev) => ({
    ...prev,
    [e.target.name]: e.target.value,
  }));
};


const handleInstitutionChange = (e) => {
  const value = e.target.value;

  setFormData((prev) => ({
    ...prev,
    institution_id: value,
    department_id: "",
    batch_id: "",
    section_id: "",
  }));

  setDepartments([]);
  setBatches([]);
  setSections([]);
};

const handleDepartmentChange = (e) => {
  const value = e.target.value;

  setFormData((prev) => ({
    ...prev,
    department_id: value,
    section_id: "",
  }));

  setSections([]);
};

const handleBatchChange = (e) => {
  const value = e.target.value;

  setFormData((prev) => ({
    ...prev,
    batch_id: value,
    section_id: "",
  }));

  setSections([]);
};

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (new Date(formData.end_datetime) <= new Date(formData.start_datetime)) {
    setError("End date and time must be after start date and time.");
    return;
  }

  const payload = {
    title: formData.title,
    description: formData.description,
    election_type: formData.election_type,
    start_datetime: formData.start_datetime,
    end_datetime: formData.end_datetime,

    institution_id: formData.institution_id
    ? Number(formData.institution_id)
    : null,

    new_institution_name: null,

    department_id: formData.department_id
      ? Number(formData.department_id)
      : null,

    new_department_name: null,

    batch_id: formData.batch_id
      ? Number(formData.batch_id)
      : null,

    new_batch_name: null,

    section_id: formData.section_id
      ? Number(formData.section_id)
      : null,

    new_section_name: null,
      };

  try {
    await updateElection(election_id, payload);
    navigate(`/admin/elections/${election_id}`, {
      state: {
        successMessage: "Election updated successfully.",
      },
});
  } catch (err) {
    console.error("Update election error:", err);
    setError(
      err.response?.data?.detail ||
        err.response?.data?.message ||
        "Failed to update election."
    );
  }
};

  if (loading) {
    return (
      <div className="create-election-page">
        <AdminNavbar />
        <div className="create-election-container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="create-election-page">
        <AdminNavbar />
        <div className="create-election-container">
          <button
            className="back-link"
            onClick={() => navigate(`/admin/elections/${election_id}`)}
          >
            ← Back to Election Details
          </button>

          <p className="create-election-error">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="create-election-page">
      <AdminNavbar />

      <div className="create-election-container">
        <button
          className="back-link"
          onClick={() => navigate(`/admin/elections/${election_id}`)}
        >
          ← Back to Election Details
        </button> 

        <h1>Edit Election</h1>
    <p>Update the basic election details.</p>

    {error && <p className="create-election-error">{error}</p>}

    <form className="create-election-form" onSubmit={handleSubmit}>
      <label>
        Election Title <span className="required-star">*</span>
      </label>
      <input
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
      />

      <label>Description</label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
      />

      <label>
        Election Type <span className="required-star">*</span>
      </label>
      <select
        name="election_type"
        value={formData.election_type}
        onChange={handleChange}
        required
      >
        <option value="" disabled>
          Select election type
        </option>
        <option value="student_council">Student Council</option>
        <option value="class_representative">Class Representative</option>
        <option value="society_election">Society Election</option>
        <option value="department_election">Department Election</option>
        <option value="general_election">General Election</option>
      </select>

      <label>
        Start Date and Time <span className="required-star">*</span>
      </label>
      <input
        type="datetime-local"
        name="start_datetime"
        value={formData.start_datetime}
        onChange={handleChange}
        required
      />

      <label>
        End Date and Time <span className="required-star">*</span>
      </label>
      <input
        type="datetime-local"
        name="end_datetime"
        value={formData.end_datetime}
        onChange={handleChange}
        min={formData.start_datetime}
        required
      />

      <label>
        Institution <span className="required-star">*</span>
      </label>
      <select
        name="institution_id"
        value={formData.institution_id}
        onChange={handleInstitutionChange}
        required
      >
        <option value="" disabled>
          Select institution
        </option>

        {institutions.map((institution) => (
          <option key={institution.id} value={institution.id}>
            {institution.name}
          </option>
        ))}
      </select>

      <label>Department Optional</label>
      <select
        name="department_id"
        value={formData.department_id || ""}
        onChange={handleDepartmentChange}
        disabled={!formData.institution_id}
      >
        <option value="">No department restriction</option>

        {departments.map((department) => (
          <option key={department.id} value={department.id}>
            {department.name}
          </option>
        ))}
      </select>

      <label>Batch Optional</label>
      <select
        name="batch_id"
        value={formData.batch_id || ""}
        onChange={handleBatchChange}
        disabled={!formData.institution_id}
      >
        <option value="">No batch restriction</option>

        {batches.map((batch) => (
          <option key={batch.id} value={batch.id}>
            {batch.name}
          </option>
        ))}
      </select>

      <label>Section Optional</label>
      <select
        name="section_id"
        value={formData.section_id || ""}
        onChange={handleChange}
        disabled={
          !formData.institution_id ||
          !formData.department_id ||
          !formData.batch_id
        }
      >
        <option value="">No section restriction</option>

        {sections.map((section) => (
          <option key={section.id} value={section.id}>
            {section.name}
          </option>
        ))}
      </select>

      <button type="submit" className="create-election-submit">
        Save Changes
      </button>
    </form>
          </div>
        </div>
      );
}

export default AdminEditElectionPage;