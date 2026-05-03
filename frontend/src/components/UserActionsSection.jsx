import OmniVoteLogo from "./OmniVoteLogo";
import { TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { getEligibleElectionsForApplication } from "../api/candidateApplicationApi";

function UserActionsSection() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const showMessage = (text) => {
      setMessage(text);

      setTimeout(() => {
        setMessage("");
      }, 2000);
    };

  return (
    <div className="user-actions-section">
        {message && (
        <div className="user-action-message">
          {message}
        </div>
      )}
      <div className="action-card vote-card" onClick={() => navigate("/user-elections")}>
        <div className="action-card-text">
          <h3>Vote Now</h3>
          <p>Browse ongoing elections and cast your vote</p>
        </div>

        <div className="action-card-icon">
          <OmniVoteLogo size={44} showText={false} />
        </div>
      </div>

      <div
          className="action-card candidate-card"
          onClick={async () => {
            try {
              const elections = await getEligibleElectionsForApplication();

              if (elections.length === 0) {
                showMessage("You do not meet the requirements for any upcoming election right now.");
                return;
              }

              navigate("/apply-candidate");
            } catch (error) {
              console.log(error);
              alert("Could not check eligible elections.");
            }
          }}
        >
        <div className="action-card-text">
          <h3>Apply as Candidate</h3>
          <p>Submit your candidacy for upcoming elections</p>
        </div>

        <div className="action-card-icon">
          <TrendingUp size={44} />
        </div>
      </div>
    </div>
  );
}

export default UserActionsSection;