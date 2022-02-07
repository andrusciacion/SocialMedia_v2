import React, { useEffect, useState } from 'react';
import styles from './Feed.module.css';
import NoImage from '../../images/NoImage.png';

export default function Feed(props) {
  const [rows, setRows] = useState(1);
  const [userImage, setUserImage] = useState(NoImage);

  useEffect(() => {
    setRows(props.post.split(/\r\n|\r|\n/).length);
    props.user.image !== undefined
      ? setUserImage(props.user.image)
      : setUserImage(NoImage);
  }, [props]);

  return (
    <div className={styles.Parent}>
      <header>
        <img src={userImage} alt='Image' />
        <div>
          <p className={styles.UserName}>
            {props.user.firstName + ' ' + props.user.lastName}
          </p>
          <p className={styles.DateTime}>{props.dateAndTime}</p>
        </div>
      </header>
      <div name='post' rows={rows} className={styles.Feed} readOnly>
        {props.post}
      </div>
    </div>
  );
}
