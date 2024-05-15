import React from 'react';
import './nav-bar.css';
import pulse from '../assets/pulse.svg';
import { Link } from 'react-router-dom';


const NavBar = (props) => {
  return (
    <div className='flex flex-row justify-between bg-neutral-900'>
      <div className='flex pl-2'>
        <Link to='/dashboard'>
          <img src={pulse} width='48px' alt='LambdaPulse' />
        </Link>
        <h1>LambdaPulse</h1>
      </div>
      <div id='links'>
        <p>
          <Link to='/about'>
            <span>About</span>
          </Link>
        </p>
        <p>
          <a href='https://github.com/oslabs-beta/LambdaPulse' target='_blank'>
            Docs
          </a>
        </p>
      </div>
    </div>
  );
};

export default NavBar;
