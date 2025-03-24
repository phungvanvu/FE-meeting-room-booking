import React, { useContext, useState } from 'react';
import "../App.css";
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from "../components/Sidebar";
import RoomCalendar from "../components/RoomCalendar";
import EventModal from "../components/EventModal";
import GlobalContext from "../context/GlobalContext";

export default function CalendarPage() {
  const { showEventModal } = useContext(GlobalContext);
  const [roomName] = useState("Room 1");

  return (
    <>
      {showEventModal && <EventModal />}
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Header */}
        <Header />

        {/* Nội dung chính */}
        <div className="flex flex-1 w-full overflow-hidden p-4 gap-4">
          {/* Sidebar bên trái */}
          <div className="
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
          ">
            <Sidebar />
          </div>

          {/* Hiển thị FullCalendar bên phải */}
          <div className="
            flex-grow 
            bg-white 
            shadow-lg 
            rounded-xl 
            overflow-auto 
            border border-gray-200
          ">
            <RoomCalendar roomName={roomName} />
          </div>
        </div>

        {/* Footer */}
        <Footer className="flex-shrink-0" />
      </div>
    </>
  );
}
