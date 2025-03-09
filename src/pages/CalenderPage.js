import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import 'react-time-picker/dist/TimePicker.css';
import TimePicker from 'react-time-picker';

export default function CalendarPage() {
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('09:00');
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleBooking = () => {
    alert(`Đặt phòng thành công vào ngày ${date.toLocaleDateString()} từ ${startTime} đến ${endTime}`);
    // Gửi thông tin đặt phòng lên API 
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const time = `${hour.toString().padStart(2, '0')}:${minute
          .toString()
          .padStart(2, '0')}`;
        options.push(time);
      }
    }
    return options;
  };
  
  const timeOptions = generateTimeOptions();

  // Lấy số ngày trong tháng
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  // Lấy ngày đầu tiên của tháng (0 = Chủ nhật)
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  // Xử lý chuyển tháng
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  // Tạo mảng ngày cho lịch
  const daysArray = [
    ...Array(firstDayOfMonth).fill(null), // Thêm ngày trống cho ngày đầu tháng
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
<div className="min-h-screen flex flex-col bg-gray-50">
  <Header />
  
  {/* Chia layout thành 2 phần */}
  <div className="container mx-auto mt-10 flex gap-6 mb-10">
    {/* Phần bên trái */}
        <div className="w-1/4 bg-white p-6 rounded-2xl shadow-md border border-gray-200 max-h-[650px] flex-shrink-0 flex flex-col">
        <h2 className="text-xl font-semibold mb-5 text-gray-800">Chọn ngày/giờ sử dụng</h2>
            {/* Chọn giờ */}
            <div className="grid grid-cols-2 gap-2 mb-3">
                {/* Giờ bắt đầu */}
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                        Giờ bắt đầu:
                    </label>
                    <select
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="border border-gray-300 rounded-md w-full px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 transition-shadow"
                    >
                        <option value="">Chọn giờ bắt đầu</option>
                        {timeOptions.map((time) => (
                            <option key={time} value={time}>
                                {time}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Giờ kết thúc */}
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                        Giờ kết thúc:
                    </label>
                    <select
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="border border-gray-300 rounded-md w-full px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 transition-shadow"
                    >
                        <option value="">Chọn giờ kết thúc</option>
                        {timeOptions.map((time) => (
                            <option key={time} value={time}>
                                {time}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Nút đặt phòng */}
            <button
                onClick={handleBooking}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-md shadow-sm transition-all duration-150 ease-in-out transform hover:-translate-y-0.5"
            >
                Đặt phòng
            </button>

            {/* Chọn ngày */}
            <div className="mt-3 flex justify-center">
                <Calendar
                    onChange={setDate}
                    value={date}
                    className="border border-gray-300 rounded-md shadow-sm w-[220px] h-[300px] text-xs"
                    tileClassName={({ date, view }) =>
                        view === 'month' && date.getDay() === 0
                            ? 'text-red-500'
                            : 'text-gray-800'
                    }
                    nextLabel=">"
                    prevLabel="<"
                    navigationLabel={({ date }) =>
                        `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`
                    }
                    formatShortWeekday={(locale, date) =>
                        date.toLocaleDateString(locale, { weekday: 'short' })
                    }
                    calendarType="gregory"
                />
            </div>
        </div>


    {/* Phần bên phải */}
    <div className="w3/4 flex-grow bg-gray-50 p-6 rounded-2xl shadow-md border border-gray-200">
      {/* Thanh điều hướng lịch */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">December 2020</h2>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition">
            Day
          </button>
          <button className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition">
            Week
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition">
            Month
          </button>
        </div>
        <input
          type="text"
          placeholder="Search..."
          className="border rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 transition"
        />
      </div>

      {/* Lưới lịch */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 35 }).map((_, index) => (
          <div
            key={index}
            className={`border h-24 p-2 flex flex-col justify-between rounded-lg shadow-sm hover:shadow-md transition ${
              index % 7 === 6 || index % 7 === 0 ? 'bg-gray-100' : 'bg-white'
            }`}
          >
            <span className="text-sm font-medium text-gray-700">
              {index + 1}
            </span>
            {index === 11 && (
              <div className="mt-2 bg-blue-100 text-blue-700 text-xs p-1 rounded">
                Test message here
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>

  <Footer />
</div>

  );
}
