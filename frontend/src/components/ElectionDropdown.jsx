import { useEffect, useState } from "react";
import API from "../api/api";
import EmptyState from "./EmptyState";

const ElectionDropdown = ({ value, onChange }) => {
  const [activeElections, setActiveElections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const response = await API.get("/public/elections/");
        console.log(response.data);

        const filtered = response.data.filter((election) => {
          const status = election.status?.toLowerCase();
          return status === "open" || status === "scheduled";
        });

        setActiveElections(filtered);
      } catch (error) {
        console.log(error);
        setActiveElections([]);
      } finally {
        setLoading(false);
      }
    };

    fetchElections();
  }, []);

  if (loading) {
    return <p>Loading elections...</p>;
  }

  if (activeElections.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="form-group">
      <label>Select Election</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Choose an election</option>
        {activeElections.map((election) => (
          <option key={election.id} value={election.id}>
            {election.title}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ElectionDropdown;