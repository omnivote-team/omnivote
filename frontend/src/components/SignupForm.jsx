import { useEffect, useState } from "react";
import {
  getInstitutions,
  getDepartments,
  getBatches,
  getSections,
} from "../api/referenceApi";

import { signupUser } from "../api/authApi";

function SignupForm() {

  const [formData, setFormData] = useState({
  full_name: "",
  email: "",
  student_id: "",
  institution_id: "",
  department_id: "",
  batch_id: "",
  section_id: "",
  password: "",
  confirm_password: "",
});

const [institutions, setInstitutions] = useState([]);
const [departments, setDepartments] = useState([]);
const [batches, setBatches] = useState([]);
const [sections, setSections] = useState([]);

const [error, setError] = useState("");
const [success, setSuccess] = useState("");

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

const handleSubmit = async (e) => {
  setSuccess("");
  e.preventDefault();
  setError("");
  if (formData.password.length < 6) {
    setError("Password must be at least 6 characters.");
    return;
  }

  if (!formData.institution_id || !formData.department_id || !formData.batch_id || !formData.section_id) {
    setError("Please select institution, department, batch, and section.");
    return;
  }

  try {
    const response = await signupUser({
      ...formData,
      institution_id: Number(formData.institution_id),
      department_id: Number(formData.department_id),
      batch_id: Number(formData.batch_id),
      section_id: Number(formData.section_id),
    });

    if (response.error) {
      setError(response.error);
      return;
    }

    setSuccess("Account created successfully! Redirecting to login...");
    setTimeout(() => {
      window.location.href = "/login";
    }, 2000);
  } catch (err) {
    setError("Signup failed.");
  }
};

  return (
    <form className="login-form" onSubmit={handleSubmit}>

      <label>Full Name</label>
      <input
        name="full_name"
        type="text"
        value={formData.full_name}
        onChange={handleChange}
        placeholder="John Doe"
        required
      />

      <label>Email</label>
      <input
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="your.email@institution.edu"
        required
      />

      <label>Student ID</label>
      <input
        name="student_id"
        type="text"
        value={formData.student_id}
        onChange={handleChange}
        placeholder="STU2024001"
        required
      />

      <label>Institution</label>
      <select
        name="institution_id"
        value={formData.institution_id}
        onChange={handleChange}
        required
      >
        <option value="">Select your institution</option>

        {institutions.map((institution) => (
          <option key={institution.id} value={institution.id}>
            {institution.name}
          </option>
        ))}
      </select>


      <label>Department</label>
      <select
        name="department_id"
        value={formData.department_id}
        onChange={handleChange}
        disabled={!formData.institution_id}
        required
      >
        <option value="">Select your department</option>

        {departments.map((department) => (
          <option key={department.id} value={department.id}>
            {department.name}
          </option>
        ))}
      </select>

      <label>Batch</label>
      <select
        name="batch_id"
        value={formData.batch_id}
        onChange={handleChange}
        disabled={!formData.institution_id}
        required
      >
        <option value="">Select your batch</option>

        {batches.map((batch) => (
          <option key={batch.id} value={batch.id}>
            {batch.name}
          </option>
        ))}
      </select>

      <label>Section</label>
      <select
        name="section_id"
        value={formData.section_id}
        onChange={handleChange}
        disabled={
          !formData.institution_id ||
          !formData.department_id ||
          !formData.batch_id
        }
        required
      >
        <option value="">Select your section</option>

        {sections.map((section) => (
          <option key={section.id} value={section.id}>
            {section.name}
          </option>
        ))}
      </select>

      <label>Password</label>
      <input
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="At least 6 characters"
        required
      />

      <label>Confirm Password</label>
      <input
        name="confirm_password"
        type="password"
        value={formData.confirm_password}
        onChange={handleChange}
        placeholder="Re-enter your password"
        required
      />

      {error && <p className="create-election-error">{error}</p>}
      {success && (
        <div className="signup-success-message">
           {success}
        </div>
      )}
      <button type="submit" className="login-submit-btn">
        Create Account
      </button>

      <p className="login-footer-text">
        Already have an account? <a href="/login">Login</a>
      </p>
    </form>
  );
}

export default SignupForm;