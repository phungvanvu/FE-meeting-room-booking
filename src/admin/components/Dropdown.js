import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dropdown() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="bg-white shadow-lg p-6 text-center rounded-lg cursor-pointer hover:bg-blue-100 transition">
        <h2 className="text-xl font-bold">Quản lý phòng</h2>
      </button>
      {open && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md mt-2 rounded-lg">
          <div onClick={() => navigate("/empty-rooms")} className="p-4 hover:bg-blue-100 cursor-pointer">Phòng trống</div>
          <div onClick={() => navigate("/booked-rooms")} className="p-4 hover:bg-blue-100 cursor-pointer">Phòng đã đặt</div>
        </div>
      )}
    </div>
  );
}
