import React, { useEffect, useState } from 'react';
import styles from './FriendsPage.module.css';
import { Scrollbars } from 'react-custom-scrollbars-2';
import Navigation from '../../components/NavigationBar/NavigationBar';
import NoImage from '../../images/NoImage.png';
import { Link, useLocation } from 'react-router-dom';

const URL_REQUEST = 'http://localhost:3004/users_data/';

export default function FriendsPage(props) {
  const [friends, setFriends] = useState([]);

  const location = useLocation();

  useEffect(() => {
    getFriends();
  }, []);

  const getFriends = async () => {
    let newArray = [];
    location.state.map(async (id, key) => {
      await fetch(URL_REQUEST + `${id}`, {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((data) => newArray.push(data));
      if (key === location.state.length - 1) setFriends(newArray);
    });
  };

  return (
    <>
      <Navigation />
      <div className={styles.Parent}>
        <div className={styles.Title}>My friends</div>
        <Scrollbars>
          <div className={styles.FriendsGallery}>
            {friends.map((friend) => (
              <Link
                to='/profile'
                style={{
                  textDecoration: 'none',
                  color: 'black',
                  width: 200,
                  height: 250,
                }}
                state={friend.id}
              >
                <div className={styles.Friend}>
                  <img src={NoImage} alt='' />
                  <h6>
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
