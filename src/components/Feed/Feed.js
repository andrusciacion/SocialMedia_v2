import React, { useEffect, useState } from 'react';

import NoImage from '../../images/NoImage.png';

import styles from './Feed.module.css';

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
      <header className={styles.feedHeader}>
        <img className={styles.userImage} src={userImage} alt='' />
        <div className={styles.feedInformation}>
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
