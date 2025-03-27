import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GlobalContext from "../../context/GlobalContext";
import API_BASE_URL from "../../config";

export default function EventModal({ onBookingSuccess }) {
  const { setShowEventModal, eventData, setEventData } =
    useContext(GlobalContext);
  const { roomName } = useParams();
  const accessToken = sessionStorage.getItem("accessToken");
  const [successMessage, setSuccessMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRoomId = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`${API_BASE_URL}/room/name/${roomName}`, {
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
              roomId: roomData.data.roomId,
            }));
          } else {
            console.error("Room ID not found in response");
          }
        } else {
          console.error("Failed to fetch room ID");
        }
      } catch (error) {
        console.error(error);
      }
    };
    setLoading(false);
    if (roomName) fetchRoomId();
  }, [roomName, setEventData]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`${API_BASE_URL}/user/my-info`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.ok) {
          const userData = await response.json();
          console.log("User Data:", userData);
          if (userData?.data?.userId) {
            setEventData((prev) => ({
              ...prev,
              bookedById: userData.data.userId,
            }));
          } else {
            console.error("User ID not found in response");
          }
        } else {
          console.error("Failed to fetch user info");
        }
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
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

    console.log("eventData:", eventData);
    if (
      !eventData.roomId ||
      !eventData.bookedById ||
      !eventData.startTime ||
      !eventData.endTime ||
      !eventData.purpose
    ) {
      alert("Please fill in all information!");
      return;
    }

    if (new Date(eventData.startTime) >= new Date(eventData.endTime)) {
      alert("Start time must be before end time!");
      return;
    }

    // Cộng thêm 7 giờ để chuyển về UTC+0
    const startTime = new Date(eventData.startTime);
    startTime.setHours(
      startTime.getHours() - startTime.getTimezoneOffset() / 60
    );

    const endTime = new Date(eventData.endTime);
    endTime.setHours(endTime.getHours() - endTime.getTimezoneOffset() / 60);

    const formattedData = {
      roomId: eventData.roomId || null,
      bookedById: eventData.bookedById || null,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      purpose: eventData.purpose,
      description: eventData.description || "",
    };

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/roombooking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formattedData),
      });

      const result = await response.json();

      if (result.success) {
        setSuccessMessage(`Đặt phòng thành công!`);
        onBookingSuccess();
        setTimeout(() => {
          setShowEventModal(false);
          setSuccessMessage("");
        }, 3000);
      } else {
        const errorMessage = result.error?.message || "Lỗi không xác định";
        setError(`${errorMessage}`);
      }
    } catch (error) {
      console.error("Error during booking:", error);
      setError("Lỗi mạng, vui lòng thử lại sau!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
      onClick={() => setShowEventModal(false)}
    >
      <div
        className='bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative'
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className='text-xl font-bold text-gray-800 mb-4'>Book a Room</h2>

        {/* Hiển thị lỗi */}
        {error && <p className='text-red-500 text-sm mb-2'>{error}</p>}
        {successMessage && (
          <p className='text-green-500 text-sm mb-2'>{successMessage}</p>
        )}

        {/* Hiển thị khi đang tải */}
        {loading && <p className='text-blue-500 text-sm mb-2'>Đang xử lý...</p>}

        <form className='space-y-4' onSubmit={handleSubmit}>
          <input type='hidden' name='roomId' value={eventData.roomId || ""} />

          {/* Purpose */}
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Title
            </label>
            <select
              name='purpose'
              value={eventData.purpose || ""}
              onChange={handleChange}
              required
              className='mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
            >
              <option value=''>Choose Title</option>
              <option value='INTERVIEW'>Interview</option>
              <option value='MEETING'>Meeting</option>
              <option value='TRAINING'>Training</option>
              <option value='CLIENT_MEETING'>Meet customers/partners</option>
            </select>
          </div>

          {/* Start Time */}
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Start Time
            </label>
            <input
              type='datetime-local'
              name='startTime'
              value={eventData.startTime || ""}
              onChange={handleChange}
              required
              className='mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
            />
          </div>

          {/* End Time */}
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              End Time
            </label>
            <input
              type='datetime-local'
              name='endTime'
              value={eventData.endTime || ""}
              onChange={handleChange}
              required
              className='mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
            />
          </div>

          {/* Description */}
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Description
            </label>
            <textarea
              name='description'
              value={eventData.description || ""}
              onChange={handleChange}
              className='mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
              rows='3'
            ></textarea>
          </div>

          {/* Buttons */}
          <div className='flex justify-end gap-3 mt-4'>
            {/* Submit Button */}
            <button
              type='submit'
              disabled={loading}
              className={`w-full py-2 text-white rounded-lg ${
                loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {loading ? "Đang xử lý..." : "Đặt Phòng"}
            </button>
            <button
              type='button'
              onClick={() => setShowEventModal(false)}
              className='bg-gray-300 text-gray-700 px-4 py-2 rounded-lg'
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
