import { Navigate, Route, Routes } from "react-router-dom";
import AllTeams from "./pages/AllTeams";
import TeamInfo from "./pages/TeamInfo";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Navigate to="/allTeams" replace />} />
        <Route path="/allTeams" element={<AllTeams />} />
        <Route path="/teamInfo/:id" element={<TeamInfo />} />
      </Routes>

      <Footer />
    </>
  );
}
