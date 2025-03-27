import React, { useState } from "react";

const Statistic = () => {
  const stats = [
    { label: "Tổng số phòng", value: 50, borderColor: "border-blue-500", textColor: "text-blue-500" },
    { label: "Phòng có sẵn", value: 20, borderColor: "border-green-500", textColor: "text-green-500" },
    { label: "Phòng tạm dừng", value: 2, borderColor: "border-yellow-500", textColor: "text-yellow-500" },
    { label: "Tổng lượng đặt phòng", value: 300, borderColor: "border-orange-500", textColor: "text-orange-500" },
    { label: "Số đặt phòng hôm nay", value: 3, borderColor: "border-red-500", textColor: "text-red-500" },
  ];

  const [showMostUsed, setShowMostUsed] = useState(true);

  const roomsData = [
    { id: "R001", name: "Interview 1", capacity: 4, location: "Tầng 8 - Tòa nhà 789", usageCount: 15, rating: 4.5, image: "/room/room1.jpg" },
    { id: "R002", name: "Interview 2", capacity: 6, location: "Thành Công Building", usageCount: 5, rating: 4.0, image: "/room/room2.jpg" },
    { id: "R003", name: "Creative", capacity: 10, location: "The West Building", usageCount: 20, rating: 5.0, image: "/room/room3.jpg" },
    { id: "R004", name: "Brain Stomming", capacity: 6, location: "Tầng 8 - Tòa nhà 789", usageCount: 3, rating: 3.5, image: "/room/room4.jpg" },
    { id: "R005", name: "Training 1", capacity: 10, location: "Thành Công Building", usageCount: 8, rating: 4.2, image: "/room/room5.jpg" },
    { id: "R006", name: "Training 2", capacity: 6, location: "The West Building", usageCount: 12, rating: 4.8, image: "/room/room6.jpg" },
  ];

  const usersData = [
    { id: 1, name: "NNguyễn Phương Thảo", username: "npthao", location: "DU3.11", bookings: 10 },
    { id: 2, name: "Phùng Thị Linh", username: "ptlinh", location: "Đà DJK2", bookings: 8 },
    { id: 3, name: "Phùng Văn Vũ", username: "pvvu", location: "Hồ Chí DKR1", bookings: 6 },
    { id: 4, name: "Nguyễn Thị D", username: "nguyenthid", location: "Hải Phòng", bookings: 5 },
  ];

  const sortedRooms = roomsData.sort((a, b) =>
    showMostUsed ? b.usageCount - a.usageCount : a.usageCount - b.usageCount
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Thống kê tổng số phòng */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className={`border-4 rounded-lg p-4 ${stat.borderColor} bg-white`}>
            <h3 className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</h3>
            <p className={stat.textColor}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Thống kê phòng được sử dụng */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Thống kê phòng được sử dụng</h2>
        <div className="flex">
          <label className="mr-4">
            <input
              type="radio"
              value="most"
              checked={showMostUsed}
              onChange={() => setShowMostUsed(true)}
            />
            Nhiều nhất
          </label>
          <label>
            <input
              type="radio"
              value="least"
              checked={!showMostUsed}
              onChange={() => setShowMostUsed(false)}
            />
            Ít nhất
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedRooms.slice(0, 3).map((room) => (
          <div key={room.id} className="border rounded-lg p-4 bg-white shadow-md w-full">
            <img src={room.image} alt={room.name} className="w-full h-32 object-cover rounded" />
            <div className="flex flex-col mt-2">
              <div className="flex justify-between">
                <h3 className="text-lg font-bold">{room.name}</h3>
                <p className="text-lg font-bold">{room.usageCount} lần</p>
              </div>
              <p className="text-gray-600">Vị trí: {room.location}</p>
              <p className="text-gray-600">Sức chứa: {room.capacity} người</p>
            </div>
          </div>
        ))}
      </div>

      {/* Thống kê Top phòng được yêu thích nhất */}
      <h2 className="text-xl font-semibold mt-6 mb-4">Top phòng được đánh giá cao</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roomsData.sort((a, b) => b.rating - a.rating).slice(0, 3).map((room, index) => (
          <div key={room.id} className="border rounded-lg p-4 bg-white shadow-md w-full">
            <img src={room.image} alt={room.name} className="w-full h-32 object-cover rounded" />
            <div className="flex flex-col mt-2 text-center">
              <h3 className="text-lg font-bold">{`TOP ${index + 1}: ${room.name}`}</h3>
              <p className="text-gray-600">Vị trí: {room.location}</p>
              <p className="text-gray-600">Sức chứa: {room.capacity} người</p>
            </div>
          </div>
        ))}
      </div>

      {/* Thống kê Top 3 người dùng đặt phòng nhiều nhất */}
      <h2 className="text-xl font-semibold mt-6 mb-4">Top người dùng đặt phòng nhiều nhất</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border">Tên</th>
            <th className="py-2 px-4 border">Username</th>
            <th className="py-2 px-4 border">Nhóm</th>
            <th className="py-2 px-4 border">Số lần đặt</th>
          </tr>
        </thead>
        <tbody>
          {usersData.sort((a, b) => b.bookings - a.bookings).slice(0, 3).map(user => (
            <tr key={user.id} className="border-b">
              <td className="py-2 px-4 border">{user.name}</td>
              <td className="py-2 px-4 border">{user.username}</td>
              <td className="py-2 px-4 border">{user.location}</td>
              <td className="py-2 px-4 border">{user.bookings}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Statistic;