import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { useEffect } from 'react';
import { isAccessTokenValid } from './components/utils/auth';
import Login from './pages/Auth/LoginPage';
import HomeUser from './pages/User/HomePage';
import BookRoom from './pages/User/BookRoomPage';
import CalenderPage from './pages/User/CalenderPage';
import RoomManagement from './pages/Admin/RoomManagementPage';
import UserManagement from './pages/Admin/UserManagementPage';
import Statistics from './pages/Admin/StatisticsPage';
import HomeAdmin from './pages/Admin/HomePage';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const isValid = await isAccessTokenValid();
      if (isValid) {
        if (location.pathname === '/Login') {
          navigate('/Home');
        }
      } else {
        navigate('/Login');
      }
    };

    checkAuth();
  }, [navigate, location.pathname]);

  return (
    <Routes>
      <Route path='/Login' element={<Login />} />
      <Route path='/Home' element={<HomeUser />} />
      <Route path='/BookRoom' element={<BookRoom />} />
      <Route path='/Calendar/:roomName' element={<CalenderPage />} />
      <Route path='/Home' element={<HomeAdmin />} />
      <Route path='/room-management' element={<RoomManagement />} />
      <Route path='/user-management' element={<UserManagement />} />
      <Route path='/statistics' element={<Statistics />} />
      <Route path='*' element={<Login />} />
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
