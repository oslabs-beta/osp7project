import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleDataDisplay from './SimpleDataDisplay';
import { PieChart } from 'react-minimal-pie-chart';
import spinner from '../assets/pulse-1.1s-200px.svg';
import './HomeDisplay.css';

const getStartLocale = (startSec) => {
  let start = new Date(0);
  start.setUTCSeconds(startSec);
  return start.toLocaleString();
};

const flattenTrace = (trace) => {
  const result = [];
  if (!trace) return;

  const process = (node) => {
    const nr = {};
    const n = node.fullData.Document;

    if (n['start_time']) nr.start_time = getStartLocale(n['start_time']);
    if (n['start_time'] && n['end_time'])
      nr.duration = Math.floor((n['end_time'] - n['start_time']) * 1000) / 1000;
    nr.name = n['name'];
    if (n.http && n.http.response) nr.status = n.http.response.status;
    if (n.cause) {
      nr.cause = n.cause.message;
      for (const e in n.cause.exceptions) {
        nr.cause += n.cause.exceptions[e].message;
      }
    }
    if (n.error) nr.error = 'yes';
    if (n.origin) nr.origin = n.origin;
    if (n.subsegments) {
      let c = 0;
      for (let i = 0; i < n.subsegments.length; i++) {
        c++;
      }
      nr.subsegments = c;
    }

    for (const c in node.children) {
      process(node.children[c]);
    }

    result.push(nr);
  };

  process(trace);

  return result;
};

const traceHasErrors = (trace) => {
  let segmentQueue = [];
  segmentQueue.push(trace);
  while (segmentQueue.length) {
    let s = segmentQueue.pop();
    s.children.forEach((segment) => segmentQueue.push(segment));
    if (s.fullData && s.fullData.Document.error) return true;
  }
  return false;
}

const getFromRight = (s) => {
  let result = '';
  for (let i = s.length-1; i >= 0; i--) {
    if (s[i] == '/') return result;
      result = s[i] + result;
    }
  return result;
}

const uniqueFunctions = (traces) => {
  const uniques = {};
  for (const t in traces) {
    if (traces[t].fullData && traces[t].fullData.Document.http.request) {
      const u = getFromRight(traces[t].fullData.Document.http.request.url);
      if (!uniques[u]) uniques[u] = 0;
      uniques[u]++;
    }
  }
  return uniques;
}

const tallyOrigins = (flattenedTrace) => {
  const result = {};

  for (const f in flattenedTrace) {
    let origin = flattenedTrace[f].origin;
    if (result[origin]) result[origin]++;
    else result[origin] = 1;
  }

  return result;
};

const tallyToCircle = (tally) => {
  const result = [];
  const colors = ['#E38627', '#C13C37', '#6A2135'];
  let curColor = 0;
  for (const k in tally) {
    const r = {};
    r.title = k;
    r.value = tally[k];
    r.color = colors[curColor];
    curColor++;
    if (curColor >= colors.length) curColor = 0;
    result.push(r);
  }
  return result;
};

const uniqueFunctionsToCircle = (uniqueFunctions) => {
  const result = [];
  const colors = ['#E38627', '#C13C37', '#6A2135'];
  let curColor = 0;
  for (const k in uniqueFunctions) {
    const r = {};
    r.title = k;
    r.value = uniqueFunctions[k];
    r.color = colors[curColor];
    curColor++;
    if (curColor >= colors.length) curColor = 0;
    result.push(r);
  }

  return result;
}

const HomeDisplay = (props) => {

    const invocationCount = props.traces ? props.traces.length : 0;
    let successCount = 0;
    let errorCount = 0;
    for (const t in props.traces) {
      const n = props.traces[t];
      if (traceHasErrors(n)) errorCount++;
      else successCount++;
    }

    let sumDuration = 0;
    let countDuration = 0;
    for (const t in props.traces) {
      const n = props.traces[t];
      if (n.averageTime) {
        sumDuration += n.averageTime;
        countDuration++;
      }
    }
    const avgDuration = (sumDuration > 0 ? Math.floor(sumDuration / countDuration * 1)/1 : 0) + ' ms';
  
    const origins = tallyToCircle(tallyOrigins(flattenTrace(props.traces[props.currentTrace])));
    
    const uniqueFuncs = uniqueFunctionsToCircle(uniqueFunctions(props.traces));
    

    return (
        <div className={'grid grid-cols-3 bg-neutral-900'}>
            {props.loading && (<img className='loading-spinner' src={spinner} alt='Loading' />)}
            <SimpleDataDisplay label={'Invocations'} metric={invocationCount} />
            <SimpleDataDisplay label={'Clean'} metric={successCount} />
            <SimpleDataDisplay label={'With Errors'} metric={errorCount} />
            <SimpleDataDisplay label={'Avg Duration'} metric={avgDuration} />
            <div className={'m-1 bg-neutral-800'}>
              <div className='text-left ml-4 mt-4 text-sm text-slate-300'>Unique Functions</div>
              <div className='p-4'>
              <PieChart
                data={uniqueFuncs}
                viewBoxSize={[100,100]}
                center={[50,50]}
                labelPosition={50}
                lengthAngle={360}
                lineWidth={55}
                paddingAngle={0}
                radius={50}
                startAngle={0}
                label={(props) => {return props.dataEntry.title} }
                labelStyle={{
                    fill: 'white',
                    fontSize: '4px'
               }}
                />
                </div>
            </div>
            <div className={'m-1 bg-neutral-800'}>
              <div className='text-left ml-4 mt-4 text-sm text-slate-300'>Origins</div>
              <div className='p-4'>
              <PieChart
                data={origins}
                viewBoxSize={[100,100]}
                center={[50,50]}
                labelPosition={50}
                lengthAngle={360}
                lineWidth={55}
                paddingAngle={0}
                radius={50}
                startAngle={0}
                label={(props) => {return props.dataEntry.title} }
                labelStyle={{
                    fill: 'white',
                    fontSize: '4px'
               }}
                />
                </div>
            </div>

        </div>
    )
}

export default HomeDisplay;
