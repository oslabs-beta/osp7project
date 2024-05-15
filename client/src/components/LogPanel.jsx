import React, { useEffect, useState } from 'react';
import DataTable, { createTheme } from 'react-data-table-component';
import sampleLog from '../assets/sampleLog';

const columns = [
  {
    name: 'timestamp',
    selector: (row) => row['timestamp'],
    width: '180px',
    format: d => {
      return (new Date(d.timestamp).toLocaleString() )
    }
  },
  {
    name: 'message',
    selector: (row) => row['message'],
    width: '800px',
    wrap: true
  },
  {
    name: 'logStreamName',
    selector: (row) => row['logStreamName'],
    width: '350px',
  },
  {
    name: 'eventId',
    selector: row => row["eventId"],
    width:"350px"
  },
];

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


const customStyles = {
  rows: {
    style: {
      minHeight: '72px', // override the row height
    },
  },
  headCells: {
    style: {
      paddingLeft: '8px', // override the cell padding for head cells
      paddingRight: '8px',
    },
  },
  cells: {
    style: {
      paddingLeft: '8px', // override the cell padding for data cells
      paddingRight: '8px',
    },
  },
};



const LogPanel = (props) => {

  return (
    <div className='bg-neutral-800 w-1/2 relative right-0 scroll-auto'>
      <h3>Log Detail:</h3>
      <DataTable
            columns={columns}
            data={props.traceLogData}
            theme="dark"
            //customStyles={customStyles}
        />
    </div>
  );
};

export default LogPanel;
