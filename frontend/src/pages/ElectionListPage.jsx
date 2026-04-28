import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ElectionListContent from "../components/ElectionListContent";

function ElectionListPage() {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate("/login");
  };

  return (
    <>
      <Navbar />
      <ElectionListContent onViewDetails={handleViewDetails} />
    </>
  );
}

export default ElectionListPage;