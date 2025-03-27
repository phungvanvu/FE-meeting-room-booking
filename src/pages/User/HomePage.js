import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { isAccessTokenValid } from '../../components/utils/auth';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const initPage = async () => {
      const isValid = await isAccessTokenValid();
      if (!isValid) {
        navigate('/Login');
        return;
      }
    };

    initPage();
  }, [navigate]);

  return (
    <div className='min-h-screen flex flex-col'>
      {/* Header */}
      <Header />

      {/* Nội dung chính */}
      <div className='flex-grow container mx-auto mt-10 mb-10'>
        <h2 className='text-2xl font-bold'>
          Chào mừng bạn đến với trang Đặt Phòng Họp!
        </h2>
        <p className='mt-4 text-gray-700'>
          Hãy sử dụng hệ thống để quản lý và đặt phòng họp một cách dễ dàng!
        </p>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
