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

const NoData = ({ message = 'No data available' }) => (
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
              title='Total number of rooms'
              value={stats.totalRooms}
              color='border-blue-500'
            />
            <StatsCard
              title='Room available'
              value={stats.availableRooms}
              color='border-green-500'
            />
            <StatsCard
              title='Room unavailable'
              value={stats.unavailableRooms}
              color='border-yellow-500'
            />
            <StatsCard
              title='Total number of bookings'
              value={stats.totalBookings}
              color='border-orange-500'
            />
            <StatsCard
              title='Make a reservation today'
              value={stats.todayBookings}
              color='border-red-500'
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
            <ChartCard
              title='By Month'
              data={monthlyChartData}
              ChartComponent={Bar}
            />
            <ChartCard
              title='By Week'
              data={weeklyChartData}
              ChartComponent={Line}
            />
            <ChartCard
              title='By Quarterly'
              data={quarterlyChartData}
              ChartComponent={Pie}
            />
          </div>
        </section>

        {/* Top 5 Người Dùng */}
        <TableSection
          title='Top Most Booked Users'
          columns={[
            { key: 'index', title: '#', render: (item, index) => index + 1 },
            { key: 'userName', title: 'User name' },
            { key: 'bookingCount', title: 'Number of bookings' },
          ]}
          data={topUsers}
          rowKey='userId'
        />

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
