import {useEffect,useState} from 'react';
import DebugTraceDisplay from './DebugTraceDisplay'
import spinner from '../assets/pulse-1.1s-200px.svg';
//import './HomeDisplay.css';
import TraceSelector from './TraceSelector'
import TraceFilters from './TraceFilters';

function TraceList (props) {


  function refreshData() {
    //clears Traces table from redis
    fetch('/clearTraces', {
      method: 'GET',
    }).then((result) => {
      console.log(result);
    });
    //changes refresh which fires off useEffect(in dashboard.jsx) to fetch new data
    props.setRefresh(!props.refresh);
  }
  return (
    <div className='relative flex'>
      <div >
        {props.loading && (
          <img className='loading-spinner' src={spinner} alt='Loading' />
        )}
      </div>
      <TraceSelector traces={props.traces}
                start_value={props.start_value}
                end_value={props.end_value} 
                setCurrentTrace = {props.setCurrentTrace} />
      <div style={{flexDirection: 'column', width: '100%'}}>
        <TraceFilters handleRefreshData={refreshData} 
              start_value={props.start_value} onChangeStart={props.onChangeStart}
              end_value={props.end_value} onChangeEnd={props.onChangeEnd}/>
        <DebugTraceDisplay trace={props.traces[props.currentTrace]} />
      </div>
    </div>
  );
}
export default TraceList;
