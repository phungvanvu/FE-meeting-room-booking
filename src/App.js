import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Authentication/LoginPage";
import HomePage from "./pages/HomePage";
import BookRoomPage from "./pages/Booking/BookRoomPage";
import CalendarPage from "./pages/Booking/CalenderPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/Home" element={<HomePage />} />
        <Route path="/BookRoom" element={<BookRoomPage />} />
        <Route path="/Calendar/:roomId" element={<CalendarPage />} />
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}
