import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import GlobalContext from "../../context/GlobalContext";

export default function EventModal() {
  const { setShowEventModal, eventData, setEventData } = useContext(GlobalContext);
  const { roomName } = useParams();
  const accessToken = sessionStorage.getItem("accessToken");

  useEffect(() => {
    const fetchRoomId = async () => {
      try {
        const response = await fetch(`http://localhost:8080/MeetingRoomBooking/room/name/${roomName}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.ok) {
          const roomData = await response.json();
          console.log("Room Data:", roomData);
          if (roomData?.data?.roomId) {
            setEventData((prev) => ({
              ...prev,
              roomId: roomData.data.roomId, // Lấy roomId từ API
            }));
          } else {
            console.error("Room ID not found in response");
          }
        } else {
          console.error("Failed to fetch room ID");
        }
      } catch (error) {
        console.error("Error fetching room ID:", error);
      }
    };
  
    if (roomName) fetchRoomId();
  }, [roomName, setEventData]);
  
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("http://localhost:8080/MeetingRoomBooking/user/my-info", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.ok) {
          const userData = await response.json();
          console.log("User Data:", userData); // Kiểm tra dữ liệu trả về từ server
          if (userData?.data?.userId) {
            setEventData((prev) => ({
              ...prev,
              bookedById: userData.data.userId, // Lấy userId từ API
            }));
          } else {
            console.error("User ID not found in response");
          }
        } else {
          console.error("Failed to fetch user info");
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };
  
    fetchUserInfo();
  }, [setEventData]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    console.log("eventData:", eventData); // Kiểm tra giá trị thực tế
  
    // Đảm bảo dữ liệu đầy đủ
    if (!eventData.roomId || !eventData.bookedById || !eventData.startTime || !eventData.endTime || !eventData.purpose || !eventData.status) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }
  
    const formattedData = {
      roomId: eventData.roomId || null,
      bookedById: eventData.bookedById || null,
      startTime: new Date(eventData.startTime).toISOString().slice(0, 19),
      endTime: new Date(eventData.endTime).toISOString().slice(0, 19),
      purpose: eventData.purpose,
      status: eventData.status,
      note: eventData.note || ""
    };    
  
    try {
      const response = await fetch("http://localhost:8080/MeetingRoomBooking/roombooking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formattedData),
      });
  
      if (response.ok) {
        alert("Booking created successfully!");
        setShowEventModal(false);
      } else {
        const errorData = await response.json();
        alert(`Failed to create booking: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error during booking:", error);
      alert("Failed to create booking. Please check your network connection and try again.");
    }
  };
  

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={() => setShowEventModal(false)}
    >
      <div
        className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4">Đặt Phòng</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
              type="hidden"
              name="roomId"
              value={eventData.roomId || ""}
            />

          {/* Purpose */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Mục đích</label>
            <select
              name="purpose"
              value={eventData.purpose || ""}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">-- Choose purpose --</option>
              <option value="INTERVIEW">Interview</option>
              <option value="MEETING">Meeting</option>
              <option value="TRAINING">Training</option>
              <option value="CLIENT_MEETING">Meet customers/partners</option>
            </select>
          </div>


          {/* Start Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Thời gian bắt đầu</label>
            <input
              type="datetime-local"
              name="startTime"
              value={eventData.startTime || ""}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* End Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Thời gian kết thúc</label>
            <input
              type="datetime-local"
              name="endTime"
              value={eventData.endTime || ""}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
            <select
              name="status"
              value={eventData.status || ""}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">-- Chọn trạng thái --</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="PENDING">PENDING</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Ghi chú</label>
            <textarea
              name="note"
              value={eventData.note || ""}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows="3"
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Đặt phòng
            </button>
            <button
              type="button"
              onClick={() => setShowEventModal(false)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
