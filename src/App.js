import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { isAccessTokenValid } from './components/utils/auth';
import { jwtDecode } from 'jwt-decode';
import Login from './pages/Auth/LoginPage';
import ForgotPassword from './pages/Auth/ForgotPasswordPage';
import ResetPassword from './pages/Auth/ResetPasswordPage';
import BookRoom from './pages/User/BookRoomPage';
import Calender from './pages/User/CalenderPage';
import ManageRoom from './pages/Manager/ManageRoomPage';
import Dashboard from './pages/Manager/DashboardPage';
import ManageUsers from './pages/Manager/ManageUserPage';
import ManageGroups from './pages/Manager/ManageGroupPage';
import ManagePositions from './pages/Manager/ManagePositionPage';
import ManageEquipments from './pages/Manager/ManageEquipmentPage';
import ManageBookings from './pages/Manager/ManageBookingPage';
import MyBookings from './pages/User/MyBookingsPage';
import History from './pages/User/HistoryPage';
import Profile from './pages/User/ProfilePage';

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
        if (
          location.pathname !== '/Login' &&
          location.pathname !== '/forgot-password' &&
          location.pathname !== '/reset-password'
        ) {
          navigate('/Login');
        }
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
      <Route path='/forgot-password' element={<ForgotPassword />} />
      <Route path='/reset-password' element={<ResetPassword />} />
      {/* Quyền cho ROLE_USER */}
      {(() => {
        const token = sessionStorage.getItem('accessToken');
        if (token) {
          const decoded = jwtDecode(token);
          if (decoded.scope.includes('ROLE_USER')) {
            return (
              <>
                <Route path='/BookRoom' element={<BookRoom />} />
                <Route path='/Calendar/:roomId' element={<Calender />} />
                <Route path='/MyBookings' element={<MyBookings />} />
                <Route path='/History' element={<History />} />
                <Route path='/Profile' element={<Profile />} />
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
                <Route path='/ManageUser' element={<ManageUsers />} />
                <Route path='/ManageBooking' element={<ManageBookings />} />
                <Route path='/Group' element={<ManageGroups />} />
                <Route path='/Position' element={<ManagePositions />} />
                <Route path='/Equipment' element={<ManageEquipments />} />
                <Route path='/BookRoom' element={<BookRoom />} />
                <Route path='/Calendar/:roomId' element={<Calender />} />
                <Route path='/MyBookings' element={<MyBookings />} />
                <Route path='/History' element={<History />} />
                <Route path='/Profile' element={<Profile />} />
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
      {/* ToastContainer được render toàn cục */}
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>
  );
}
