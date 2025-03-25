import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/LoginPage";
import Home from "./pages/HomePage";
import BookRoom from "./pages/BookRoomPage";
import CalendarPage from "./pages/CalenderPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/BookRoom" element={<BookRoom />} />
        <Route path="/Calendar/:roomId" element={<CalendarPage />} />
        {/* <Route path="*" element={<Login />} /> */}
      </Routes>
    </Router>
  );
}
