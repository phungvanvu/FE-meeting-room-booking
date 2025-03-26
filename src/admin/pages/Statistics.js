import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Statistic = () => {
  const [timeFrame, setTimeFrame] = useState("week");

  const bookingData = {
    week: [
      { name: "Tuần 1", bookings: 120 },
      { name: "Tuần 2", bookings: 150 },
      { name: "Tuần 3", bookings: 90 },
    ],
    month: [
      { name: "Tháng 1", bookings: 450 },
      { name: "Tháng 2", bookings: 520 },
      { name: "Tháng 3", bookings: 610 },
    ],
    year: [
      { name: "2023", bookings: 5200 },
      { name: "2024", bookings: 6300 },
    ],
  };

  const topFavoriteRooms = [
    { name: "Phòng C", rating: 4.9, image: "room-c.jpg", location: "Tầng 3" },
    { name: "Phòng A", rating: 4.7, image: "room-a.jpg", location: "Tầng 1" },
    { name: "Phòng B", rating: 4.5, image: "room-b.jpg", location: "Tầng 2" },
  ];

  const topUsers = [
    { name: "Nguyễn Văn A", bookings: 35 },
    { name: "Trần Thị B", bookings: 30 },
    { name: "Lê Văn C", bookings: 28 },
    { name: "Phạm Minh D", bookings: 25 },
    { name: "Hoàng Thị E", bookings: 22 },
  ];

  const topUsedRooms = [
    { name: "Phòng C", usage: 80, image: "room-c.jpg", location: "Tầng 3", capacity: 20 },
    { name: "Phòng A", usage: 50, image: "room-a.jpg", location: "Tầng 1", capacity: 15 },
    { name: "Phòng B", usage: 40, image: "room-b.jpg", location: "Tầng 2", capacity: 10 },
  ];

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white shadow-lg p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Tổng lượng đặt phòng</h2>
        <div className="flex space-x-4 mb-4">
          <button onClick={() => setTimeFrame("week")} className="px-4 py-2 bg-gray-200 rounded">Tuần</button>
          <button onClick={() => setTimeFrame("month")} className="px-4 py-2 bg-gray-200 rounded">Tháng</button>
          <button onClick={() => setTimeFrame("year")} className="px-4 py-2 bg-gray-200 rounded">Năm</button>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={bookingData[timeFrame]}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="bookings" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white shadow-lg p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Phòng sử dụng nhiều nhất</h2>
        {topUsedRooms.map((room, index) => (
          <div key={index} className="flex items-center space-x-4 mb-2">
            <img src={room.image} alt={room.name} className="w-16 h-16 rounded" />
            <div>
              <p className="text-lg font-semibold">{room.name}</p>
              <p>Vị trí: {room.location}</p>
              <p>Sức chứa: {room.capacity} người</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white shadow-lg p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Top 3 Phòng được yêu thích nhất</h2>
        {topFavoriteRooms.map((room, index) => (
          <div key={index} className="flex items-center space-x-4 mb-2">
            <img src={room.image} alt={room.name} className="w-16 h-16 rounded" />
            <div>
              <p className="text-lg font-semibold">{room.name}</p>
              <p>Vị trí: {room.location}</p>
              <p>⭐ {room.rating} sao</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white shadow-lg p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Top 5 Người dùng đặt phòng nhiều nhất</h2>
        {topUsers.map((user, index) => (
          <p key={index} className="text-lg">{index + 1}. {user.name} ({user.bookings} lượt đặt phòng)</p>
        ))}
      </div>
    </div>
  );
};

export default Statistic;
