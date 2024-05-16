import React, { useState }  from "react"
import DatePicker from 'react-datepicker';
//import 'react-calendar/dist/Calendar.css';
//import 'react-clock/dist/Clock.css';
import "react-datepicker/dist/react-datepicker.css"
import refreshIcon from '../assets/refresh-svgrepo-com.svg'

const TraceFilters = (props) => {

  console.log('PROPS: ', props)

  return (
    <div style={{width: '100%', verticalAlign: 'baseline'}}>
      <h3>Filters</h3>

      <span className='inline-block mx-2'>
        <span className='text-xs float-left'>Start Time:</span>
        <DatePicker
                      className='datepicker__override'
                      popperClassName='datepicker__popper__override'
                      selected={props.start_value}
                      onChange={props.onChangeStart}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={1}
                      timeCaption="time"
                      dateFormat="MMMM d, yyyy h:mm aa"
                  />
      </span>
      <span className='inline-block mx-2'>
        <span className='text-xs float-left'>End Time:</span>
        <DatePicker
                      className='datepicker__override'
                      popperClassName='datepicker__popper__override'
                      selected={props.end_value}
                      onChange={props.onChangeEnd}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={1}
                      timeCaption="time"
                      dateFormat="MMMM d, yyyy h:mm aa"
                  />
      </span>
      <span className='inline-block mx-2'>
        <span className='text-xs float-left'>Refresh:</span>
        <button onClick={props.handleRefreshData} style={{display: 'inline-block'}}>
         <img src={refreshIcon} width='24px'></img>
        </button>
      </span>
    </div>
  )
};

export default TraceFilters;
