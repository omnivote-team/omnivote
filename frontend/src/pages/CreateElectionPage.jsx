import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import { createElection } from "../api/electionApi";
import {
  getInstitutions,
  getDepartments,
  getBatches,
  getSections,
} from "../api/referenceApi";
import "./CreateElectionPage.css";

function CreateElectionPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    election_type: "",
    start_datetime: "",
    end_datetime: "",

    institution_id: "",
    new_institution_name: "",

    department_id: "",
    new_department_name: "",

    batch_id: "",
    new_batch_name: "",

    section_id: "",
    new_section_name: "",
  });

  const [institutions, setInstitutions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [batches, setBatches] = useState([]);
  const [sections, setSections] = useState([]);

  const [institutionMode, setInstitutionMode] = useState("existing");
  const [departmentMode, setDepartmentMode] = useState("none");
  const [batchMode, setBatchMode] = useState("none");
  const [sectionMode, setSectionMode] = useState("none");

  const [error, setError] = useState("");

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
  }, [formData.institution_id, formData.department_id, formData.batch_id]);

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

  const loadSections = async (institutionId, departmentId, batchId) => {
    const data = await getSections(institutionId, departmentId, batchId);
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

    if (value === "new") {
      setInstitutionMode("new");
      setDepartments([]);
      setBatches([]);
      setSections([]);
      setDepartmentMode("none");
      setBatchMode("none");
      setSectionMode("none");

      setFormData((prev) => ({
        ...prev,
        institution_id: "",
        department_id: "",
        batch_id: "",
        section_id: "",
      }));
    } else {
      setInstitutionMode("existing");
      setDepartmentMode("none");
      setBatchMode("none");
      setSectionMode("none");

      setFormData((prev) => ({
        ...prev,
        institution_id: value,
        new_institution_name: "",
        department_id: "",
        new_department_name: "",
        batch_id: "",
        new_batch_name: "",
        section_id: "",
        new_section_name: "",
      }));
    }
  };

  const handleDepartmentChange = (e) => {
    const value = e.target.value;

    if (value === "new") {
      setDepartmentMode("new");
      setFormData((prev) => ({...prev,
        department_id: "",
        section_id: "",
        new_section_name: "",
        }));
    } else if (value === "none") {
      setDepartmentMode("none");
      setFormData((prev) => ({
        ...prev,
        department_id: "",
        new_department_name: "",
        section_id: "",
        new_section_name: "",
      }));
    } else {
      setDepartmentMode("existing");
      setFormData((prev) => ({
        ...prev,
        department_id: value,
        new_department_name: "",
        section_id: "",
        new_section_name: "",
        }));
    }
  };

  const handleBatchChange = (e) => {
    const value = e.target.value;

    if (value === "new") {
      setBatchMode("new");
      setFormData((prev) => ({
        ...prev,
        batch_id: "",
        section_id: "",
        new_section_name: "",
        }));
    } else if (value === "none") {
      setBatchMode("none");
      setFormData((prev) => ({
        ...prev,
        batch_id: "",
        new_batch_name: "",
        section_id: "",
        new_section_name: "",
      }));
    } else {
      setBatchMode("existing");
      setFormData((prev) => ({
        ...prev,
        batch_id: value,
        new_batch_name: "",
        section_id: "",
        new_section_name: "",
        }));
    }
  };

  const handleSectionChange = (e) => {
    const value = e.target.value;

    if (value === "new") {
      setSectionMode("new");
      setFormData((prev) => ({
        ...prev,
        section_id: "",
      }));
    } else if (value === "none") {
      setSectionMode("none");
      setFormData((prev) => ({
        ...prev,
        section_id: "",
        new_section_name: "",
      }));
    } else {
      setSectionMode("existing");
      setFormData((prev) => ({
        ...prev,
        section_id: value,
        new_section_name: "",
      }));
    }
  };

  const getSelectedName = (items, id) => {
  const selectedItem = items.find((item) => String(item.id) === String(id));
  return selectedItem ? selectedItem.name : "";
};

const institutionName =
  institutionMode === "new"
    ? formData.new_institution_name
    : getSelectedName(institutions, formData.institution_id);

const departmentName =
  departmentMode === "new"
    ? formData.new_department_name
    : departmentMode === "existing"
    ? getSelectedName(departments, formData.department_id)
    : "No department restriction";

const batchName =
  batchMode === "new"
    ? formData.new_batch_name
    : batchMode === "existing"
    ? getSelectedName(batches, formData.batch_id)
    : "No batch restriction";

