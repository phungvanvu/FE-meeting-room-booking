import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const ManageRooms = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow p-8">
        <h2 className="text-2xl font-bold mb-6">Quản lý phòng</h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          {isOpen ? <FaChevronUp /> : <FaChevronDown />} Danh sách phòng
        </button>
        {isOpen && (
          <div className="mt-4 space-y-2">
            <Link to="/available-rooms" className="block bg-gray-200 p-4 rounded-lg hover:bg-gray-300">
              Phòng trống
            </Link>
            <Link to="/booked-rooms" className="block bg-gray-200 p-4 rounded-lg hover:bg-gray-300">
              Phòng đã đặt
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ManageRooms;
