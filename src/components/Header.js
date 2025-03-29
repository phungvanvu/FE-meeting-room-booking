import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, UserCircle } from 'lucide-react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export default function Header() {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null); // lưu thông tin người dùng

  // Lấy accessToken và giải mã để lấy quyền (scope)
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

  // Gọi API để lấy thông tin người dùng (my-info)
  useEffect(() => {
    if (token) {
      fetch('http://localhost:8080/MeetingRoomBooking/user/my-info', {
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
        const response = await fetch(
          'http://localhost:8080/MeetingRoomBooking/auth/logout',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: token }),
          },
        );

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
    <div className='bg-teal-600 text-white flex justify-between items-center px-6 py-4 shadow-md'>
      {/* Logo */}
      <Link to='/Home'>
        <img
          src='/Header/Logo.png'
          alt='Logo'
          className='h-10 cursor-pointer'
        />
      </Link>

      {/* Navigation */}
      <div className='flex items-center space-x-6'>
        {/* Render link dựa theo quyền */}
        {roles.includes('ROLE_USER') && (
          <>
            <Link to='/BookRoom' className='cursor-pointer hover:underline'>
              Book Room
            </Link>
            <Link to='/Home' className='cursor-pointer hover:underline'>
              Home
            </Link>
          </>
        )}

        {roles.includes('ROLE_ADMIN') && (
          <>
            <Link to='/ManageRoom' className='cursor-pointer hover:underline'>
              Room Management
            </Link>
            <Link to='/Dashboard' className='cursor-pointer hover:underline'>
              Dashboard
            </Link>
            <Link to='/ManageUser' className='cursor-pointer hover:underline'>
              User Management
            </Link>
            <Link to='/BookRoom' className='cursor-pointer hover:underline'>
              Book Room
            </Link>
            <Link to='/MyBookings' className='cursor-pointer hover:underline'>
              My Bookings
            </Link>
            <Link to='/History' className='cursor-pointer hover:underline'>
              History
            </Link>
            <Link to='/Home' className='cursor-pointer hover:underline'>
              Home
            </Link>
          </>
        )}

        {/* Icon thông báo */}
        <div className='relative cursor-pointer'>
          <Bell className='h-6 w-6' />
          <span className='absolute -top-2 -right-2 bg-red-500 text-xs text-white rounded-full px-1'>
            6
          </span>
        </div>

        {/* Hồ sơ người dùng + Dropdown */}
        <div className='relative'>
          <div
            className='flex items-center space-x-2 cursor-pointer'
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <UserCircle className='h-8 w-8' />
            <span>{userInfo ? userInfo.fullName : 'User'}</span>
            <ChevronDown className='h-5 w-5' />
          </div>
          {isDropdownOpen && (
            <div className='absolute right-0 mt-2 w-40 bg-white text-black shadow-md rounded-lg overflow-hidden z-50'>
              <Link to='/Profile' className='block px-4 py-2 hover:bg-gray-100'>
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
  );
}
