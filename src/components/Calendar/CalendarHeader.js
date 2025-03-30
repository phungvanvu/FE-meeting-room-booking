import dayjs from 'dayjs';
import React, { useContext } from 'react';
import logo from '../../assets/logo.png';
import GlobalContext from '../../context/GlobalContext';

export default function CalendarHeader() {
  const { monthIndex, setMonthIndex } = useContext(GlobalContext);

  const handlePrevMonth = () => setMonthIndex(monthIndex - 1);
  const handleNextMonth = () => setMonthIndex(monthIndex + 1);
  const handleReset = () => {
    setMonthIndex(
      monthIndex === dayjs().month()
        ? dayjs().month() + Math.random()
        : dayjs().month(),
    );
  };

  return (
    <header className='px-4 py-2 flex items-center bg-gradient-to-r from-blue-500 to-indigo-500 text-white'>
      <img src={logo} alt='calendar' className='mr-2 w-12 h-12' />
      <h1 className='mr-10 text-xl font-bold'>Calendar</h1>
      <button
        onClick={handleReset}
        className='bg-white text-blue-500 border rounded py-2 px-4 mr-5 hover:bg-gray-100 transition'
      >
        Today
      </button>
      <button
        onClick={handlePrevMonth}
        className='hover:text-gray-200 transition'
      >
        <span className='material-icons-outlined cursor-pointer mx-2'>
          chevron_left
        </span>
      </button>
      <button
        onClick={handleNextMonth}
        className='hover:text-gray-200 transition'
      >
        <span className='material-icons-outlined cursor-pointer mx-2'>
          chevron_right
        </span>
      </button>
      <h2 className='ml-4 text-xl font-bold'>
        {dayjs(new Date(dayjs().year(), monthIndex)).format('MMMM YYYY')}
      </h2>
    </header>
  );
}
