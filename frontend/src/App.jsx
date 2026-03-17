import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import ElectionListPage from "./pages/ElectionListPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/elections" element={<ElectionListPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
