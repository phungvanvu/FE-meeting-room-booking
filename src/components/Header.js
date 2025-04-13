import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  ChevronDown,
  UserCircle,
  Info,
  AlertTriangle,
  XCircle,
} from 'lucide-react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import API_BASE_URL from '../config';

export default function Header() {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const token = sessionStorage.getItem('accessToken');
  let roles = [];
  let userName = 'User';

  if (token) {
    try {
      const decoded = jwtDecode(token);
      roles = decoded.scope || [];
      userName = decoded.name || decoded.sub;
    } catch (error) {
      console.error('Invalid token', error);
    }
  }

  // Fetch thông báo của user khi component được mount
  useEffect(() => {
    const fetchNotifications = async () => {
      if (token) {
        try {
          const response = await fetch(
            `${API_BASE_URL}/notification/MyNotification`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          const data = await response.json();
          if (data.success) {
            setNotifications(data.data);
          }
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      }
    };

    fetchNotifications();
  }, [token]);

  // Hàm trả về icon theo type của notification với kích thước lớn hơn và margin rộng hơn
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'INFO':
        return <Info className='h-8 w-8 text-blue-500 inline mr-4' />;
      case 'WARNING':
        return (
          <AlertTriangle className='h-8 w-8 text-yellow-500 inline mr-4' />
        );
      case 'ERROR':
        return <XCircle className='h-8 w-8 text-red-500 inline mr-4' />;
      default:
        return null;
    }
  };

  const handleLogout = async () => {
    if (token) {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: token }),
        });
        if (response.ok) {
          sessionStorage.removeItem('accessToken');
          Cookies.remove('refreshToken');
          navigate('/Login');
        } else {
          const errorData = await response.json();
          console.error('Logout failed:', errorData.error.message);
        }
      } catch (error) {
        console.error('Error during logout:', error);
      }
    } else {
      console.error('No token found, cannot logout.');
    }
  };

  return (
    <header className='bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg'>
      <div className='container mx-auto px-4 py-4 flex items-center justify-between'>
        {/* Logo & Branding */}
        <div className='flex items-center'>
          <Link to='/Home' className='flex items-center'>
            <img src='logo512.png' alt='Logo' className='h-10 w-auto mr-3' />
            <span className='text-2xl font-bold'>Meeting Room</span>
          </Link>
        </div>
        {/* Navigation Links */}
        <nav className='hidden md:flex space-x-6'>
          <Link to='/BookRoom' className='hover:underline hover:text-gray-200'>
            Book Room
          </Link>
          <Link
            to='/MyBookings'
            className='hover:underline hover:text-gray-200'
          >
            My Bookings
          </Link>
          <Link to='/History' className='hover:underline hover:text-gray-200'>
            History
          </Link>
          {roles.includes('ROLE_ADMIN') && (
            <>
              <Link
                to='/Dashboard'
                className='hover:underline hover:text-gray-200'
              >
                Dashboard
              </Link>
              <Link
                to='/ManageRoom'
                className='hover:underline hover:text-gray-200'
              >
                Rooms
              </Link>
              <Link
                to='/ManageBooking'
                className='hover:underline hover:text-gray-200'
              >
                Bookings
              </Link>
              <Link
                to='/ManageUser'
                className='hover:underline hover:text-gray-200'
              >
                Users
              </Link>
              <Link to='/Group' className='hover:underline hover:text-gray-200'>
                Groups
              </Link>
              <Link
                to='/Position'
                className='hover:underline hover:text-gray-200'
              >
                Positions
              </Link>
              <Link
                to='/Equipment'
                className='hover:underline hover:text-gray-200'
              >
                Equipments
              </Link>
            </>
          )}
        </nav>
        {/* Right: Notification & User Dropdown */}
        <div className='flex items-center space-x-6'>
          {/* Notification Icon */}
          <div
            className='relative cursor-pointer'
            onClick={() => {
              setIsNotifOpen(!isNotifOpen);
              setIsDropdownOpen(false);
            }}
          >
            <Bell className='h-6 w-6' />
            {isNotifOpen && (
              <div className='absolute right-0 mt-2 w-72 max-h-80 overflow-y-auto bg-white text-gray-800 shadow-md rounded-lg z-50'>
                {notifications.length > 0 ? (
                  notifications.map((notif, idx) => (
                    <div
                      key={idx}
                      className='px-4 py-3 border-b last:border-b-0 hover:bg-gray-100 flex items-center'
                    >
                      {getNotificationIcon(notif.type)}
                      <span className='text-sm'>{notif.content}</span>
                    </div>
                  ))
                ) : (
                  <div className='px-4 py-3 text-sm text-gray-500'>
                    No notifications.
                  </div>
                )}
              </div>
            )}
          </div>
          {/* User Dropdown */}
          <div className='relative ml-4'>
            <div
              className='flex items-center space-x-2 cursor-pointer'
              onClick={() => {
                setIsDropdownOpen(!isDropdownOpen);
                setIsNotifOpen(false);
              }}
            >
              <UserCircle className='h-8 w-8' />
              <span className='hidden md:block font-medium'>{userName}</span>
              <ChevronDown className='h-5 w-5' />
            </div>
            {isDropdownOpen && (
              <div className='absolute right-0 mt-2 w-40 bg-white text-gray-800 shadow-md rounded-lg overflow-hidden z-50'>
                <Link
                  to='/Profile'
                  className='block px-4 py-2 hover:bg-gray-100'
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className='block w-full text-left px-4 py-2 hover:bg-gray-100'
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
