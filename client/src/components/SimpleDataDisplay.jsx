import React from "react"


const SimpleDataDisplay = (props) => {
  return (
    <div className='bg-neutral-800 m-1 min-h-[160px] max-h-[160px]'>
      <h3 className='text-left ml-4 mt-4 text-sm text-slate-300'>{props.label}:</h3>
      <h2 className='text-[#ff3300]'>{props.metric}</h2>
    </div>
  )
};

export default SimpleDataDisplay;
