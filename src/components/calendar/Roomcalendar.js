import React, { useEffect, useState, useContext } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import GlobalContext from "../../context/GlobalContext";
import '../../App.css';

export default function RoomCalendar({ roomName }) {
  const { setFilteredEvents } = useContext(GlobalContext);
  const [events, setEvents] = useState([]);
  const accessToken = sessionStorage.getItem("accessToken");

  useEffect(() => {
    const fetchRoomBookings = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/MeetingRoomBooking/roombooking/bookings/by-room-name?roomName=${encodeURIComponent(roomName)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          const formattedBookings = data.map((booking) => ({
            id: booking.requestId,
            title: `${booking.purpose} (${formatTime(booking.startTime)} - ${formatTime(booking.endTime)})`,
            start: booking.startTime,
            end: booking.endTime,
            backgroundColor: getEventColor(booking.status) || '#9E9E9E',
            borderColor: getEventColor(booking.status) || '#9E9E9E',
            textColor: '#FFFFFF',
            extendedProps: {
              status: booking.status,
              note: booking.note,
              startTime: booking.startTime,
              endTime: booking.endTime,
            },
          }));
           

          setEvents(formattedBookings);
          setFilteredEvents(formattedBookings);
        } else {
          console.error("Invalid data format:", data);
          setEvents([]);
        }
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      }
    };

    fetchRoomBookings();
  }, [roomName, setFilteredEvents]);

  // Hàm định dạng giờ phút (ví dụ: 09:30)
  const formatTime = (time) => {
    return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Đặt màu cho trạng thái
  const getEventColor = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return '#4CAF50'; // Xanh lá
      case 'PENDING':
        return '#FFC107'; // Vàng
      case 'CANCELLED':
        return '#F44336'; // Đỏ
      default:
        return '#9E9E9E'; // Xám
    }
  };

  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        events={events}
        eventClick={(info) => {
          alert(
            `Sự kiện: ${info.event.title}\nTrạng thái: ${info.event.extendedProps.status}\nGhi chú: ${info.event.extendedProps.note}`
          );
        }}
        eventMouseEnter={(info) => {
          const tooltip = document.createElement('div');
          tooltip.innerHTML = `
            <strong>${info.event.title}</strong><br />
            <em>${formatTime(info.event.start)} - ${formatTime(info.event.end)}</em><br />
            <span style="color: ${getEventColor(info.event.extendedProps.status)};">
              BookingStatus: ${info.event.extendedProps.status}
            </span><br />
            Note: ${info.event.extendedProps.note || 'Không có'}
          `;
          tooltip.className = 'custom-tooltip';
          document.body.appendChild(tooltip);

          tooltip.style.left = `${info.jsEvent.clientX + 10}px`;
          tooltip.style.top = `${info.jsEvent.clientY + 10}px`;

          info.el.addEventListener('mouseleave', () => {
            tooltip.remove();
          });
        }}
        height="800px" 
        eventContent={(info) => (
          <div className="custom-event">
            <div className="event-title">{info.event.title}</div>
            <div className="event-time">
              {formatTime(info.event.start)} - {formatTime(info.event.end)}
            </div>
          </div>
        )}
      />
    </div>
  );
}