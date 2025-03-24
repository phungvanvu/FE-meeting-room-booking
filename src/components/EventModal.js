import React, { useContext, useState, useEffect } from "react";
import GlobalContext from "../context/GlobalContext";

export default function EventModal() {
  const { setShowEventModal, eventData, setEventData } = useContext(GlobalContext);

  // Lấy thông tin người dùng từ API
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("http://localhost:8080/MeetingRoomBooking/user/my-info");
        if (response.ok) {
          const userData = await response.json();
          setEventData((prev) => ({
            ...prev,
            bookedById: userData.id,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/MeetingRoomBooking/roombooking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        alert("Booking created successfully!");
        setShowEventModal(false);
      } else {
        const errorData = await response.json();
        console.error("Error creating booking:", errorData);
        alert(`Failed to create booking: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Failed to create booking:", error);
      alert("Failed to create booking. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-5 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Create Booking</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Room ID</label>
            <input
              type="number"
              name="roomId"
              value={eventData.roomId || ""}
              onChange={handleChange}
              className="border w-full px-3 py-2 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Start Time</label>
            <input
              type="datetime-local"
              name="startTime"
              value={eventData.startTime}
              onChange={handleChange}
              className="border w-full px-3 py-2 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">End Time</label>
            <input
              type="datetime-local"
              name="endTime"
              value={eventData.endTime}
              onChange={handleChange}
              className="border w-full px-3 py-2 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Purpose</label>
            <select
              name="purpose"
              value={eventData.purpose}
              onChange={handleChange}
              className="border w-full px-3 py-2 rounded-lg"
              required
            >
              <option value="">Select Purpose</option>
              <option value="TRAINING">Training</option>
              <option value="MEETING">Meeting</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Note</label>
            <textarea
              name="note"
              value={eventData.note}
              onChange={handleChange}
              className="border w-full px-3 py-2 rounded-lg"
              rows="3"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setShowEventModal(false)}
              className="px-4 py-2 border rounded-lg bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border rounded-lg bg-blue-500 text-white"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
