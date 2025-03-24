import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { isAccessTokenValid } from "./components/utils/auth";
import Login from "./pages/LoginPage";
import Home from "./pages/HomePage";
import BookRoom from "./pages/BookRoomPage";
import CalenderPage from "./pages/CalenderPage";

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
      <Route path="/Calendar/:roomId" element={<CalenderPage />} />
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
