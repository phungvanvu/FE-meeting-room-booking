import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./admin/pages/Home";
import AvailableRooms from "./admin/pages/AvailableRooms";
import BookedRooms from "./admin/pages/BookedRooms";
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
        <Route path="/available-rooms" element={<AvailableRooms />} />
        <Route path="/booked-rooms" element={<BookedRooms />} />
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/statistics" element={<Statistics />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
