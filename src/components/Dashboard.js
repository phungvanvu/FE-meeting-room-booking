import React from 'react';
import MeetingRoomTable from './MeetingRoomTable';
import './Dashboard.css'; // Include your CSS for styling

const Dashboard = () => {
    const totalRooms = 5;
    const bookedRooms = 2;
    const deleteRooms = 2;
    const todayBookings = 3;

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>XORNET</h1>
                <nav>
                    <span>Dashboard</span>
                    <span>Meeting Room</span>
                    <span>John Doe</span>
                </nav>
            </header>

            <div className="dashboard-stats">
                <div className="stat-card">{totalRooms} Total Meeting Rooms</div>
                <div className="stat-card">{bookedRooms} Booked Rooms</div>
                <div className="stat-card">{deleteRooms} Deleted Rooms</div>
                <div className="stat-card">{todayBookings} Today's Bookings</div>
            </div>

            <h2>List of Meetings Rooms</h2>
            <MeetingRoomTable />
        </div>
    );
};

export default Dashboard;


/*
import React from 'react';
import meetingRooms from './data';

const MeetingRoomTable = () => {
    return (
        <table>
            <thead>
                <tr>
                    <th>Room Name</th>
                    <th>Added Date</th>
                    <th>Amenities</th>
                    <th>Seating Capacity</th>
                    <th>Location</th>
                    <th>Booked Meetings</th>
                    <th>Status</th>
                    <th>Reason</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {meetingRooms.map((room, index) => (
                    <tr key={index}>
                        <td>{room.name}</td>
                        <td>{room.addedDate}</td>
                        <td>{room.amenities}</td>
                        <td>{room.seatingCapacity}</td>
                        <td>{room.location}</td>
                        <td>{room.bookedMeetings}</td>
                        <td>{room.status}</td>
                        <td>{room.reason}</td>
                        <td><button>Action</button></td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default MeetingRoomTable;



const meetingRooms = [
    { name: 'Jasmin', addedDate: '12/06/2020', amenities: 'Audio, Video, HDMI, White Board, Sound System', seatingCapacity: 3, location: 'Pune Hinjewadi', bookedMeetings: 2, status: 'Booked', reason: '-' },
    { name: 'Lotus', addedDate: '28/10/2012', amenities: 'Audio, Video, HDMI, White Board, Sound System', seatingCapacity: 6, location: 'Pune Hinjewadi', bookedMeetings: 0, status: 'Delete', reason: 'Wifi Issue' },
    { name: 'Rose', addedDate: '12/06/2020', amenities: 'Audio, Video, HDMI, White Board, Sound System', seatingCapacity: 8, location: 'Pune Hinjewadi', bookedMeetings: 2, status: 'Booked', reason: '-' },
    { name: 'Marigold', addedDate: '15/08/2017', amenities: 'Audio, Video, HDMI, White Board, Sound System', seatingCapacity: 9, location: 'Pune Hinjewadi', bookedMeetings: 0, status: 'Available', reason: '-' },
    { name: 'Aster', addedDate: '18/09/2016', amenities: 'Audio, Video, HDMI, White Board, Sound System', seatingCapacity: 10, location: 'Pune Hinjewadi', bookedMeetings: 1, status: 'Not Available', reason: '-' },
];

export default meetingRooms;

*/
