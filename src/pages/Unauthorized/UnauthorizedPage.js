import React from 'react';
import styles from './Unauthorized.module.css';
import Unauthorized from '../../images/Unauthorized.svg';
import Login_unauthorized from '../../images/Login_unauthorized.svg';
import { useNavigate } from 'react-router-dom';

export default function UnauthorizedPage() {
  let navigate = useNavigate();

  const toLogin = () => {
    navigate('/', { replace: true });
  };
  return (
    <div className={styles.parent}>
      <div className={styles.loginArea}>
        <div>
          <div> If you want to continue, please</div>
          <button onClick={toLogin}>Login</button>
        </div>
      </div>
      <img src={Unauthorized} alt='' />
    </div>
  );
}
