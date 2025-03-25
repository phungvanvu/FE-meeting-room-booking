import React, { useState, useEffect } from "react";
import GlobalContext from "./GlobalContext";
import dayjs from "dayjs";

export const ContextWrapper = ({ children }) => {
  const [showEventModal, setShowEventModal] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [monthIndex, setMonthIndex] = useState(dayjs().month());
  const [daySelected, setDaySelected] = useState(null);
  const [eventData, setEventData] = useState({
    roomId: null,
    bookedById: null,
    startTime: "",
    endTime: "",
    purpose: "",
    status: "CONFIRMED",
    note: "",
  });

  const setSmallCalendarMonth = (index) => {
    setMonthIndex(index);
  };

  return (
    <GlobalContext.Provider
      value={{
        showEventModal,
        setShowEventModal,
        filteredEvents,
        setFilteredEvents,
        monthIndex,
        setSmallCalendarMonth,
        daySelected,
        setDaySelected,
        eventData,
        setEventData,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
