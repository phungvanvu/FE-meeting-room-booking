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
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [refreshCalendar, setRefreshCalendar] = useState(false);

  useEffect(() => {
    const initPage = async () => {
      const isValid = await isAccessTokenValid();
      if (!isValid) {
        navigate('/Login');
      }
    };
    initPage();
  }, [navigate]);

  const handleBookingSuccess = () => {
    setRefreshCalendar((prev) => !prev);
  };

  return (
    <>
      {showEventModal && (
        <EventModal roomId={roomId} onBookingSuccess={handleBookingSuccess} />
      )}
      <div className='min-h-screen flex flex-col bg-gray-50'>
        <Header />
        <div className='flex flex-1 w-full overflow-hidden p-4 gap-4'>
          <aside className='w-[280px] min-w-[250px] max-w-[320px] bg-white shadow-lg rounded-xl overflow-auto border border-gray-200 transition-transform duration-300'>
            <Sidebar />
          </aside>
          <main className='flex-grow bg-white shadow-lg rounded-xl overflow-auto border border-gray-200'>
            <RoomCalendar roomId={roomId} refreshCalendar={refreshCalendar} />
          </main>
        </div>
        <Footer className='flex-shrink-0' />
      </div>
    </>
  );
}
