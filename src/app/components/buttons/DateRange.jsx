import { addDays } from 'date-fns';
import { useState } from 'react';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file

import React from 'react'

function DatePickerPage({onDateChange}) {
    const [state, setState] = useState([
        {
          startDate: addDays(new Date(), -7),
          endDate: new Date(),
          key: 'selection'
        }
      ]);

      const handleDateChange = (item) => {
        onDateChange([item.selection]);
        setState([item.selection])
      }
  return (
    <div>
        <DateRangePicker
  onChange={(item) => handleDateChange(item)}
  showSelectionPreview={true}
  moveRangeOnFirstSelection={false}
  months={2}
  maxDate={addDays(new Date(), 0)}
  ranges={state}
  direction="horizontal"
/>
    </div>
  )
}

export default DatePickerPage