const sectionName =
  sectionMode === "new"
    ? formData.new_section_name
    : sectionMode === "existing"
    ? getSelectedName(sections, formData.section_id)
    : "No section restriction";

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

      institution_id:
        institutionMode === "existing" ? Number(formData.institution_id) : null,
      new_institution_name:
        institutionMode === "new" ? formData.new_institution_name : null,

      department_id:
        departmentMode === "existing" && formData.department_id
          ? Number(formData.department_id)
          : null,
      new_department_name:
        departmentMode === "new" ? formData.new_department_name : null,

      batch_id:
        batchMode === "existing" && formData.batch_id
          ? Number(formData.batch_id)
          : null,
      new_batch_name: batchMode === "new" ? formData.new_batch_name : null,

      section_id:
        sectionMode === "existing" && formData.section_id
          ? Number(formData.section_id)
          : null,
      new_section_name:
        sectionMode === "new" ? formData.new_section_name : null,
    };

    try {
      await createElection(payload);
        navigate("/admin/elections", {
        state: { successMessage: "Election created successfully." },
    });
    } catch (err) {
  console.error("Create election error:", err);
  console.error("Backend response:", err.response?.data);

  setError(
    err.response?.data?.detail ||
    err.response?.data?.message ||
    "Failed to create election."
  );
}
  };

  return (
    <div className="create-election-page">
      <AdminNavbar />

      <div className="create-election-container">
        <button
          className="back-link"
          onClick={() => navigate("/admin-dashboard")}
        >
          ← Back to Admin Dashboard
        </button>

        <h1>Create New Election</h1>
        <p>Create an election and define who is eligible for it.</p>

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
            value={
              institutionMode === "new" ? "new" : formData.institution_id
            }
            onChange={handleInstitutionChange}
            required
          >
            <option value="" disabled>
              Select institution
            </option>
            <option value="new">Add new institution</option>

            {institutions.map((institution) => (
              <option key={institution.id} value={institution.id}>
                {institution.name}
              </option>
            ))}
          </select>

          {institutionMode === "new" && (
            <input
              name="new_institution_name"
              value={formData.new_institution_name}
              onChange={handleChange}
              placeholder="Enter new institution name"
              required
            />
          )}

          <label>Department Optional</label>
          <select
            name="department_id"
            value={
              departmentMode === "new"
                ? "new"
                : departmentMode === "none"
                ? "none"
                : formData.department_id
            }
            onChange={handleDepartmentChange}
            disabled={institutionMode === "existing" && !formData.institution_id}
          >
            <option value="none">No department restriction</option>
            <option value="new">Add new department</option>

            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>

          {departmentMode === "new" && (
            <input
              name="new_department_name"
              value={formData.new_department_name}
              onChange={handleChange}
              placeholder="Enter new department name"
            />
          )}

          <label>Batch Optional</label>
          <select
            name="batch_id"
            value={
              batchMode === "new"
                ? "new"
                : batchMode === "none"
                ? "none"
                : formData.batch_id
            }
            onChange={handleBatchChange}
            disabled={institutionMode === "existing" && !formData.institution_id}
          >
            <option value="none">No batch restriction</option>
            <option value="new">Add new batch</option>

            {batches.map((batch) => (
              <option key={batch.id} value={batch.id}>
                {batch.name}
              </option>
            ))}
          </select>

          {batchMode === "new" && (
            <input
              name="new_batch_name"
              value={formData.new_batch_name}
              onChange={handleChange}
              placeholder="Enter new batch name"
            />
          )}

          <label>Section Optional</label>
          <select
            name="section_id"
            value={
              sectionMode === "new"
                ? "new"
                : sectionMode === "none"
                ? "none"
                : formData.section_id
            }
            onChange={handleSectionChange}
            disabled={institutionMode === "existing" && !formData.institution_id}
          >
            <option value="none">No section restriction</option>
            <option value="new">Add new section</option>

            {sections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.name}
              </option>
            ))}
          </select>

          {sectionMode === "new" && (
            <input
              name="new_section_name"
              value={formData.new_section_name}
              onChange={handleChange}
              placeholder="Enter new section name"
            />
          )}
                <div className="eligibility-summary">
                <h3>Eligibility Summary</h3>

                <p>
                    <strong>Institution:</strong>{" "}
                    {institutionName || "Not selected yet"}
                </p>

                <p>
                    <strong>Department:</strong>{" "}
                    {departmentName}
                </p>

                <p>
                    <strong>Batch:</strong>{" "}
                    {batchName}
                </p>

                <p>
                    <strong>Section:</strong>{" "}
                    {sectionName}
                </p>
                </div>

          <button type="submit" className="create-election-submit">
            Create Election
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateElectionPage;