import React, { useState, useContext } from 'react';
import "../App.css";
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getMonth } from "../components/util/util";
import CalendarHeader from "../components/CalendarHeader";
import Sidebar from "../components/Sidebar";
import Month from "../components/Month";
import GlobalContext from "../context/GlobalContext";
import EventModal from "../components/EventModal";

export default function CalendarPage() {
  const [currenMonth] = useState(getMonth());
  const {showEventModal } = useContext(GlobalContext);

  return (
    <>
      {showEventModal && <EventModal />}
      <div className="min-h-screen flex flex-col">
        {/* Header cố định */}
        <Header />
        
        {/* Nội dung chính */}
        <div className="flex-grow w-full mt-2 mb-6 overflow-hidden">
          <CalendarHeader />
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <Sidebar className="w-[20%] min-w-[250px] max-w-[300px] border-r overflow-auto pb-4" />
            {/* Month */}
            <Month month={currenMonth} className="flex-grow overflow-auto pb-4" />
          </div>
        </div>
        
        {/* Footer không bị co lại */}
        <Footer className="flex-shrink-0" />
      </div>
    </>
  );
}
