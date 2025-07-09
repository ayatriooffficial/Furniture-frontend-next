import React  from 'react';
import 'react-datepicker/dist/react-datepicker.css';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

const Calendar = () => {


  return (
    <div className='py-12'>
      <h3 className='mb-1 text-xl font-semibold'>Select check-in date</h3>
      <span className='font-normal text-sm text-gray-500'>Add your travel dates for exact pricing</span>
      <div className="calendar-container mt-4 flex">
        
      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar />
    </LocalizationProvider>

      </div>
    </div>
  );
};

export default Calendar;
