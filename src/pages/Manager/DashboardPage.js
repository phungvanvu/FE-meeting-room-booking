import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Bar, Line, Pie } from 'react-chartjs-2';
import API_BASE_URL from '../../config';
import 'chart.js/auto';

const Spinner = () => (
  <div className='flex justify-center items-center py-8'>
    <div className='w-12 h-12 border-4 border-blue-400 border-dashed rounded-full animate-spin'></div>
  </div>
);

const NoData = ({ message = 'No data available' }) => (
  <div className='text-center text-gray-500 py-8'>{message}</div>
);

// Card component nhận vào callback onClick
const StatsCard = ({ title, value, color, onClick }) => (
  <div
    className={`bg-white p-6 rounded-lg shadow-lg border-l-8 ${color} hover:shadow-2xl transition cursor-pointer`}
    onClick={onClick}
  >
    <p className='text-3xl font-bold'>{value}</p>
    <p className='mt-2 text-gray-600'>{title}</p>
  </div>
);

// Modal component
const Modal = ({ title, data, onClose, columns, rowKey }) => (
  <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm'>
    <div className='w-full max-w-3xl rounded-lg bg-white p-6 shadow-xl'>
      <div className='flex items-center justify-between border-b pb-3'>
        <h2 className='text-2xl font-semibold text-gray-800'>{title}</h2>
        <button
          onClick={onClose}
          className='text-gray-600 hover:text-gray-800 transition'
        >
          {/* Close Icon */}
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
        </button>
      </div>
      <div className='mt-4 max-h-[70vh] overflow-y-auto'>
        {data && data.length > 0 ? (
          <div className='overflow-x-auto'>
            <table className='min-w-full'>
              <thead className='bg-gray-100'>
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                    >
                      {col.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {data.map((item, index) => (
                  <tr key={rowKey ? item[rowKey] : index}>
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className='px-4 py-2 whitespace-nowrap text-sm text-gray-700'
                      >
                        {col.render ? col.render(item, index) : item[col.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <NoData />
        )}
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [topUsers, setTopUsers] = useState(null);
  const [currentMonthBookings, setCurrentMonthBookings] = useState(null);
  const [monthlyBookings, setMonthlyBookings] = useState(null);
  const [weeklyBookings, setWeeklyBookings] = useState(null);
  const [quarterlyBookings, setQuarterlyBookings] = useState(null);
  const [mostBookedRoom, setMostBookedRoom] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalData, setModalData] = useState([]);
  const [modalColumns, setModalColumns] = useState([]);

  const navigate = useNavigate();
  const accessToken = sessionStorage.getItem('accessToken');
  const fetchOptions = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  };

  useEffect(() => {
    const endpoints = [
      { url: `${API_BASE_URL}/statistical/statistics`, setter: setStats },
      { url: `${API_BASE_URL}/statistical/top-users/5`, setter: setTopUsers },
      {
        url: `${API_BASE_URL}/statistical/current-month-bookings`,
        setter: setCurrentMonthBookings,
      },
      {
        url: `${API_BASE_URL}/statistical/monthly-bookings`,
        setter: setMonthlyBookings,
      },
      {
        url: `${API_BASE_URL}/statistical/weekly-bookings`,
        setter: setWeeklyBookings,
      },
      {
        url: `${API_BASE_URL}/statistical/quarterly-bookings`,
        setter: setQuarterlyBookings,
      },
      {
        url: `${API_BASE_URL}/statistical/most-booked-room`,
        setter: setMostBookedRoom,
      },
    ];

    Promise.all(
      endpoints.map(async ({ url, setter }) => {
        try {
          const response = await fetch(url, fetchOptions);
          const result = await response.json();
          setter(result.success ? result.data : null);
        } catch (error) {
          console.error('Error fetching from', url, error);
          setter(null);
        }
      }),
    ).finally(() => setLoading(false));
  }, []);

  const formatChartData = (data, labelPrefix) => ({
    labels:
      data && data.length > 0
        ? data.map((item) => `${labelPrefix} ${item.period}`)
        : [],
    datasets: [
      {
        label: 'Number of bookings',
        data: data && data.length > 0 ? data.map((item) => item.bookings) : [],
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
      },
    ],
  });

  const monthlyChartData = formatChartData(monthlyBookings, 'Month');
  const weeklyChartData = formatChartData(weeklyBookings, 'Week');
  const quarterlyChartData = formatChartData(quarterlyBookings, 'Quarter');
  // Xử lý click vào từng thẻ thống kê
  const handleCardClick = (cardType) => {
    if (cardType === 'totalRooms') {
      navigate('/ManageRoom');
    } else if (cardType === 'totalBookings') {
      navigate('/ManageRoom');
    } else if (stats) {
      switch (cardType) {
        case 'availableRooms':
          setModalTitle('List of available rooms');
          setModalData(stats.availableRoomList);
          setModalColumns([
            { key: 'roomId', title: 'ID' },
            { key: 'roomName', title: 'Room name' },
            { key: 'location', title: 'Location' },
            { key: 'capacity', title: 'Capacity' },
          ]);
          break;
        case 'unavailableRooms':
          setModalTitle('List of unavailable rooms');
          setModalData(stats.unavailableRoomList);
          setModalColumns([
            { key: 'roomId', title: 'ID' },
            { key: 'roomName', title: 'Room name' },
            { key: 'location', title: 'Location' },
            { key: 'capacity', title: 'Capacity' },
          ]);
          break;
        case 'todayBookings':
          setModalTitle("Today's booking list");
          setModalData(stats.todayBookingList);
          setModalColumns([
            { key: 'bookingId', title: 'ID' },
            { key: 'roomName', title: 'Room name' },
            { key: 'userName', title: 'Booking by' },
            { key: 'startTime', title: 'Start time' },
            { key: 'endTime', title: 'End time' },
          ]);
          break;
        default:
          setModalTitle('');
          setModalData([]);
      }
      setIsModalOpen(true);
    }
  };

  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <main className='container mx-auto flex-1 p-6'>
        <h1 className='text-4xl font-extrabold text-center text-gray-800 mb-10'>
          Dashboard
        </h1>
        {/* Thống kê tổng quan */}
        {loading ? (
          <Spinner />
        ) : stats ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12'>
            <StatsCard
              title='Total number of rooms'
              value={stats.totalRooms}
              color='border-blue-500'
              onClick={() => handleCardClick('totalRooms')}
            />
            <StatsCard
              title='Room available'
              value={stats.availableRooms}
              color='border-green-500'
              onClick={() => handleCardClick('availableRooms')}
            />
            <StatsCard
              title='Room unavailable'
              value={stats.unavailableRooms}
              color='border-yellow-500'
              onClick={() => handleCardClick('unavailableRooms')}
            />
            <StatsCard
              title='Total number of bookings'
              value={stats.totalBookings}
              color='border-orange-500'
              onClick={() => handleCardClick('totalBookings')}
            />
            <StatsCard
              title='Make a reservation today'
              value={stats.todayBookings}
              color='border-red-500'
              onClick={() => handleCardClick('todayBookings')}
            />
          </div>
        ) : (
          <NoData />
        )}

        {/* Biểu đồ trong grid */}
        <section className='mb-12'>
          <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
            Reservation Chart
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            <div className='bg-white p-6 rounded-lg shadow hover:shadow-xl transition transform hover:-translate-y-1'>
              <h3 className='text-lg font-semibold text-gray-700 mb-4'>
                By Month
              </h3>
              {monthlyChartData.labels.length > 0 ? (
                <div className='relative h-64'>
                  <Bar
                    data={monthlyChartData}
                    options={{ maintainAspectRatio: false }}
                  />
                </div>
              ) : (
                <NoData />
              )}
            </div>
            <div className='bg-white p-6 rounded-lg shadow hover:shadow-xl transition transform hover:-translate-y-1'>
              <h3 className='text-lg font-semibold text-gray-700 mb-4'>
                By Week
              </h3>
              {weeklyChartData.labels.length > 0 ? (
                <div className='relative h-64'>
                  <Line
                    data={weeklyChartData}
                    options={{ maintainAspectRatio: false }}
                  />
                </div>
              ) : (
                <NoData />
              )}
            </div>
            <div className='bg-white p-6 rounded-lg shadow hover:shadow-xl transition transform hover:-translate-y-1'>
              <h3 className='text-lg font-semibold text-gray-700 mb-4'>
                By Quarterly
              </h3>
              {quarterlyChartData.labels.length > 0 ? (
                <div className='relative h-64'>
                  <Pie
                    data={quarterlyChartData}
                    options={{ maintainAspectRatio: false }}
                  />
                </div>
              ) : (
                <NoData />
              )}
            </div>
          </div>
        </section>

        {/* Top 5 Người Dùng */}
        <section className='mb-12'>
          <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
            Top Most Booked Users
          </h2>
          {topUsers && topUsers.length > 0 ? (
            <div className='bg-white rounded-lg shadow overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      #
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      User name
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Number of bookings
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {topUsers.map((user, index) => (
                    <tr key={user.userId}>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        {index + 1}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        {user.userName}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        {user.bookingCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <NoData />
          )}
        </section>

        {/* Phòng được đặt nhiều nhất */}
        <section className='mb-12'>
          <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
            Most booked rooms
          </h2>
          {loading ? (
            <Spinner />
          ) : mostBookedRoom ? (
            <div className='bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition'>
              <p className='text-xl font-bold'>{mostBookedRoom.roomName}</p>
              <p className='mt-2 text-gray-600'>
                Count: {mostBookedRoom.bookingCount}
              </p>
            </div>
          ) : (
            <NoData />
          )}
        </section>
      </main>
      <Footer />

      {/* Modal hiển thị danh sách dữ liệu */}
      {isModalOpen && (
        <Modal
          title={modalTitle}
          data={modalData}
          columns={modalColumns}
          rowKey='id'
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
