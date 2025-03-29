import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { useEffect } from 'react';
import { isAccessTokenValid } from './components/utils/auth';
import { jwtDecode } from 'jwt-decode';
import Login from './pages/Auth/LoginPage';
import BookRoom from './pages/User/BookRoomPage';
import CalenderPage from './pages/User/CalenderPage';
import ManageRoom from './pages/Admin/ManageRoomPage';
import Dashboard from './pages/Admin/DashboardPage';
import ManageUser from './pages/Admin/ManageUserPage';
import ManageGroup from './pages/Admin/ManageGroupPage';
import MyBookings from './pages/User/MyBookingsPage';
import History from './pages/User/HistoryPage';
import Home from './pages/User/HomePage';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const isValid = await isAccessTokenValid();

      if (isValid) {
        const token = sessionStorage.getItem('accessToken');
        const decoded = jwtDecode(token);

        if (location.pathname === '/Login') {
          if (decoded.scope.includes('ROLE_USER')) {
            navigate('/BookRoom');
          } else if (decoded.scope.includes('ROLE_ADMIN')) {
            navigate('/ManageRoom');
          }
        }
      } else {
        navigate('/Login');
      }
    };

    checkAuth();
  }, [navigate, location.pathname]);

  function getDefaultRedirect() {
    const token = sessionStorage.getItem('accessToken');
    if (token) {
      const decoded = jwtDecode(token);
      if (decoded.scope.includes('ROLE_USER')) {
        return '/BookRoom';
      } else if (decoded.scope.includes('ROLE_ADMIN')) {
        return '/ManageRoom';
      }
    }
    return '/Login';
  }

  return (
    <Routes>
      <Route path='/' element={<Navigate to={getDefaultRedirect()} />} />
      <Route path='/Login' element={<Login />} />
      {/* Quyền cho ROLE_USER */}
      {(() => {
        const token = sessionStorage.getItem('accessToken');
        if (token) {
          const decoded = jwtDecode(token);
          if (decoded.scope.includes('ROLE_USER')) {
            return (
              <>
                <Route path='/BookRoom' element={<BookRoom />} />
                <Route path='/Calendar/:roomName' element={<CalenderPage />} />
                <Route path='/MyBookings' element={<MyBookings />} />
                <Route path='/History' element={<History />} />
                <Route path='/Home' element={<Home />} />
              </>
            );
          }
        }
        return null;
      })()}
      {/* Quyền cho ROLE_ADMIN */}
      {(() => {
        const token = sessionStorage.getItem('accessToken');
        if (token) {
          const decoded = jwtDecode(token);
          if (decoded.scope.includes('ROLE_ADMIN')) {
            return (
              <>
                <Route path='/ManageRoom' element={<ManageRoom />} />
                <Route path='/Dashboard' element={<Dashboard />} />
                <Route path='/ManageUser' element={<ManageUser />} />
                <Route path='/ManageGroup' element={<ManageGroup />} />
                <Route path='/BookRoom' element={<BookRoom />} />
                <Route path='/Calendar/:roomName' element={<CalenderPage />} />
                <Route path='/MyBookings' element={<MyBookings />} />
                <Route path='/History' element={<History />} />
                <Route path='/Home' element={<Home />} />
              </>
            );
          }
        }
        return null;
      })()}
      {/* Nếu không khớp với bất kỳ route nào khác */}
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
