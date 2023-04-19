import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import './Login.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFulltName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = (e) => {
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
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
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
      })
      .then((response) => {
        if (response.status === 201) {
          navigate('/dashboard');
        } else {
          alert('Error registering the user');
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
      <form className='auth-form signup-form'>
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

        <button
          className='login-btn'
          type='submit'
          onClick={(e) => {
            e.preventDefault();
            handleSignup(e);
          }}
        >
          Sign Up
        </button>

        <p className='already-have-account'>Already have an account?</p>
        <button className='signup-btn' onClick={() => navigate('/')}>
          LOGIN
        </button>
      </form>
    </div>
  );
};

export default Signup;
