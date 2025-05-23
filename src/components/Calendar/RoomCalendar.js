import React, { useEffect, useState, useContext } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import GlobalContext from '../../context/GlobalContext';
import API_BASE_URL from '../../config';
import '../../App.css';

export default function RoomCalendar({ roomId, refreshCalendar }) {
  const { setFilteredEvents, setSelectedEvent, setShowEventDetailModal } =
    useContext(GlobalContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const accessToken = sessionStorage.getItem('accessToken');

  useEffect(() => {
    const fetchRoomBookings = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/roombooking/by-room-id/${roomId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          const formattedBookings = result.data.map((booking) => ({
            id: booking.bookingId,
            title: booking.purpose,
            start: booking.startTime,
            end: booking.endTime,
            backgroundColor: '#4CAF50',
            borderColor: '#4CAF50',
            textColor: '#FFFFFF',
            extendedProps: {
              status: booking.status,
              note: booking.description || booking.note,
              startTime: booking.startTime,
              endTime: booking.endTime,
              roomId: booking.roomId,
              roomName: booking.roomName,
              userEmail: booking.userEmail,
              bookedById: booking.bookedById,
              userName: booking.userName,
            },
          }));

          const sortedBookings = formattedBookings.sort(
            (a, b) => new Date(a.start) - new Date(b.start),
          );

          setEvents(sortedBookings);
          setFilteredEvents(sortedBookings);
        } else {
          console.error('Invalid data format:', result);
          setEvents([]);
        }
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomBookings();
  }, [roomId, setFilteredEvents, refreshCalendar, accessToken]);

  const formatTime = (time) =>
    new Date(time).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

  if (loading) {
    return (
      <div className='flex justify-center items-center h-full'>
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className='calendar-container'>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView='timeGridWeek'
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        events={events}
        eventDidMount={(info) => {
          info.el.style.setProperty(
            'background-color',
            'transparent',
            'important',
          );
          info.el.style.setProperty('border', 'none', 'important');
        }}
        eventClick={(info) => {
          setSelectedEvent(info.event.extendedProps);
          setShowEventDetailModal(true);
        }}
        eventMouseEnter={(info) => {
          const tooltip = document.createElement('div');
          tooltip.innerHTML = `
            <strong>${info.event.title}</strong><br />
            <em>${formatTime(info.event.start)} - ${formatTime(
            info.event.end,
          )}</em><br />
            <span style="color: #4CAF50;">
              BookingStatus: ${info.event.extendedProps.status}
            </span><br />
            Note: ${info.event.extendedProps.note || 'Nothing'}
          `;
          tooltip.className = 'custom-tooltip';
          document.body.appendChild(tooltip);
          tooltip.style.left = `${info.jsEvent.clientX + 10}px`;
          tooltip.style.top = `${info.jsEvent.clientY + 10}px`;
          info.el.addEventListener('mouseleave', () => {
            tooltip.remove();
          });
        }}
        height='800px'
        eventContent={(info) => (
          <div
            className='custom-event'
            style={{
              backgroundColor: info.event.backgroundColor,
              border: `1px solid ${info.event.borderColor}`,
              color: info.event.textColor,
              padding: '2px 4px',
              borderRadius: '4px',
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <div className='event-title text-base text-white tracking-tight text-center'>
              {info.event.title}
            </div>
            <div className='event-time text-xs text-white opacity-90 text-center'>
              {formatTime(info.event.start)} - {formatTime(info.event.end)}
            </div>
          </div>
        )}
      />
    </div>
  );
}
