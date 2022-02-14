import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { BsPersonPlus, BsFillPersonCheckFill } from 'react-icons/bs';

import NoImage from '../../images/NoImage.png';

import styles from './SearchModal.module.css';

const URL_REQUEST = 'http://localhost:3004/users_data/';

export default function ModalBox(props) {
  const [users, setUsers] = useState([]);
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [noUsers, setNoUsers] = useState('');
  const [nameUser, setNameUser] = useState('');
  const [userFriends, setUserFriends] = useState([]);

  useEffect(() => {
    setUsers(props.users);
    setMatchedUsers([]);
    setUserFriends(props.user.friends);
  }, [props]);

  const searchUsers = async (input) => {
    let match = [];
    let friend = false;
    setNameUser(input);
    if (input.length > 2) {
      let regex = new RegExp(input.replace(/\s/g, '') + '.+$', 'i');
      users.filter(function (user) {
        userFriends.indexOf(user.id) !== -1
          ? (friend = true)
          : (friend = false);

        `${user.firstName}${user.lastName}`.match(regex) !== null &&
          match.push({ user: user, friend: friend });
        return null;
      });

      if (match.length > 0) {
        setMatchedUsers(match);
      } else {
        setMatchedUsers([]);
        setNoUsers("Can't find any users");
      }
    } else {
      setMatchedUsers([]);
      setNoUsers('');
    }
  };

  const addFriend = async (id) => {
    let friends = [...userFriends, id];
    setUserFriends(friends);
    await fetch(URL_REQUEST + `${props.user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...props.user, friends: friends }),
    }).then(() => searchUsers(nameUser));
    setMatchedUsers(changeStatus(id));
  };

  const deleteFriend = async (id) => {
    let friends = [...userFriends];
    if (friends.length === 1) friends = [];
    friends.splice(friends.indexOf(id), 1);
    await fetch(URL_REQUEST + `${props.user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...props.user, friends: friends }),
    }).then(() => searchUsers(nameUser));
    setMatchedUsers(changeStatus(id));
  };

  const changeStatus = (id) => {
    let newArray = [];
    matchedUsers.forEach((user) => {
      if (user.user.id === id) {
        newArray.push({ user: user.user, friend: !user.friend });
      } else {
        newArray.push({ user: user.user, friend: user.friend });
      }
    });
    return newArray;
  };

  return (
    <Modal show={props.showModal}>
      <Modal.Header closeButton onClick={props.closeModal}>
        <Modal.Title>Search Friends</Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.modalBody}>
        <div className={styles.searchArea}>
          <input
            type='text'
            className={styles.inputStyle}
            placeholder='Type name here...'
            onChange={(e) => searchUsers(e.target.value)}
          />
          <div className={styles.friendsList}>
            {matchedUsers.length === 0 && (
              <p className={styles.searchingText}>
                {noUsers.length > 0
                  ? noUsers
                  : 'Users will be displayed here...'}
              </p>
            )}
            {matchedUsers.map(
              (item) =>
                item.user.id !== props.user.id && (
                  <div className={styles.matchedUser}>
                    <div className={styles.user}>
                      <img
                        className={styles.image}
                        src={
                          item.user.images.length !== 0
                            ? item.user.images[item.user.images.length - 1]
                            : NoImage
                        }
                        alt=''
                      />
                      <p className={styles.userName}>
                        {item.user.firstName}&nbsp;{item.user.lastName}
                      </p>
                    </div>
                    {item.friend ? (
                      <button
                        className={styles.button}
                        onClick={() => deleteFriend(item.user.id)}
                      >
                        <BsFillPersonCheckFill className={styles.iconAdd} />
                      </button>
                    ) : (
                      <button
                        className={styles.button}
                        onClick={() => addFriend(item.user.id)}
                      >
                        <BsPersonPlus className={styles.iconDelete} />
                      </button>
                    )}
                  </div>
                )
            )}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
