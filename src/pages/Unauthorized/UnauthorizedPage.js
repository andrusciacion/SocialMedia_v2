import React from 'react';
import { useNavigate } from 'react-router-dom';

import Unauthorized from '../../images/Unauthorized.svg';

import styles from './UnauthorizedPage.module.css';

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
          <button className={styles.button} onClick={toLogin}>
            Login
          </button>
        </div>
      </div>
      <img src={Unauthorized} alt='' />
    </div>
  );
}
