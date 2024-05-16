import React, { useState, useEffect }  from "react"
import errorImage from '../assets/error-svgrepo-com.svg';


const getFromRight = (s) => {
  let result = '';
  for (let i = s.length-1; i >= 0; i--) {
    if (s[i] == '/') return result;
      result = s[i] + result;
    }
  return result;
}
  
const findErrorsInTrace = (trace) => {
  let errors = 0;
  
  const process = (node) => {
    if (node.fullData && node.fullData.Document.error) errors++;
    if (node.children) node.children.forEach((n) => {process(n)})
  }
  
  process(trace);
  return errors;
}

const TraceSelector = (props) => {
  const traces = [];
  for (let n = 0; n < props.traces.length; n++) {
    const url = props.traces[n].fullData.Document.http.request.url;
    const endpt = getFromRight(url)
    const startTime = props.traces[n].fullData.Document.start_time;
    const endTime = props.traces[n].fullData.Document.end_time;
    let startFilter;
    try {startFilter = props.start_value.getTime()}
    catch (e) {startFilter = props.start_value}
    startFilter /= 1000;
    let endFilter;
    try {endFilter = props.end_value.getTime()}
    catch (e) {endFilter = props.end_value}
    endFilter /= 1000;


    if (startTime >= startFilter && endTime <= endFilter) {
      let errors = findErrorsInTrace(props.traces[n]);
      traces.push(<button key={'tb'+Math.random()} 
                              onClick={() => props.setCurrentTrace(n)}
                              style={{fontSize: 'small'}}>
                              <span>{endpt + ' - '
                                  }
                              </span>
                              <span style={{fontSize: 'x-small'}}>
                              {props.traces[n].id}
                              </span>
                              <span style={{marginLeft: '4px'}}>
                                  {
                                      (errors ? (<img src={errorImage} width='16px'></img>) : '')
                                  }
                              </span>
                              <span style={{color: 'white', fontSize: 'x-small'}}>
                                  {
                                      (errors ? (' (' + errors + ' errors )') : '')
                                  }
                              </span>
                          </button>)
      }
    }



  return (
    <div className='flex flex-col w-[15%]'>
    <p>TraceList</p>
    {traces}
  </div>

  )
};

export default TraceSelector;
