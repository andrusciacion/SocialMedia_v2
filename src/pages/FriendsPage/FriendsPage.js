import React, { useEffect, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { Link, useLocation } from 'react-router-dom';

import Navigation from '../../components/NavigationBar/NavigationBar';
import NoImage from '../../images/NoImage.png';

import styles from './FriendsPage.module.css';

const URL_REQUEST = 'http://localhost:3004/users_data/';

export default function FriendsPage() {
  const [friends, setFriends] = useState([]);

  const location = useLocation();

  useEffect(() => {
    Promise.all([getFriends()]).then((data) =>
      data.map((friend) =>
        Promise.all(friend).then((friend) => setFriends(friend))
      )
    );
  }, []);

  const getFriends = () => {
    return location.state.map((id) =>
      fetch(URL_REQUEST + `${id}`).then((response) => response.json())
    );
  };

  return (
    <>
      <Navigation />
      <div className={styles.Parent}>
        <div className={styles.Title}>My friends</div>
        <Scrollbars>
          <div className={styles.FriendsGallery}>
            {friends?.map((friend, key) => (
              <Link
                key={key}
                to='/profile'
                className={styles.friendCard}
                state={friend.id}
              >
                <div className={styles.Friend}>
                  <img
                    className={styles.image}
                    src={
                      friend.images.length === 0
                        ? NoImage
                        : friend.images[friend.images.length - 1]
                    }
                    alt=''
                  />
                  <h6 className={styles.userName}>
                    {friend.firstName}&nbsp;{friend.lastName}
                  </h6>
                </div>
              </Link>
            ))}
          </div>
        </Scrollbars>
      </div>
    </>
  );
}
