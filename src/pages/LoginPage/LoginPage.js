import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import LoginImage from '../../images/LoginImage.svg';
import styles from './LoginPage.module.css';

const URL_REQUEST = 'http://localhost:3002/';

export default function LoginPage() {
  const [login, setLogin] = useState({ email: '', password: '' });
  const [loggedUser, setLoggedUser] = useState('');
  const [errMesage, setErrMessage] = useState('err');

  const navigation = useNavigate();

  useEffect(() => {
    let userID = localStorage.getItem('CurrentUserID');
    let token = document.cookie;
    if (userID !== null && token !== 'false') {
      navigation('/home', { replace: true });
    }
  }, []);

  useEffect(() => {
    if (loggedUser.user?.id !== undefined) {
      document.cookie = loggedUser.token;
      localStorage.setItem('CurrentUserID', loggedUser.user.id);
      navigation('/home', { replace: true });
    }
  }, [loggedUser]);

  const handleInput = (input) => {
    switch (input.target.name) {
      case 'email':
        setLogin((prevState) => ({ ...prevState, email: input.target.value }));
        break;
      case 'password':
        setLogin((prevState) => ({
          ...prevState,
          password: input.target.value,
        }));
        break;
      default:
        break;
    }
  };

  const loginAction = async () => {
    await fetch(URL_REQUEST + 'login', {
      method: 'POST',
      body: JSON.stringify(login),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          response
            .json()
            .then((data) => {
              throw data;
            })
            .catch((err) => setErrMessage(err));
        }
        return response.json();
      })
      .then((data) =>
        setLoggedUser({ user: data.user, token: data.accessToken })
      );
  };

  return (
    <div className={styles.Parent}>
      <div className={styles.LoginBox}>
        <div className={styles.InputData}>
          <label htmlFor='email'>Email</label>
          <input
            type='text'
            name='email'
            placeholder='Email'
            onChange={handleInput}
          />
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            name='password'
            placeholder='Password'
            onChange={handleInput}
          />
        </div>
        <p
          className={styles.ErrorMessage}
          style={{
            visibility: errMesage.length === 3 ? 'hidden' : 'visible',
          }}
        >
          {errMesage}
        </p>
        <button className={styles.Button} onClick={loginAction}>
          Log in
        </button>
        <p>or</p>
        <Link to='/register'>Create account</Link>
      </div>
      <img src={LoginImage} alt='' />
    </div>
  );
}
