import OmniVoteLogo from "./OmniVoteLogo";
import { TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

function UserActionsSection() {
  const navigate = useNavigate();

  return (
    <div className="user-actions-section">
      <div className="action-card vote-card" onClick={() => navigate("/user-elections")}>
        <div className="action-card-text">
          <h3>Vote Now</h3>
          <p>Browse ongoing elections and cast your vote</p>
        </div>

        <div className="action-card-icon">
          <OmniVoteLogo size={44} showText={false} />
        </div>
      </div>

      <div className="action-card candidate-card" onClick={() => navigate("/apply-candidate")}>
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