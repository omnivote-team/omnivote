import mockElections from "../data/mockElections";
import EmptyState from "./EmptyState";

const ElectionDropdown = ({ value, onChange }) => {
  const activeElections = mockElections.filter(
    (el) => el.status === "Ongoing" || el.status === "Upcoming"
  );

  if (activeElections.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="form-group">
      <label>Select Election</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Choose an election</option>
        {activeElections.map((el) => (
          <option key={el.id} value={el.id}>
            {el.title}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ElectionDropdown;