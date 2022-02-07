import React from 'react';
import styles from './ErrorPage.module.css';
import Error from '../../images/404Error.svg';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

export default function ErrorPage() {
  let navigation = useNavigate();

  const goBack = () => {
    navigation(-1);
  };
  return (
    <div className={styles.Parent}>
      <button onClick={goBack}>
        <AiOutlineArrowLeft style={{ color: 'white' }} />
      </button>
      <img src={Error} alt='' />
    </div>
  );
}
