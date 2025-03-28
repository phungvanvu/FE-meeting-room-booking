import { createContext } from "react";

const GlobalContext = createContext({
    showEventModal: false,
    setShowEventModal: () => {},
    filteredEvents: [],
    setFilteredEvents: () => {},
    monthIndex: 0,
    setSmallCalendarMonth: () => {},
    daySelected: null,
    setDaySelected: () => {},
    eventData: {},
    setEventData: () => {},
  });
  
  export default GlobalContext;