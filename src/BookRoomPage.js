import { useState } from "react";
import { MapPin, Armchair, CheckCircle } from "lucide-react";

const roomsData = [
  { id: 1, name: "BHAGIRATHI", capacity: 8, location: "Pune Hinjewadi", available: false },
  { id: 2, name: "GHATAPRABHA", capacity: 8, location: "Pune Hinjewadi", available: true },
  { id: 3, name: "BHIMA", capacity: 8, location: "Pune Hinjewadi", available: true },
  { id: 4, name: "TUNGBHADRA", capacity: 4, location: "Pune Hinjewadi", available: false },
  { id: 5, name: "BRAMHAPUTRA", capacity: 4, location: "Pune Hinjewadi", available: true },
  { id: 6, name: "SINDU", capacity: 4, location: "Pune Hinjewadi", available: true },
];

const Header = () => {
  return (
    <div className="bg-teal-600 text-white flex justify-between items-center px-6 py-4 shadow-md">
      <img src="/Header/Logo.png" alt="Logo" className="h-10 cursor-pointer" />
      <div className="flex items-center space-x-6">
        <span className="cursor-pointer hover:underline">My Bookings</span>
        <span className="cursor-pointer hover:underline">Dashboard</span>
        <div className="relative cursor-pointer">
          <CheckCircle className="h-6 w-6" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-xs text-white rounded-full px-1">6</span>
        </div>
        <div className="flex items-center space-x-2">
          <img src="/System Icons 32pt/Profile icon.png" alt="Profile" className="h-8 w-8 rounded-full" />
          <span>John Doe</span>
        </div>
      </div>
    </div>
  );
};

export default function BookRoomPage() {
  const [rooms, setRooms] = useState(roomsData);

  const handleBookRoom = (roomId) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.id === roomId ? { ...room, available: false } : room
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="py-10 px-6 flex flex-col lg:flex-row gap-8">
        <div className="bg-white p-6 shadow-lg rounded-2xl w-full lg:w-1/3 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Book a Room</h2>
          <p className="text-gray-600">Select a room from the list to book.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full lg:w-2/3">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white p-4 rounded-xl shadow-md border border-gray-300 transition transform hover:scale-105"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">{room.name}</h3>
                <span
                  className={`px-3 py-1 text-sm rounded-full ${room.available ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
                >
                  {room.available ? "Available" : "Booked"}
                </span>
              </div>
              <p className="text-sm text-gray-600 flex items-center mb-1">
                <MapPin className="h-4 w-4 mr-1" /> {room.location}
              </p>
              <p className="text-sm text-gray-600 flex items-center mb-2">
                <Armchair className="h-4 w-4 mr-1" /> {room.capacity} Seats
              </p>
              {room.available && (
                <button
                  className="mt-3 w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition"
                  onClick={() => handleBookRoom(room.id)}
                >
                  Book Now
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
