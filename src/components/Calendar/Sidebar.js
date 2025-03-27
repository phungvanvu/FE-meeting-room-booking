import React from "react";
import CreateEventButton from "./CreateButton";
import SmallCalendar from "./SmallCalendar";
export default function Sidebar() {
  return (
    <aside className='border-r p-5 w-[250px] h-full overflow-y-auto sticky top-0 pb-4'>
      <CreateEventButton />
      <SmallCalendar />
    </aside>
  );
}
