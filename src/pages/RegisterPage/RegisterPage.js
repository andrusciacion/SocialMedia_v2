import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import CreateImage from '../../images/CreateAccount.svg';

import styles from './RegisterPage.module.css';

const URL_REGISTER = 'http://localhost:3002/register';
const URL_DATA = 'http://localhost:3004/users_data';

export default function RegisterPage() {
  const [user, setUser] = useState({});
  const [userData, setUserData] = useState({});
  const [rePassword, setRePassword] = useState('');
  const [errMessage, setErrMessage] = useState({
    date: true,
    email: true,
    password: true,
  });
  const [requestError, setRequestError] = useState('');
  const [passwordCheck, setPasswordCheck] = useState({
    upper: false,
    lower: false,
    numbers: false,
    length: false,
  });

  const navigation = useNavigate();

  // useEffect(() => {
  //   navigation('/home', { replace: true });
  // }, []);

  const handleInput = (input) => {
    let value = input.target.value;
    switch (input.target.name) {
      case 'first-name':
        setUserData((prevState) => ({
          ...prevState,
          firstName: String(value).trim(),
        }));
        break;
      case 'last-name':
        setUserData((prevState) => ({
          ...prevState,
          lastName: String(value).trim(),
        }));
        break;
      case 'birth':
        let date = new Date();
        let currentDate = `${date.getFullYear() - 16}-${
          date.getUTCMonth() + 1
        }-${date.getUTCDate()}`;

        if (new Date(value) <= new Date(currentDate)) {
          setUserData((prevState) => ({ ...prevState, dateOfBirth: value }));
          setErrMessage((prevState) => ({ ...prevState, date: true }));
        } else {
          setErrMessage((prevState) => ({ ...prevState, date: false }));
        }
        break;
      case 'email':
        setErrMessage((prevState) => ({ ...prevState, email: true }));
        setUser((prevState) => ({ ...prevState, email: value }));
        break;
      case 'password':
        checkPassword(value);
        setErrMessage((prevState) => ({ ...prevState, password: true }));
        setUser((prevState) => ({ ...prevState, password: value }));
        break;
      case 're-password':
        setErrMessage((prevState) => ({ ...prevState, password: true }));
        setRePassword(value);
        break;
      default:
        break;
    }
  };

  const registerUser = async (event) => {
    event.preventDefault();
    for (let param in passwordCheck) {
      if (passwordCheck[param] === false) {
        setErrMessage((prevState) => ({ ...prevState, password: false }));
        return;
      }
    }
    if (user.password !== rePassword) {
      setErrMessage((prevState) => ({ ...prevState, password: false }));
      return;
    } else {
      fetch(URL_REGISTER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      }).then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            setUserDataInfo(data.user.id);
          });
        } else {
          response
            .json()
            .then((data) => {
              throw data;
            })
            .catch((err) => {
              setErrMessage((prevState) => ({ ...prevState, email: false }));
              setRequestError(err);
            });
        }
      });
    }
  };

  const setUserDataInfo = (id) => {
    fetch(URL_DATA, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...userData,
        friends: [],
        posts: [],
        images: [],
        online: false,
        id: id,
      }),
    }).then(() => {
      navigation('/', { replace: true });
      alert('User created');
    });
  };

  const checkPassword = (password) => {
    let regexLower = /[a-z]{2,}/g;
    let regexUpper = /[A-Z]{2,}/g;
    let regexNumber = /[0-9]{2,}/g;
    if (password.length >= 6) {
      setPasswordCheck((prevState) => ({ ...prevState, length: true }));
    } else {
      setPasswordCheck((prevState) => ({ ...prevState, length: false }));
    }
    if (regexLower.test(password)) {
      setPasswordCheck((prevState) => ({ ...prevState, lower: true }));
    } else {
      setPasswordCheck((prevState) => ({ ...prevState, lower: false }));
    }
    if (regexUpper.test(password)) {
      setPasswordCheck((prevState) => ({ ...prevState, upper: true }));
    } else {
      setPasswordCheck((prevState) => ({ ...prevState, upper: false }));
    }
    if (regexNumber.test(password)) {
      setPasswordCheck((prevState) => ({ ...prevState, numbers: true }));
    } else {
      setPasswordCheck((prevState) => ({ ...prevState, numbers: false }));
    }
  };

  return (
    <div className={styles.Parent}>
      <div className={styles.CreateForm}>
        <h1 className={styles.title}>Create new account</h1>
        <form className={styles.form} onSubmit={registerUser}>
          <label className={styles.label} htmlFor='first-name'>
            First Name
          </label>
          <input
            className={styles.input}
            type='text'
            name='first-name'
            placeholder='First Name'
            onChange={handleInput}
            required
          />
          <label className={styles.label} htmlFor='last-name'>
            Last Name
          </label>
          <input
            className={styles.input}
            type='text'
            name='last-name'
            placeholder='Last Name'
            onChange={handleInput}
            required
          />
          <label className={styles.label} htmlFor='birth'>
            Date of birth
          </label>
          <input
            className={styles.input}
            type='date'
            name='birth'
            style={
              errMessage.date === false
                ? { backgroundColor: 'red' }
                : { backgroundColor: 'rgba(255,255,255,0.8)' }
            }
            onChange={handleInput}
            required
          />
          <label className={styles.label} htmlFor='email'>
            Email
          </label>
          <input
            className={styles.input}
            type='email'
            name='email'
            placeholder='Email'
            style={
              errMessage.email === false
                ? { backgroundColor: 'red' }
                : { backgroundColor: 'rgba(255,255,255,0.8)' }
            }
            onChange={handleInput}
            required
          />
          <label className={styles.label} htmlFor='password'>
            Password
          </label>
          <input
            className={styles.input}
            type='password'
            name='password'
            placeholder='Password'
            style={
              errMessage.password === false
                ? { backgroundColor: 'red' }
                : { backgroundColor: 'rgba(255,255,255,0.8)' }
            }
            onChange={handleInput}
            required
          />
          <label className={styles.label} htmlFor='re-password'>
            Retype Password
          </label>
          <input
            className={styles.input}
            type='password'
            name='re-password'
            placeholder='Retype Password'
            onChange={handleInput}
            required
          />
          <ul className={styles.list}>
            <li
              style={
                passwordCheck.upper
                  ? { color: 'green' }
                  : { color: 'rgb(220,0,0)' }
              }
            >
              2 uppercase letters
            </li>
            <li
              style={
                passwordCheck.lower
                  ? { color: 'green' }
                  : { color: 'rgb(220,0,0)' }
              }
            >
              2 lowercase letters
            </li>
            <li
              style={
                passwordCheck.numbers
                  ? { color: 'green' }
                  : { color: 'rgb(220,0,0)' }
              }
            >
              2 numbers
            </li>
            <li
              style={
                passwordCheck.length
                  ? { color: 'green' }
                  : { color: 'rgb(220,0,0)' }
              }
            >
              at least 6 characters
            </li>
          </ul>
          <p
            className={styles.errorMessage}
            hidden={errMessage.date === true && errMessage.password === true}
          >
            Check for correct data input
          </p>
          <p className={styles.errorMessage} hidden={errMessage.email === true}>
            {requestError}
          </p>
          <button className={styles.button}>Create</button>
        </form>
        <div className={styles.LogIn}>
          or if you have an account&ensp;{' '}
          <Link className={styles.link} to='/'>
            Log in
          </Link>
        </div>
      </div>
      <img className={styles.image} src={CreateImage} alt='' />
    </div>
  );
}
