import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import GlobalContext from '../../context/GlobalContext';
import { getMonth } from '../utils/util';

export default function SmallCalendar() {
  const [currentMonthIdx, setCurrentMonthIdx] = useState(dayjs().month());
  const [currentMonth, setCurrentMonth] = useState(getMonth());

  useEffect(() => {
    setCurrentMonth(getMonth(currentMonthIdx));
  }, [currentMonthIdx]);

  const { monthIndex, setSmallCalendarMonth, setDaySelected, daySelected } =
    useContext(GlobalContext);

  useEffect(() => {
    setCurrentMonthIdx(monthIndex);
  }, [monthIndex]);

  const handlePrevMonth = () => setCurrentMonthIdx(currentMonthIdx - 1);
  const handleNextMonth = () => setCurrentMonthIdx(currentMonthIdx + 1);

  const getDayClass = (day) => {
    const format = 'DD-MM-YY';
    const nowDay = dayjs().format(format);
    const currDay = day.format(format);
    const slcDay = daySelected && daySelected.format(format);
    if (nowDay === currDay) return 'bg-blue-500 rounded-full text-white';
    if (currDay === slcDay)
      return 'bg-blue-100 rounded-full text-blue-600 font-bold';
    return '';
  };

  return (
    <div className='mt-9'>
      <header className='flex justify-between items-center mb-3'>
        <p className='text-gray-500 font-bold'>
          {dayjs(new Date(dayjs().year(), currentMonthIdx)).format('MMMM YYYY')}
        </p>
        <div>
          <button
            onClick={handlePrevMonth}
            className='hover:text-blue-600 transition'
          >
            <span className='material-icons-outlined cursor-pointer mx-2'>
              chevron_left
            </span>
          </button>
          <button
            onClick={handleNextMonth}
            className='hover:text-blue-600 transition'
          >
            <span className='material-icons-outlined cursor-pointer mx-2'>
              chevron_right
            </span>
          </button>
        </div>
      </header>
      <div className='grid grid-cols-7 grid-rows-6 gap-1'>
        {currentMonth[0].map((day, i) => (
          <span key={i} className='text-sm py-1 text-center font-medium'>
            {day.format('dd').charAt(0)}
          </span>
        ))}
        {currentMonth.map((row, i) => (
          <React.Fragment key={i}>
            {row.map((day, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSmallCalendarMonth(currentMonthIdx);
                  setDaySelected(day);
                }}
                className={`py-1 w-full hover:bg-blue-50 transition ${getDayClass(
                  day,
                )}`}
              >
                <span className='text-sm'>{day.format('D')}</span>
              </button>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
