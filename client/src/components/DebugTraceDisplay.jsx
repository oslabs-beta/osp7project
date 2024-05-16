import React from "react"
import  DataTable, { createTheme } from 'react-data-table-component'
import TraceFilters from './TraceFilters'

const columns = [
  {
    name: 'name',
    selector: row => row["name"],
    width:"250px",
    sortable: true,
  },
  {
    name: 'start time',
    selector: row => row["start_time"],
    width:"200px",
    sortable: true,
  },
  {
    name: 'duration',
    selector: row => row["duration"],
    width:"100px",
    sortable: true,
  },
  {
    name: 'error',
    selector: row => row["error"],
    width:"100px",
    sortable: true,
  },
  {
    name: 'cause',
    selector: row => row["cause"],
    width:"400px",
    wrap:true
  },
  {
    name: 'status',
    selector: row => row["status"],
    width:"100px",
    sortable: true,
  },
  {
    name: 'origin',
    selector: row => row["origin"],
    width:"200px",
    sortable: true,
  },
  {
    name: 'subsegments',
    selector: row => row["subsegments"],
    width:"200px",
    sortable: true,
  },
  {
    name: 'method',
    selector: row => row["method"],
    width:"200px",
    sortable: true,
  },
  {
    name: 'fulldata',
    selector: row => row["fullData"],
    width:"200px",
    sortable: true,
  },

  //{
  //  name: 'subsegments',
  //  selector: row => row["subsegments"],
  //  width:"200px",
  //},
]

createTheme('dark', {
    text: {
      primary: '#dddddd',
      secondary: '#2aa198',
    },
    background: {
      default: '#222222',
    },
    context: {
      background: '#cb4b16',
      text: '#FFFFFF',
    },
    divider: {
      default: '#073642',
    },
    action: {
      button: 'rgba(0,0,0,.54)',
      hover: 'rgba(0,0,0,.08)',
      disabled: 'rgba(0,0,0,.12)',
    },
  }, 'dark');

const getStartLocale = (startSec) => {
  let start = new Date(0);
  start.setUTCSeconds(startSec);
  return start.toLocaleString()
}
  

const flattenTrace = (trace) => { 
  const result = [];
  if (!trace) {
    console.log('Can\'t flatten trace; it doesn\'t exist!');
  }
  
  const process = (node) => {
    if (!node) {
      console.log('Error! No node...')
      return;
    }
    if (!node.fullData) {
      console.log('Error! Not getting full data from node...');
      return;
    }

    const nr = {};
    const n = node.fullData.Document;

    if (n['start_time']) nr.start_time = getStartLocale(n['start_time']);
    if (n['start_time'] && n['end_time']) nr.duration = Math.floor( (n['end_time'] - n['start_time']) * 1000)/1000;
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
  }

  process(trace);

  return result;
}

const DebugTraceDisplay = (props) => {

  return (
    <div className='relative overflow-x-scroll max-w-[85%]'>
      <h3>Segment Detail:</h3>
      <DataTable
        columns={columns}
        data={flattenTrace(props.trace)}
        theme="dark"
        //customStyles={customStyles}
       />
    </div>
  )
};

export default DebugTraceDisplay;
