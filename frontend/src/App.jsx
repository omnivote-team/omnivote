import MainLayout from "./layouts/MainLayout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <MainLayout>
      <h1>OmniVote</h1>
      <LoginPage />
      <DashboardPage />
    </MainLayout>
  );
}

export default App;