import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./admin/pages/Home";
import RoomManagement from "./admin/pages/RoomManagement";  // Sửa lại tên
import UserManagement from "./admin/pages/UserManagement";
import Statistics from "./admin/pages/Statistics";
import Header from "./admin/components/Header";
import Footer from "./admin/components/Footer";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room-management" element={<RoomManagement />} />
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/statistics" element={<Statistics />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
