import React, { useEffect, useState } from 'react';
import styles from './Friends.module.css';
import NoImage from '../../images/NoImage.png';

export default function Friends(props) {
  const [friend, setFriend] = useState({ images: [] });
  const [userImage, setUserImage] = useState(NoImage);

  useEffect(() => {
    let images = props.user.item.images;
    setFriend(props.user.item);
    console.log(images);
    if (images.length !== 0) {
      setUserImage(images[images.length - 1]);
    } else {
      setUserImage(NoImage);
    }
  }, []);

  return (
    <div className={styles.Parent}>
      {props.display && <div className={styles.GreenDot} />}
      <img src={userImage} alt='' />
      <div className={styles.Name}>
        <p style={{ marginLeft: 15, marginRight: 5 }}>
          {friend.firstName + ' ' + friend.lastName}
        </p>
      </div>
    </div>
  );
}
