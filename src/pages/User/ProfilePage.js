import React, { useEffect, useState } from 'react';
import { Mail, Phone, Building, ShieldCheck } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import API_BASE_URL from '../../config';
import ChangePasswordModal from '../../components/User/ChangePasswordModal';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const accessToken = sessionStorage.getItem('accessToken');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/user/my-info`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await res.json();
        if (data.success) {
          setUserInfo(data.data);
        } else {
          setError(data.error || 'Failed to fetch user info');
        }
      } catch (err) {
        setError(err.message || 'An error occurred');
      }
    };

    fetchUserInfo();
  }, [accessToken]);

  return (
    <div className='flex flex-col min-h-screen bg-gray-100'>
      <Header />
      <main className='flex-grow flex items-center justify-center py-10'>
        {error && (
          <div className='text-red-500 text-center font-medium'>{error}</div>
        )}
        {!userInfo ? (
          <div className='text-gray-600 text-lg'>Loading...</div>
        ) : (
          <div className='bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-8 flex flex-col items-center'>
            {/* Avatar */}
            <div className='w-28 h-28 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold mb-4 shadow-md'>
              {userInfo.fullName
                ?.split(' ')
                .map((n) => n[0])
                .join('')}
            </div>

            {/* Name + Role */}
            <h2 className='text-2xl font-semibold text-gray-800'>
              {userInfo.fullName}
            </h2>
            <p className='text-gray-500 mb-4'>@{userInfo.userName}</p>

            {/* Info Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 w-full mt-6'>
              <InfoItem
                icon={<Mail size={20} />}
                label='Email'
                value={userInfo.email}
              />
              <InfoItem
                icon={<Phone size={20} />}
                label='Phone'
                value={userInfo.phoneNumber}
              />
              <InfoItem
                icon={<Building size={20} />}
                label='Department'
                value={userInfo.department}
              />
              <InfoItem
                icon={<ShieldCheck size={20} />}
                label='Roles'
                value={userInfo.roles?.join(', ')}
              />
            </div>

            {/* Optional fields */}
            {userInfo.positionName && (
              <div className='mt-4 text-gray-700'>
                <span className='font-medium'>Position: </span>
                {userInfo.positionName}
              </div>
            )}
            {userInfo.groupName && (
              <div className='text-gray-700'>
                <span className='font-medium'>Group: </span>
                {userInfo.groupName}
              </div>
            )}

            {/* Status */}
            <div className='mt-6'>
              <span className='text-sm font-medium text-gray-500'>
                Account Status:{' '}
              </span>
              <span
                className={`font-semibold ${
                  userInfo.enabled ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {userInfo.enabled ? 'Active' : 'Inactive'}
              </span>
            </div>

            {/* Button đổi mật khẩu */}
            <div className='mt-6'>
              <button
                onClick={() => setShowPasswordModal(true)}
                className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
              >
                Change Password
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />

      {/* Toast container hiển thị thông báo */}
      <ToastContainer position='top-right' autoClose={3000} />

      {/* Render modal đổi mật khẩu với cả onClose và onPasswordChange được truyền vào */}
      {showPasswordModal && (
        <ChangePasswordModal
          onClose={() => setShowPasswordModal(false)}
          onPasswordChange={() => {
            console.log('Password changed successfully!');
          }}
        />
      )}
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className='flex items-start space-x-3 bg-gray-50 rounded-xl p-4 shadow-sm'>
    <div className='text-blue-500 mt-1'>{icon}</div>
    <div>
      <div className='text-gray-600 text-sm font-medium'>{label}</div>
      <div className='text-gray-900 font-semibold'>{value || '—'}</div>
    </div>
  </div>
);

export default ProfilePage;
