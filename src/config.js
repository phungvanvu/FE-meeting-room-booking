// src/config.js
const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  'http://localhost:8080/MeetingRoomBooking/api/v1';

export default API_BASE_URL;
