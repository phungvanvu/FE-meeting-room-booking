import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/user/LoginPage";
import Home from "./pages/user/HomePage";
import BookRoom from "./pages/user/BookRoomPage";
import CalendarPage from "./pages/user/CalenderPage";
import BookingList from "./pages/user/Bookinglist";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/BookRoom" element={<BookRoom />} />
        <Route path="/Calendar/:roomId" element={<CalendarPage />} />
        <Route path="/BookingList" element={<List />} /> 
        {/* <Route path="*" element={<Login />} /> */}
      </Routes>
    </Router>
  );
}
