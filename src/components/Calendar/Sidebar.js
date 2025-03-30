import React from 'react';
import CreateButton from './CreateButton';
import SmallCalendar from './SmallCalendar';

export default function Sidebar() {
  return (
    <aside className='border-r p-5 w-full h-full overflow-y-auto sticky top-0 pb-4'>
      <CreateButton />
      <SmallCalendar />
    </aside>
  );
}
