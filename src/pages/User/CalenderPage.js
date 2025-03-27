import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../App.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Sidebar from '../../components/Calendar/Sidebar';
import RoomCalendar from '../../components/Calendar/RoomCalendar';
import EventModal from '../../components/Calendar/EventModal';
import GlobalContext from '../../context/GlobalContext';
import { isAccessTokenValid } from '../../components/utils/auth';

export default function CalendarPage() {
  const { showEventModal } = useContext(GlobalContext);
  const { roomName } = useParams();
  const navigate = useNavigate();
  const [refreshCalendar, setRefreshCalendar] = useState(false);

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

  const handleBookingSuccess = () => {
    setRefreshCalendar((prev) => !prev);
  };

  return (
    <>
      {showEventModal && <EventModal onBookingSuccess={handleBookingSuccess} />}
      <div className='min-h-screen flex flex-col bg-gray-50'>
        {/* Header */}
        <Header />

        {/* Nội dung chính */}
        <div className='flex flex-1 w-full overflow-hidden p-4 gap-4'>
          {/* Sidebar bên trái */}
          <div
            className='
            w-[280px] 
            min-w-[250px] 
            max-w-[320px] 
            bg-white 
            shadow-lg 
            rounded-xl 
            overflow-auto 
            border border-gray-200 
            transition-transform 
            duration-300
          '
          >
            <Sidebar />
          </div>

          {/* Hiển thị FullCalendar bên phải */}
          <div
            className='
            flex-grow 
            bg-white 
            shadow-lg 
            rounded-xl 
            overflow-auto 
            border border-gray-200
          '
          >
            <RoomCalendar
              roomName={roomName}
              refreshCalendar={refreshCalendar}
            />
          </div>
        </div>

        {/* Footer */}
        <Footer className='flex-shrink-0' />
      </div>
    </>
  );
}
