import React, { useEffect, useState } from 'react';
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
  }, [navigation]);

  useEffect(() => {
    if (loggedUser.user?.id !== undefined) {
      document.cookie = loggedUser.token;
      localStorage.setItem('CurrentUserID', loggedUser.user.id);
      navigation('/home', { replace: true });
    }
  }, [loggedUser, navigation]);

  const handleInput = (input) => {
    switch (input.target.name) {
      case 'email':
        setLogin((prevState) => ({ ...prevState, email: input.target.value }));
        setErrMessage('err');
        break;
      case 'password':
        setLogin((prevState) => ({
          ...prevState,
          password: input.target.value,
        }));
        setErrMessage('err');
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

  const handleKey = (event) => {
    if (event.key === 'Enter') {
      loginAction();
    }
  };

  return (
    <div className={styles.Parent}>
      <div className={styles.LoginBox}>
        <div className={styles.InputData}>
          <label className={styles.labels} htmlFor='email'>
            Email
          </label>
          <input
            className={styles.inputs}
            type='text'
            name='email'
            placeholder='Email'
            onChange={handleInput}
            onKeyPress={handleKey}
          />
          <label className={styles.labels} htmlFor='password'>
            Password
          </label>
          <input
            className={styles.inputs}
            type='password'
            name='password'
            placeholder='Password'
            onChange={handleInput}
            onKeyPress={handleKey}
          />
        </div>
        {errMesage.length !== 3 && (
          <p className={styles.ErrorMessage}>{errMesage}</p>
        )}

        <button className={styles.Button} onClick={loginAction}>
          Log in
        </button>
        <p className={styles.paragraphText}>or</p>
        <Link className={styles.link} to='/register'>
          Create account
        </Link>
      </div>
      <img className={styles.image} src={LoginImage} alt='' />
    </div>
  );
}
