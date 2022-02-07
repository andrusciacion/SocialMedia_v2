import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { BsPersonPlus, BsFillPersonCheckFill } from 'react-icons/bs';
import NoImage from '../images/NoImage.png';

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
      for (let item in users) {
        if (
          `${users[item].firstName}${users[item].lastName}`
            .toLowerCase()
            .indexOf(input.toLowerCase().replace(/\s/g, '')) > -1
        ) {
          props.user.friends.indexOf(users[item].id) !== -1
            ? (friend = true)
            : (friend = false);
        }
        match.push({ user: users[item], friend: friend });
      }

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
    matchedUsers.map((user) => {
      if (user.user.id === id) {
        newArray.push({ user: user.user, friend: !user.friend });
      } else {
        newArray.push({ user: user.user, friend: user.friend });
      }
    });
    return newArray;
  };

  return (
    <Modal show={props.showModal} style={{ marginTop: '5%' }}>
      <Modal.Header closeButton onClick={props.closeModal}>
        <Modal.Title>Search Friends</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ height: 250 }}>
        <div style={styles.searchArea}>
          <input
            type='text'
            style={styles.inputStyle}
            placeholder='Type name here...'
            onChange={(e) => searchUsers(e.target.value)}
          />
          <div style={styles.friendsList}>
            {matchedUsers.length === 0 && (
              <p
                style={{
                  width: '100%',
                  textAlign: 'center',
                  marginTop: '10%',
                  fontSize: 18,
                  color: 'gray',
                }}
              >
                {noUsers.length > 0
                  ? noUsers
                  : 'Users will be displayed here...'}
              </p>
            )}
            {matchedUsers.map((item) => {
              if (item.user.id !== props.user.id) {
                return (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '90%',
                      marginInline: 'auto',
                    }}
                  >
                    <div style={styles.user}>
                      <img src={NoImage} alt='Image' style={styles.image} />
                      <p style={{ marginLeft: 20 }}>
                        {item.user.firstName}&nbsp;{item.user.lastName}
                      </p>
                    </div>
                    {item.friend ? (
                      <button
                        style={{
                          border: 'none',
                          backgroundColor: 'transparent',
                        }}
                        onClick={() => deleteFriend(item.user.id)}
                      >
                        <BsFillPersonCheckFill style={{ fontSize: 30 }} />
                      </button>
                    ) : (
                      <button
                        style={{
                          border: 'none',
                          backgroundColor: 'transparent',
                        }}
                        onClick={() => addFriend(item.user.id)}
                      >
                        <BsPersonPlus style={{ fontSize: 30, zIndex: -1 }} />
                      </button>
                    )}
                  </div>
                );
              }
            })}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

const styles = {
  searchArea: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  inputStyle: {
    paddingLeft: 15,
    marginInline: 'auto',
    width: '70%',
    borderRadius: 10,
    fontSize: 18,
    outline: 'none',
    border: 'none',
    boxShadow: '0px 0px 8px 5px rgba(34, 60, 80, 0.2)',
  },
  friendsList: {
    overflow: 'auto',
    marginInline: 'auto',
    width: '100%',
  },
  user: {
    display: 'flex',
    alignItems: 'center',
    height: 50,
    backgroundColor: 'rgba(128, 128, 128, 0.2)',
    marginBlock: 10,
    width: '80%',
    marginLeft: 10,
    borderRadius: 10,
    marginRight: 30,
  },
  image: {
    marginLeft: 20,
    marginBlock: 'auto',
    width: 40,
    height: 40,
    borderRadius: '50%',
  },
};
