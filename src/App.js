import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { isAccessTokenValid } from "./components/utils/auth";
import Login from "./pages/Auth/LoginPage";
import Home from "./pages/User/HomePage";
import BookRoom from "./pages/User/BookRoomPage";
import CalenderPage from "./pages/User/CalenderPage";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const isValid = await isAccessTokenValid();
      if (isValid) {
        // Chỉ chuyển hướng về `/Home` nếu đang ở trang `/Login`
        if (location.pathname === "/Login") {
          navigate("/Home");
        }
      } else {
        navigate("/Login");
      }
    };

    checkAuth();
  }, [navigate, location.pathname]);

  return (
    <Routes>
      <Route path="/Login" element={<Login />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/BookRoom" element={<BookRoom />} />
      <Route path="/Calendar/:roomName" element={<CalenderPage />} />
      <Route path="*" element={<Login />} />
    </Routes>
  );
}

export default function RootApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}
