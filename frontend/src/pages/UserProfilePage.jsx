import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";
import {
  User,
  Mail,
  CreditCard,
  Building2,
  CheckCircle2,
  Pencil,
  X,
  Check,
} from "lucide-react";
import mockUser from "../data/mockUser";
import "./UserProfilePage.css";

function UserProfilePage() {
  const navigate = useNavigate();

  const [user, setUser] = useState(mockUser);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(mockUser.name);
  const [saveStatus, setSaveStatus] = useState(null);

  const handleEdit = () => {
    setEditedName(user.name);
    setIsEditing(true);
    setSaveStatus(null);
  };

  const handleCancel = () => {
    setEditedName(user.name);
    setIsEditing(false);
    setSaveStatus(null);
  };

  const handleSave = () => {
    const trimmedName = editedName.trim();

    if (!trimmedName) return;

    setUser((prevUser) => ({
      ...prevUser,
      name: trimmedName,
    }));

    setIsEditing(false);
    setSaveStatus("success");

    setTimeout(() => {
      setSaveStatus(null);
    }, 3000);
  };

  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="profile-page">
      <UserNavbar />

      <div className="profile-container">
        <div className="profile-content">
          <button
            className="profile-back-button"
            onClick={() => navigate("/dashboard")}
          >
            ← Back to Dashboard
          </button>

          <div className="profile-card">
            <div className="profile-identity">
              <div className="profile-avatar">{initials}</div>

              <div className="profile-identity-text">
                <h2 className="profile-display-name">{user.name}</h2>
                <span className="profile-student-id">{user.studentId}</span>
              </div>
            </div>

            <div className="profile-divider"></div>

            {user.isVerified && (
              <div className="profile-verified-badge">
                <CheckCircle2 size={18} />
                <span>Verified Voter</span>
              </div>
            )}

            {saveStatus === "success" && (
              <div className="profile-toast success">
                <Check size={16} />
                <span>Profile updated successfully.</span>
              </div>
            )}

            <div className="profile-fields">
              <div className="profile-field">
                <label className="profile-field-label">Full Name</label>

                <div
                  className={`profile-field-input-wrap ${
                    isEditing ? "editing" : ""
                  }`}
                >
                  <User size={16} className="profile-field-icon" />

                  {isEditing ? (
                    <input
                      className="profile-field-input editable"
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      placeholder="Enter your full name"
                      maxLength={60}
                      autoFocus
                    />
                  ) : (
                    <span className="profile-field-value">{user.name}</span>
                  )}
                </div>
              </div>

              <div className="profile-field">
                <label className="profile-field-label">Email</label>

                <div className="profile-field-input-wrap readonly">
                  <Mail size={16} className="profile-field-icon" />
                  <span className="profile-field-value">{user.email}</span>
                  <span className="profile-readonly-tag">Read only</span>
                </div>
              </div>

              <div className="profile-field">
                <label className="profile-field-label">Student ID</label>

                <div className="profile-field-input-wrap readonly">
                  <CreditCard size={16} className="profile-field-icon" />
                  <span className="profile-field-value">{user.studentId}</span>
                  <span className="profile-readonly-tag">Read only</span>
                </div>
              </div>

              <div className="profile-field">
                <label className="profile-field-label">Institution</label>

                <div className="profile-field-input-wrap readonly">
                  <Building2 size={16} className="profile-field-icon" />
                  <span className="profile-field-value">{user.institution}</span>
                  <span className="profile-readonly-tag">Read only</span>
                </div>
              </div>
            </div>

            <div className="profile-divider"></div>

            <div className="profile-actions">
              {isEditing ? (
                <>
                  <button className="profile-btn cancel" onClick={handleCancel}>
                    <X size={16} />
                    <span>Cancel</span>
                  </button>

                  <button
                    className="profile-btn save"
                    onClick={handleSave}
                    disabled={
                      !editedName.trim() || editedName.trim() === user.name
                    }
                  >
                    <Check size={16} />
                    <span>Save Changes</span>
                  </button>
                </>
              ) : (
                <button className="profile-btn edit" onClick={handleEdit}>
                  <Pencil size={16} />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;