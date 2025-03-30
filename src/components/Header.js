import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, UserCircle } from 'lucide-react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import API_BASE_URL from '../config';

export default function Header() {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const token = sessionStorage.getItem('accessToken');
  let roles = [];
  if (token) {
    try {
      const decoded = jwtDecode(token);
      roles = decoded.scope || [];
    } catch (error) {
      console.error('Invalid token', error);
    }
  }

  useEffect(() => {
    if (token) {
      fetch(`${API_BASE_URL}/user/my-info`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setUserInfo(data.data);
          } else {
            console.error('Error fetching my info:', data.error);
          }
        })
        .catch((err) => console.error('Error fetching my info:', err));
    }
  }, [token]);

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

  const notifications = [];

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
          <Link to='/Home' className='hover:underline hover:text-gray-200'>
            Home
          </Link>
          <Link to='/BookRoom' className='hover:underline hover:text-gray-200'>
            Book a Room
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
                Manage Rooms
              </Link>
              <Link
                to='/ManageUser'
                className='hover:underline hover:text-gray-200'
              >
                Manage Users
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
            <span className='absolute -top-2 -right-2 bg-red-500 text-xs text-white rounded-full px-1'>
              {notifications.length}
            </span>
            {isNotifOpen && (
              <div className='absolute right-0 mt-2 w-64 bg-white text-gray-800 shadow-md rounded-lg overflow-hidden z-50'>
                {notifications.length > 0 ? (
                  notifications.map((notif, idx) => (
                    <div
                      key={idx}
                      className='px-4 py-2 border-b last:border-b-0 hover:bg-gray-100'
                    >
                      {notif}
                    </div>
                  ))
                ) : (
                  <div className='px-4 py-2 text-sm text-gray-500'>
                    {/* Empty frame if no notifications */}
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
              <span className='hidden md:block font-medium'>
                {userInfo ? userInfo.fullName : 'User'}
              </span>
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
