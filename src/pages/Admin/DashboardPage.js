import React, { useEffect, useState } from 'react';
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

const NoData = ({ message = 'Không có dữ liệu' }) => (
  <div className='text-center text-gray-500 py-8'>{message}</div>
);

const StatsCard = ({ title, value, color }) => (
  <div
    className={`bg-white p-6 rounded-lg shadow-lg border-l-8 ${color} hover:shadow-2xl transition`}
  >
    <p className='text-3xl font-bold'>{value}</p>
    <p className='mt-2 text-gray-600'>{title}</p>
  </div>
);

const ExportSection = ({ downloadFile }) => (
  <section className='mb-12'>
    <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
      Xuất dữ liệu Excel
    </h2>
    <div className='flex flex-wrap gap-4'>
      <button
        onClick={() => downloadFile('export-bookings-excel', 'bookings.xlsx')}
        className='bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg shadow transition'
      >
        Xuất Bookings
      </button>
      <button
        onClick={() => downloadFile('export-rooms-excel', 'rooms.xlsx')}
        className='bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg shadow transition'
      >
        Xuất Rooms
      </button>
      <button
        onClick={() => downloadFile('export-user-excel', 'users.xlsx')}
        className='bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg shadow transition'
      >
        Xuất Users
      </button>
    </div>
  </section>
);

const TableSection = ({ title, columns, data, rowKey }) => (
  <section className='mb-12'>
    <h2 className='text-2xl font-semibold text-gray-800 mb-4'>{title}</h2>
    {data && data.length > 0 ? (
      <div className='bg-white rounded-lg shadow overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {data.map((item, index) => (
              <tr key={rowKey ? item[rowKey] : index}>
                {columns.map((col) => (
                  <td key={col.key} className='px-6 py-4 whitespace-nowrap'>
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
  </section>
);

// Component bao bọc biểu đồ với giao diện cải tiến
const ChartCard = ({ title, data, ChartComponent, options = {} }) => (
  <div className='bg-white p-6 rounded-lg shadow hover:shadow-xl transition transform hover:-translate-y-1'>
    <h3 className='text-lg font-semibold text-gray-700 mb-4'>{title}</h3>
    {data && data.labels.length > 0 ? (
      <div className='relative h-64'>
        <ChartComponent
          data={data}
          options={{
            maintainAspectRatio: false,
            plugins: {
              legend: { display: true, position: 'top' },
              tooltip: { enabled: true },
            },
            scales: {
              x: {
                ticks: { color: '#4a5568', font: { size: 12 } },
                grid: { color: 'rgba(0,0,0,0.1)' },
              },
              y: {
                ticks: { color: '#4a5568', font: { size: 12 } },
                grid: { color: 'rgba(0,0,0,0.1)' },
              },
            },
            ...options,
          }}
        />
      </div>
    ) : (
      <NoData />
    )}
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

  const downloadFile = async (endpoint, filename) => {
    try {
      const response = await fetch(`${API_BASE_URL}/statistical/${endpoint}`, {
        ...fetchOptions,
        method: 'GET',
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error(`Error downloading ${filename}:`, error);
    }
  };

  const formatChartData = (data, labelPrefix) => ({
    labels:
      data && data.length > 0
        ? data.map((item) => `${labelPrefix} ${item.period}`)
        : [],
    datasets: [
      {
        label: 'Số lượt đặt phòng',
        data: data && data.length > 0 ? data.map((item) => item.bookings) : [],
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
      },
    ],
  });

  const monthlyChartData = formatChartData(monthlyBookings, 'Tháng');
  const weeklyChartData = formatChartData(weeklyBookings, 'Tuần');
  const quarterlyChartData = formatChartData(quarterlyBookings, 'Quý');

  return (
    <div className='min-h-screen bg-gray-100'>
      <Header />
      <main className='container mx-auto p-6'>
        <h1 className='text-4xl font-extrabold text-center text-gray-800 mb-10'>
          Dashboard
        </h1>

        {/* Thống kê tổng quan */}
        {loading ? (
          <Spinner />
        ) : stats ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12'>
            <StatsCard
              title='Tổng số phòng'
              value={stats.totalRooms}
              color='border-blue-500'
            />
            <StatsCard
              title='Phòng có sẵn'
              value={stats.availableRooms}
              color='border-green-500'
            />
            <StatsCard
              title='Phòng tạm dừng'
              value={stats.unavailableRooms}
              color='border-yellow-500'
            />
            <StatsCard
              title='Tổng lượt đặt phòng'
              value={stats.totalBookings}
              color='border-orange-500'
            />
            <StatsCard
              title='Đặt phòng hôm nay'
              value={stats.todayBookings}
              color='border-red-500'
            />
          </div>
        ) : (
          <NoData />
        )}

        {/* Xuất dữ liệu Excel */}
        <ExportSection downloadFile={downloadFile} />

        {/* Top 5 Người Dùng */}
        <TableSection
          title='Top 5 Người Dùng Đặt Phòng Nhiều Nhất'
          columns={[
            { key: 'index', title: '#', render: (item, index) => index + 1 },
            { key: 'userName', title: 'Tên người dùng' },
            { key: 'bookingCount', title: 'Số lượt đặt' },
          ]}
          data={topUsers}
          rowKey='userId'
        />

        {/* Biểu đồ trong grid */}
        <section className='mb-12'>
          <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
            Biểu Đồ Đặt Phòng
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            <ChartCard
              title='Theo Tháng'
              data={monthlyChartData}
              ChartComponent={Bar}
            />
            <ChartCard
              title='Theo Tuần'
              data={weeklyChartData}
              ChartComponent={Line}
            />
            <ChartCard
              title='Theo Quý'
              data={quarterlyChartData}
              ChartComponent={Pie}
            />
          </div>
        </section>

        {/* Phòng được đặt nhiều nhất */}
        <section className='mb-12'>
          <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
            Phòng Được Đặt Nhiều Nhất
          </h2>
          {loading ? (
            <Spinner />
          ) : mostBookedRoom ? (
            <div className='bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition'>
              <p className='text-xl font-bold'>{mostBookedRoom.roomName}</p>
              <p className='mt-2 text-gray-600'>
                Số lượt đặt: {mostBookedRoom.bookingCount}
              </p>
            </div>
          ) : (
            <NoData />
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
