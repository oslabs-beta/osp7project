import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Reaptcha from 'reaptcha';
import './Login.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFulltName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [captcha, setCaptcha] = useState('');

  const navigate = useNavigate();

  const handleSignup = (e) => {
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    /*
    if (captcha !== 'passed') {
      setErrorMessage('Captcha required');
      return;
    }*/

    const userData = {
      email,
      password,
      fullName,
    };

    fetch('/createUser', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        console.log(response);
        if (response.status === 201) {
          navigate('/dashboard');
        } else if (response.status === 409) {
          setErrorMessage('Email already exists');
        }
      })
      .catch((error) => {
        console.log('Error:', error);
      });
  };

  return (
    <div>
      <NavBar />
      <div className='background'>
        <div className='shape'></div>
        <div className='shape'></div>
      </div>
      <form
        className='auth-form signup-form'
        onSubmit={(e) => {
          e.preventDefault();
          handleSignup(e);
        }}
      >
        {errorMessage && <p className='error-message'>{errorMessage}</p>}

        <h3>Sign Up</h3>
        <label htmlFor='fullName'>First and Last Name</label>
        <input
          type='text'
          id='fullName'
          required
          onChange={(e) => setFulltName(e.target.value)}
        />

        <label htmlFor='email'>Email</label>
        <input
          type='email'
          id='email'
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor='password'>Password</label>
        <input
          type='password'
          id='password'
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <label htmlFor='confirm-password'>Confirm Password</label>
        <input
          type='password'
          id='confirm-password'
          required
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {/*        <div className='captcha'>
          <Reaptcha
            sitekey={import.meta.env.VITE_CAPTCHA_KEY}
            onVerify={() => setCaptcha('passed')}
            required
          />
        </div> */}
        <button
          className='login-btn'
          type='submit'
          style={{ marginTop: '20px' }}
        >
          Sign Up
        </button>

        <p className='already-have-account'>Already have an account?</p>
        <button
          className='btn-login'
          onClick={() => navigate('/')}
          style={{ margin: 0 }}
        >
          LOGIN
        </button>
      </form>
    </div>
  );
};
export default Signup;
