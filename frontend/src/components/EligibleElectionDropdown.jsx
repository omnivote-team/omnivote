import { useEffect, useState } from "react";
import EmptyState from "./EmptyState";
import { getEligibleElectionsForApplication } from "../api/candidateApplicationApi";

const EligibleElectionDropdown = ({ value, onChange }) => {
  const [eligibleElections, setEligibleElections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEligibleElections = async () => {
      try {
        const elections = await getEligibleElectionsForApplication();
        setEligibleElections(elections);
      } catch (error) {
        console.log(error);
        setEligibleElections([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEligibleElections();
  }, []);

  if (loading) {
    return <p>Loading eligible elections...</p>;
  }

  if (eligibleElections.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="form-group">
      <label>Select Election</label>

      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Choose an election</option>

        {eligibleElections.map((election) => (
          <option key={election.id} value={election.id}>
            {election.title}
          </option>
        ))}
      </select>
    </div>
  );
};

export default EligibleElectionDropdown;