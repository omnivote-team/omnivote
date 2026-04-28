import { useNavigate } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";
import ElectionListContent from "../components/ElectionListContent";

function UserElectionListPage() {
  const navigate = useNavigate();

  const handleViewDetails = (election) => {
    navigate(`/user-elections/${election.id}`);
  };

  return (
    <>
      <UserNavbar />
      <ElectionListContent onViewDetails={handleViewDetails} />
    </>
  );
}

export default UserElectionListPage;