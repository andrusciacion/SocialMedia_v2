import React from 'react';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

import Error from '../../images/404Error.svg';

import styles from './ErrorPage.module.css';

export default function ErrorPage() {
  let navigation = useNavigate();

  const goBack = () => {
    navigation(-1);
  };

  return (
    <div className={styles.Parent}>
      <button className={styles.button} onClick={goBack}>
        <AiOutlineArrowLeft className={styles.icon} />
      </button>
      <img className={styles.image} src={Error} alt='' />
    </div>
  );
}
