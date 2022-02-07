import React, { useEffect, useState } from 'react';
import styles from './Friends.module.css';
import NoImage from '../../images/NoImage.png';

const URL = 'http://localhost:3004/users_data/';

export default function Friends(props) {
  const [friend, setFriend] = useState({ images: [] });
  const [userImage, setUserImage] = useState(NoImage);

  useEffect(() => {
    getFriend();
  }, [props]);

  useEffect(() => {
    if (friend.images.length === 0) {
      setUserImage(NoImage);
    } else {
      setUserImage(friend.images[0]);
    }
  }, [friend]);

  const getFriend = async () => {
    await fetch(URL + `${props.user.item}`)
      .then((response) => response.json())
      .then((data) => setFriend(data));
  };

  return (
    <div className={styles.Parent}>
      {props.display && <div className={styles.GreenDot} />}
      <img src={userImage} alt={NoImage} />
      <div className={styles.Name}>
        <p style={{ marginLeft: 15, marginRight: 5 }}>
          {friend.firstName + ' ' + friend.lastName}
        </p>
      </div>
    </div>
  );
}
